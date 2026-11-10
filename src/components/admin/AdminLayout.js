import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Navbar from '../Navbar';
import SidebarMenu from './SidebarMenu';

const SIDEBAR_WIDTH = 220;

function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div>
            <Navbar />

            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                <Box sx={{
                    display: { xs: 'none', md: 'block' },
                    width: SIDEBAR_WIDTH, flexShrink: 0,
                    backgroundColor: 'white', borderRight: '1px solid #e0e0e0'
                }}>
                    <SidebarMenu />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, backgroundColor: '#f5f5f5' }}>
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' }, alignItems: 'center',
                        p: 1, backgroundColor: 'white', borderBottom: '1px solid #e0e0e0'
                    }}>
                        <IconButton onClick={() => setMobileOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography>Admin menu</Typography>
                    </Box>

                    <Outlet />
                </Box>
            </Box>
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box sx={{ width: SIDEBAR_WIDTH }}>
                    <SidebarMenu onNavigate={() => setMobileOpen(false)} />
                </Box>
            </Drawer>
        </div>
    );
}

export default AdminLayout;
