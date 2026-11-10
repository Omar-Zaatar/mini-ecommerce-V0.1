import React, { useState } from 'react';
import {
    TableRow, TableCell, IconButton, Collapse, Box, Typography, Table, TableHead, TableBody
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatMoney } from '../../utils/dashboardStats';

function ChangeText({ value }) {
    if (value === null) return <span style={{ color: '#999' }}>—</span>;

    const isUp = value >= 0;
    return (
        <span style={{ color: isUp ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {isUp ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
        </span>
    );
}

function MonthlySalesRow({ month }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow hover>
                <TableCell width={50}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{month.label}</TableCell>
                <TableCell align="right">{month.orders}</TableCell>
                <TableCell align="right">{month.itemsSold}</TableCell>
                <TableCell align="right">{formatMoney(month.revenue)}</TableCell>
                <TableCell align="right">{formatMoney(month.averageOrder)}</TableCell>
                <TableCell align="right"><ChangeText value={month.change} /></TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Products sold in {month.label}
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Profit</TableCell>
                                        <TableCell align="right">Share of month</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {month.products.map(product => (
                                        <TableRow key={product.name}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell align="right">{product.quantity}</TableCell>
                                            <TableCell align="right">{formatMoney(product.revenue)}</TableCell>
                                            <TableCell align="right">
                                                {month.revenue > 0
                                                    ? ((product.revenue / month.revenue) * 100).toFixed(1) + '%'
                                                    : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default MonthlySalesRow;