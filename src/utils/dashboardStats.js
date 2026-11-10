export const COMPLETED_STATUSES = ['Completed', 'Delivered'];

export const STATUS_OPTIONS = ['All', 'Pending', 'Shipped', 'Completed', 'Cancelled'];

export const STATUS_COLORS = {
    Pending: '#ffc107',
    Shipped: '#17a2b8',
    Completed: '#28a745',
    Cancelled: '#dc3545'
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const normalizeStatus = (status) =>
    COMPLETED_STATUSES.includes(status) ? 'Completed' : status;

const isCompleted = (order) => normalizeStatus(order.status) === 'Completed';

export const filterByDate = (orders, startDate, endDate) => {
    return orders.filter(order => {
        const date = new Date(order.orderDate);
        if (startDate && date < new Date(startDate + 'T00:00:00')) return false;
        if (endDate && date > new Date(endDate + 'T23:59:59.999')) return false;
        return true;
    });
};

export const filterByStatus = (orders, status) => {
    if (status === 'All') return orders;
    return orders.filter(order => normalizeStatus(order.status) === status);
};

export const getTotalSales = (orders) => {
    return orders
        .filter(isCompleted)
        .reduce((sum, order) => sum + order.totalAmount, 0);
};

export const getOrdersByStatus = (orders) => {
    const counts = {};
    orders.forEach(order => {
        const status = normalizeStatus(order.status);
        counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const getMonthlySales = (orders) => {
    const totals = {};   
    orders.filter(isCompleted).forEach(order => {
        const date = new Date(order.orderDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        totals[key] = (totals[key] || 0) + order.totalAmount;
    });

    return Object.keys(totals).sort().map(key => {
        const [year, month] = key.split('-');
        return {
            month: `${MONTHS[Number(month) - 1]} ${year}`,
            sales: Number(totals[key].toFixed(2))
        };
    });
};

export const getTopProducts = (items, orders, limit = 5) => {
    const validOrderIds = new Set(
        orders.filter(order => normalizeStatus(order.status) !== 'Cancelled')
            .map(order => order.orderID)
    );

    const totals = {};
    items.forEach(item => {
        if (!validOrderIds.has(item.orderID)) return;
        totals[item.productName] = (totals[item.productName] || 0) + item.quantity;
    });

    return Object.entries(totals)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);
};

export const getRecentOrders = (orders, limit = 5) => {
    return [...orders]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, limit);
};

export const formatMoney = (value) =>
    '$' + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const getMonthlySalesDetails = (orders, items) => {
    const byMonth = {};            const monthOfOrder = {};   
    orders.filter(isCompleted).forEach(order => {
        const date = new Date(order.orderDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!byMonth[key]) byMonth[key] = { orders: [], products: {} };
        byMonth[key].orders.push(order);
        monthOfOrder[order.orderID] = key;
    });

        items.forEach(item => {
        const key = monthOfOrder[item.orderID];
        if (!key) return;           const product = byMonth[key].products[item.productName]
            || { name: item.productName, quantity: 0, revenue: 0 };
        product.quantity += item.quantity;
        product.revenue += item.totalAmount;
        byMonth[key].products[item.productName] = product;
    });

        let previousRevenue = null;
    const result = Object.keys(byMonth).sort().map(key => {
        const month = byMonth[key];
        const revenue = month.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const products = Object.values(month.products).sort((a, b) => b.revenue - a.revenue);
        const change = previousRevenue
            ? ((revenue - previousRevenue) / previousRevenue) * 100
            : null;
        previousRevenue = revenue;

        const [year, monthNumber] = key.split('-');
        return {
            key,
            label: `${MONTHS[Number(monthNumber) - 1]} ${year}`,
            orders: month.orders.length,
            itemsSold: products.reduce((sum, p) => sum + p.quantity, 0),
            revenue,
            averageOrder: revenue / month.orders.length,
            change,
            products
        };
    });

    return result.reverse();   };