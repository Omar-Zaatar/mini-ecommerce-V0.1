import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { normalizeStatus, formatMoney } from './dashboardStats';

const BLUE = [0, 123, 255];

export const exportDashboardPdf = ({ totalProducts, totalCustomers, stats, filters }) => {
    const doc = new jsPDF();       const today = new Date();
    let y = 18;                
        doc.setFontSize(18);
    doc.text('Mini E-Commerce: Admin Report', 14, y);

    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${today.toLocaleString()}`, 14, y);

    y += 5;
    doc.text(
        `Date range: ${filters.startDate || 'Any'} to ${filters.endDate || 'Any'}   |   Status: ${filters.status}`,
        14, y
    );
    doc.setTextColor(0);
    y += 8;

        const addTable = (title, head, body, emptyText) => {
                if (y > 245) {
            doc.addPage();
            y = 18;
        }

        doc.setFontSize(13);
        doc.text(title, 14, y);

        if (body.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text(emptyText, 14, y + 8);
            doc.setTextColor(0);
            y += 18;
            return;
        }

        autoTable(doc, {
            startY: y + 3,
            head: [head],
            body,
            styles: { fontSize: 9 },
            headStyles: { fillColor: BLUE }
        });
        y = doc.lastAutoTable.finalY + 10;
    };

        addTable('Summary', ['Metric', 'Value'], [
        ['Total Products', String(totalProducts)],
        ['Total Orders', String(stats.totalOrders)],
        ['Total Customers', String(totalCustomers)],
        ['Total Sales (completed orders)', formatMoney(stats.totalSales)]
    ], '');

    addTable(
        'Orders by Status',
        ['Status', 'Orders'],
        stats.byStatus.map(item => [item.name, String(item.value)]),
        'No orders for the selected filters.'
    );

    addTable(
        'Monthly Sales',
        ['Month', 'Sales'],
        stats.monthly.map(item => [item.month, formatMoney(item.sales)]),
        'No completed orders for the selected filters.'
    );

    addTable(
        'Top 5 Selling Products',
        ['Product', 'Quantity sold'],
        stats.topProducts.map(item => [item.name, String(item.quantity)]),
        'No sales for the selected filters.'
    );

   

        const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(130);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
    }

        doc.save(`dashboard-report-${today.toISOString().slice(0, 10)}.pdf`);
};