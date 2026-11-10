import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, Alert, Snackbar, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useAdminOrder } from '../hooks/useAdminOrder';
import { updateOrderStatus } from '../data/api';
import { normalizeStatus, formatMoney } from '../utils/dashboardStats';
import StatusChip from '../components/admin/StatusChip';
import InfoCard from '../components/admin/InfoCard';
import OrderStatusDialog from '../components/admin/OrderStatusDialog';

function AdminOrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { order, loading, error, reload, refresh } = useAdminOrder(id, token);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState(null);   
    const handleSave = async (apiStatus, label) => {
        setSaving(true);
        setDialogError(null);
        try {
            await updateOrderStatus(order.orderID, apiStatus, token);
            await refresh();               setSnack({ severity: 'success', text: `Order #${order.orderID} marked as ${label}` });
            setDialogOpen(false);
        } catch (err) {
            setDialogError(err.message);           }
        setSaving(false);
    };
    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress />
            <Typography>Loading order...</Typography>
        </Box>
    );

    if (error || !order) return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Retry</Button>}>
                {error || 'Order not found'}
            </Alert>
            <Button variant="outlined" onClick={() => navigate('/admin/orders')}>← Back to Orders</Button>
        </Box>
    );
            const current = normalizeStatus(order.status);
    const canChange = current === 'Pending' || current === 'Shipped';

    return (
        <Box sx={{ p: { xs: 2, md: '20px 30px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <Button variant="outlined" size="small" onClick={() => navigate('/admin/orders')}>
                    ← Back to Orders
                </Button>
            </Box>
            <Paper sx={{ p: 2.5, borderRadius: 2.5 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Order #{order.orderID}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Placed on {new Date(order.orderDate).toLocaleString()}
                        </Typography>
                    </Box>

                    <StatusChip status={order.status} />
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        disabled={!canChange}
                        onClick={() => { setDialogError(null); setDialogOpen(true); }}
                    >
                        Change status
                    </Button>
                </Box>
            </Paper>
            <Box sx={{
                display: 'grid', gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
            }}>
                <InfoCard
                    title=" Customer"
                    rows={[
                        { label: 'Name', value: order.customerName },
                        { label: 'Email', value: order.customerEmail },
                        { label: 'Phone', value: order.customerPhone },
                        { label: 'City / Country', value: [order.customerCity, order.customerCountry].filter(Boolean).join(', ') }
                    ]}
                />
                <InfoCard
                    title=" Shipping"
                    rows={[
                        { label: 'Address', value: order.address },
                        { label: 'Mobile', value: order.mobile }
                    ]}
                />
                <InfoCard
                    title=" Payment"
                    rows={[
                        { label: 'Payment method', value: order.paymentMethod },
                        { label: 'Order total', value: formatMoney(order.totalAmount) }
                    ]}
                />
            </Box>
            <Paper sx={{ p: 2.5, borderRadius: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1 }}> Products</Typography>

                {order.items.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                        No product details were saved for this order.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.orderDetailID}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell align="right">{formatMoney(item.price)}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">{formatMoney(item.totalAmount)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Order total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatMoney(order.totalAmount)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <OrderStatusDialog
                open={dialogOpen}
                order={order}
                saving={saving}
                error={dialogError}
                onClose={() => setDialogOpen(false)}
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

export default AdminOrderDetailsPage;