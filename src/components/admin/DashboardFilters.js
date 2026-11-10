import React from 'react';
import { Card, CardContent, Box, Typography, TextField, MenuItem, Button } from '@mui/material';
import { STATUS_OPTIONS } from '../../utils/dashboardStats';

function DashboardFilters({ startDate, endDate, status, onStartDate, onEndDate, onStatus, onReset }) {
    return (
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <TextField
                        type="date" size="small" fullWidth
                        value={startDate}
                        onChange={(e) => onStartDate(e.target.value)}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">To</Typography>
                    <TextField
                        type="date" size="small" fullWidth
                        value={endDate}
                        onChange={(e) => onEndDate(e.target.value)}
                    />
                </Box>
                <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption" color="text.secondary">Order Status</Typography>
                    <TextField
                        select size="small" fullWidth
                        value={status}
                        onChange={(e) => onStatus(e.target.value)}
                    >
                        {STATUS_OPTIONS.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Button variant="contained" color="error" onClick={onReset}>
                    Reset Filters
                </Button>
            </CardContent>
        </Card>
    );
}

export default DashboardFilters;