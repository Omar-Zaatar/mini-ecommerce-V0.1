import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Alert, Snackbar,
    CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TablePagination
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { updateOrderStatus } from '../data/api';
import { STATUS_OPTIONS, normalizeStatus, formatMoney } from '../utils/dashboardStats';
import StatusChip from '../components/admin/StatusChip';
import OrderStatusDialog from '../components/admin/OrderStatusDialog';

function AdminOrdersPage() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { orders, loading, error, reload, refresh } = useDashboardData(token);

        const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

        const [dialogOrder, setDialogOrder] = useState(null);       const [dialogError, setDialogError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState(null);                
        useEffect(() => { setPage(0); }, [search, statusFilter, rowsPerPage]);

    const filteredOrders = useMemo(() => {
        const text = search.trim().toLowerCase();
        return orders.filter(order => {
            if (statusFilter !== 'All' && normalizeStatus(order.status) !== statusFilter) return false;
            if (!text) return true;
            return String(order.orderID).includes(text) ||
                order.customerName.toLowerCase().includes(text);
        });
    }, [orders, search, statusFilter]);

    const pageOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const openDialog = (order) => {
        setDialogError(null);
        setDialogOrder(order);
    };

        const handleSave = async (apiStatus, label) => {
        setSaving(true);
        setDialogError(null);
        try {
            await updateOrderStatus(dialogOrder.orderID, apiStatus, token);
            await refresh();               setSnack({ severity: 'success', text: `Order #${dialogOrder.orderID} marked as ${label}` });
            setDialogOrder(null);           } catch (err) {
            setDialogError(err.message);           }
        setSaving(false);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress />
            <Typography>Loading orders...</Typography>
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
        <Box sx={{ p: { xs: 2, md: '20px 30px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Orders</Typography>

            <Paper sx={{ p: 2, borderRadius: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    size="small" label="Search order # or customer"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 240 }}
                />
                <TextField
                    select size="small" label="Status"
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    {STATUS_OPTIONS.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </TextField>
            </Paper>

            <Paper sx={{ borderRadius: 2.5 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order #</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pageOrders.map(order => {
                                                                        const current = normalizeStatus(order.status);
                                    const canChange = current === 'Pending' || current === 'Shipped';

                                    return (
                                        <TableRow key={order.orderID} hover>
                                            <TableCell>#{order.orderID}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">{formatMoney(order.totalAmount)}</TableCell>
                                            <TableCell><StatusChip status={order.status} /></TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    <Button
                                                        size="small" variant="contained"
                                                        disabled={!canChange}
                                                        onClick={() => openDialog(order)}
                                                    >
                                                        Status
                                                    </Button>
                                                    <Button
                                                        size="small" variant="outlined"
                                                        onClick={() => navigate(`/admin/orders/${order.orderID}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredOrders.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
                    rowsPerPageOptions={[10, 20, 50]}
                />
            </Paper>
            <OrderStatusDialog
                open={!!dialogOrder}
                order={dialogOrder}
                saving={saving}
                error={dialogError}
                onClose={() => setDialogOrder(null)}
                onSave={handleSave}
            />

            <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
                <Alert severity={snack?.severity || 'info'} onClose={() => setSnack(null)}>
                    {snack?.text}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AdminOrdersPage;