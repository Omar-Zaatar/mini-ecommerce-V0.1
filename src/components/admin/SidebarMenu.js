import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Orders', path: '/admin/orders', icon: <ReceiptLongIcon /> },
    { label: 'Customers', path: '/admin/customers', icon: <PeopleIcon /> },
    { label: 'Sales', path: '/admin/sales', icon: <TrendingUpIcon /> }
];

function SidebarMenu({ onNavigate }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (path) => {
        navigate(path);
        if (onNavigate) onNavigate();       };

    return (
        <Box sx={{ py: 2 }}>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>
                Admin
            </Typography>
            <List>
                {menuItems.map(item => (
                    <ListItemButton
                        key={item.path}
                        selected={location.pathname === item.path}
                        onClick={() => handleClick(item.path)}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}

export default SidebarMenu;