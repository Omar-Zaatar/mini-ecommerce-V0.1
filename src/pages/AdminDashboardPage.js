import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import {
    filterByDate, filterByStatus, getTotalSales, getOrdersByStatus,
    getMonthlySales, getTopProducts, getRecentOrders, formatMoney
} from '../utils/dashboardStats';
import { exportDashboardPdf } from '../utils/exportDashboardPdf';

import StatCard from '../components/admin/StatCard';
import StatusPieChart from '../components/admin/StatusPieChart';
import MonthlySalesChart from '../components/admin/MonthlySalesChart';
import TopProductsChart from '../components/admin/TopProductsChart';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import DashboardFilters from '../components/admin/DashboardFilters';
import ExportButton from '../components/admin/ExportButton';

function AdminDashboardPage() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { products, customers, orders, items, loading, error, reload } = useDashboardData(token);

        const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('All');

        const [exportError, setExportError] = useState(null);

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setStatus('All');
    };

        const dateOrders = useMemo(() => filterByDate(orders, startDate, endDate), [orders, startDate, endDate]);
    const statusOrders = useMemo(() => filterByStatus(dateOrders, status), [dateOrders, status]);

        const stats = useMemo(() => ({
        totalOrders: statusOrders.length,
        totalSales: getTotalSales(statusOrders),
        byStatus: getOrdersByStatus(dateOrders),           monthly: getMonthlySales(statusOrders),
        topProducts: getTopProducts(items, statusOrders),
        recent: getRecentOrders(statusOrders)
    }), [statusOrders, dateOrders, items]);

        const handleExport = () => {
        setExportError(null);
        try {
            exportDashboardPdf({
                totalProducts: products.length,
                totalCustomers: customers.length,
                stats,
                filters: { startDate, endDate, status }
            });
        } catch (err) {
            setExportError('Could not create the PDF. Please try again.');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress />
            <Typography>Loading dashboard...</Typography>
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Retry</Button>}>
                {error}
            </Alert>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: '20px 30px' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Admin Dashboard</Typography>
                <ExportButton onClick={handleExport} disabled={orders.length === 0} />
            </Box>

            {exportError && (
                <Alert severity="error" onClose={() => setExportError(null)}>
                    {exportError}
                </Alert>
            )}

            {orders.length === 0 && (
                <Alert severity="info">There are no orders yet.</Alert>
            )}
            <DashboardFilters
                startDate={startDate}
                endDate={endDate}
                status={status}
                onStartDate={setStartDate}
                onEndDate={setEndDate}
                onStatus={setStatus}
                onReset={handleReset}
            />
            <Box sx={{
                display: 'grid', gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }
            }}>
                <StatCard title="Total Products" value={products.length}
                    icon={<Inventory2Icon />} color="#007bff" />
                <StatCard title="Total Orders" value={stats.totalOrders}
                    icon={<ShoppingCartIcon />} color="#ffc107" />
                <StatCard title="Total Customers" value={customers.length}
                    icon={<PeopleIcon />} color="#17a2b8" />
                <StatCard title="Total Sales" value={formatMoney(stats.totalSales)}
                    icon={<AttachMoneyIcon />} color="#28a745" />
            </Box>
            <Box sx={{
                display: 'grid', gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
            }}>
                <StatusPieChart data={stats.byStatus} />
                <MonthlySalesChart data={stats.monthly} />
                <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                    <TopProductsChart data={stats.topProducts} />
                </Box>
            </Box>
            <RecentOrdersTable
                orders={stats.recent}
                onView={(orderId) => navigate(`/admin/orders/${orderId}`)}
            />
        </Box>
    );
}

export default AdminDashboardPage;