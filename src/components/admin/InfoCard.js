import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function InfoCard({ title, rows, emptyText = 'Not recorded' }) {
    return (
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {rows.map(row => (
                        <Box key={row.label}>
                            <Typography variant="caption" color="text.secondary">
                                {row.label}
                            </Typography>
                            <Typography sx={{ wordBreak: 'break-word' }}>
                                {row.value || <span style={{ color: '#999' }}>{emptyText}</span>}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}

export default InfoCard;