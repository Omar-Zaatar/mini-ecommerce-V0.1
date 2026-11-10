import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function ChartCard({ title, isEmpty, children }) {
    return (
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>

                {isEmpty ? (
                    <Box sx={{
                        height: 300, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'text.secondary'
                    }}>
                        No data for the selected filters
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', height: 300 }}>
                        {children}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default ChartCard;