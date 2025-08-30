import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../Components/Sidebar'; // Adjust to './UserInfo/Sidebar' if needed

const BuilderPage = () => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box sx={{ flexGrow: 1, p: 2 }}> {/* Reduced padding for minimal look */}
      <Outlet />
    </Box>
  </Box>
);

export default BuilderPage;