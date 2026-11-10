import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_COLORS, normalizeStatus } from '../../utils/dashboardStats';

function StatusChip({ status }) {
    const label = normalizeStatus(status);  

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: STATUS_COLORS[label] || '#6c757d',
                color: label === 'Pending' ? '#111' : 'white',
                fontWeight: 'bold'
            }}
        />
    );
}

export default StatusChip;