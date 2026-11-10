import React from 'react';

const colors = {
    Pending: '#ffc107',
    Shipped: '#17a2b8',
    Delivered: '#28a745',
    Cancelled: '#dc3545'
};

function StatusBadge({ status }) {
    return (
        <span style={{
            backgroundColor: colors[status] || '#6c757d',
            color: status === 'Pending' ? '#111' : 'white',
            padding: '3px 10px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 'bold'
        }}>
            {status}
        </span>
    );
}

export default StatusBadge;