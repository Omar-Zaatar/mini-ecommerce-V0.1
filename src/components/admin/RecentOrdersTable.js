import React from 'react';
import {
    Card, CardContent, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button
} from '@mui/material';
import { STATUS_COLORS, normalizeStatus, formatMoney } from '../../utils/dashboardStats';

function RecentOrdersTable({ orders, onView }) {
    return (
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Orders</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order #</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No orders for the selected filters
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map(order => {
                                    const status = normalizeStatus(order.status);
                                    return (
                                        <TableRow key={order.orderID} hover>
                                            <TableCell>#{order.orderID}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">{formatMoney(order.totalAmount)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: STATUS_COLORS[status] || '#6c757d',
                                                        color: status === 'Pending' ? '#111' : 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button size="small" variant="outlined" onClick={() => onView(order.orderID)}>
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

export default RecentOrdersTable;