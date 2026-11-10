import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function StatCard({ title, value, icon, color }) {
    return (
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                </Box>
                <Box sx={{
                    backgroundColor: color, color: 'white', borderRadius: '50%',
                    width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatCard;