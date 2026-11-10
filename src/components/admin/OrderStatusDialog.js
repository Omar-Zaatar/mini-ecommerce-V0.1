import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box,
    RadioGroup, FormControlLabel, Radio, Alert
} from '@mui/material';
import StatusChip from './StatusChip';
import { normalizeStatus } from '../../utils/dashboardStats';

const OPTIONS = [
    { label: 'Pending', value: 'Pending', allowedFrom: [], note: 'An order cannot go back to Pending' },
    { label: 'Shipped', value: 'Shipped', allowedFrom: ['Pending'] },
    { label: 'Completed', value: 'Delivered', allowedFrom: ['Pending', 'Shipped'] },
    ];

function OrderStatusDialog({ open, order, saving, error, onClose, onSave }) {
    const [selected, setSelected] = useState('');

        useEffect(() => {
        if (open) setSelected('');
    }, [open, order]);

    if (!order) return null;

    const current = normalizeStatus(order.status);       const chosen = OPTIONS.find(option => option.label === selected);

    return (
        <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>Change order status</DialogTitle>

            <DialogContent>
                <Typography sx={{ mb: 1 }}>
                    <strong>Order #{order.orderID}</strong> · {order.customerName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Current status:</Typography>
                    <StatusChip status={order.status} />
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
                    {OPTIONS.map(option => {
                        const allowed = option.allowedFrom.includes(current);
                        const isCurrent = option.label === current;

                                                let note = '';
                        if (isCurrent) note = 'Current status';
                        else if (!allowed) note = option.note || 'Not available from the current status';

                        return (
                            <FormControlLabel
                                key={option.label}
                                value={option.label}
                                control={<Radio />}
                                disabled={!allowed || saving}
                                label={
                                    <Box>
                                        <Typography>{option.label}</Typography>
                                        {note && (
                                            <Typography variant="caption" color="text.secondary">
                                                {note}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            />
                        );
                    })}
                </RadioGroup>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Close</Button>
                <Button
                    variant="contained"
                    disabled={!chosen || saving}
                    onClick={() => onSave(chosen.value, chosen.label)}
                >
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrderStatusDialog;