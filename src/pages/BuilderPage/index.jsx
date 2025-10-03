import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Sidebar from '../../Components/Sidebar'; // Adjust to './UserInfo/Sidebar' if needed


const BuilderPage = () => {
  const theme = useTheme(); // ✅ hook inside component

  return (
    <Box sx={{ display: 'flex',flexDirection :{ xs: 'column', sm: 'row', md: 'row ', lg: 'row'} }}>
      <Sidebar />
      <Box
        sx={{
          flexDirection :{ xs: 'column', sm: 'column', md: 'row ', lg: 'row'},
          flexGrow: 1,
          p: { xs: 0, sm: 0, md: 2, lg: 2, xl: 2},
          overflow: { xs: 'hidden', sm: 'hidden' },
          bgcolor: theme.palette.primary.main,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};


export default BuilderPage;