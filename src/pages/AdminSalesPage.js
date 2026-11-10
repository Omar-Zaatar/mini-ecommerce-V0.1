import React, { useMemo } from 'react';
import {
    Box, Typography, Paper, Alert, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { getMonthlySalesDetails, formatMoney } from '../utils/dashboardStats';
import MonthlySalesRow from '../components/admin/MonthlySalesRow';

function AdminSalesPage() {
    const { token } = useAuth();
    const { orders, items, loading, error, reload } = useDashboardData(token);

    const months = useMemo(() => getMonthlySalesDetails(orders, items), [orders, items]);

        const totals = useMemo(() => ({
        orders: months.reduce((sum, m) => sum + m.orders, 0),
        itemsSold: months.reduce((sum, m) => sum + m.itemsSold, 0),
        revenue: months.reduce((sum, m) => sum + m.revenue, 0)
    }), [months]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress />
            <Typography>Loading sales...</Typography>
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
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Monthly Sales</Typography>
                <Typography variant="body2" color="text.secondary">
                    Profit of completed orders. Click the arrow of a month to see its products.
                </Typography>
            </Box>

            <Paper sx={{ borderRadius: 2.5 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Month</TableCell>
                                <TableCell align="right">Orders</TableCell>
                                <TableCell align="right">Items sold</TableCell>
                                <TableCell align="right">Profit</TableCell>
                                <TableCell align="right">Avg. order</TableCell>
                                <TableCell align="right">Change</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {months.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No completed orders yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {months.map(month => (
                                        <MonthlySalesRow key={month.key} month={month} />
                                    ))}
                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                        <TableCell />
                                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totals.orders}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totals.itemsSold}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatMoney(totals.revenue)}</TableCell>
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default AdminSalesPage;