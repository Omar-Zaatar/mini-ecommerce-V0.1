import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Avatar, Alert, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import ExportButton from '../components/admin/ExportButton';
import { exportCustomersPdf } from '../utils/exportCustomersPdf';

function AdminCustomersPage() {
    const { token } = useAuth();
    const { customers, loading, error, reload } = useDashboardData(token);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [exportError, setExportError] = useState(null);

    useEffect(() => { setPage(0); }, [search, rowsPerPage]);

        const filteredCustomers = useMemo(() => {
        const text = search.trim().toLowerCase();
        return customers
            .filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(text))
            .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    }, [customers, search]);

    const pageCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        const handleExport = () => {
        setExportError(null);
        try {
            exportCustomersPdf({ customers: filteredCustomers, search: search.trim() });
        } catch (err) {
            setExportError('Could not create the PDF. Please try again.');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress />
            <Typography>Loading customers...</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                     Customers ({filteredCustomers.length})
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        size="small" label="Search name, email or phone"
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 260, backgroundColor: 'white' }}
                    />
                    <ExportButton onClick={handleExport} disabled={filteredCustomers.length === 0} />
                </Box>
            </Box>

            {exportError && (
                <Alert severity="error" onClose={() => setExportError(null)}>
                    {exportError}
                </Alert>
            )}

            <Paper sx={{ borderRadius: 2.5 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pageCustomers.map(customer => (
                                    <TableRow key={customer.customerID} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: '#007bff', width: 34, height: 34, fontSize: 15 }}>
                                                    {(customer.firstName || '?').charAt(0).toUpperCase()}
                                                </Avatar>
                                                {customer.firstName} {customer.lastName}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone || '—'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredCustomers.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
                    rowsPerPageOptions={[10, 20, 50]}
                />
            </Paper>
        </Box>
    );
}

export default AdminCustomersPage;