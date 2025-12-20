// src/app/AppProvider.jsx
import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Layout/Header';
import AppRoutes from '../../routes/AppRoutes'; // Correct path
import { useDispatch } from 'react-redux';
import { setSelectedTemplate } from '../../store/features/resume/resumeSlice';

const AppProvider = ({ mode, setMode }) => {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const selectedTemplateId = useSelector((state) => state.resume.selectedTemplateId);
  const dispatch = useDispatch();
  const navigateRouter = useNavigate();
  const navigate = (path, params = {}) => {
    navigateRouter(path);
    if (params.templateId) {
      dispatch(setSelectedTemplate(params.templateId));
    }
    if (typeof params.toggleSidebar !== 'undefined') {
      setIsSidebarOpen(params.toggleSidebar);
    } else {
      if (path !== '/header-input') {
        setIsSidebarOpen(false);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    // console.log('Sidebar toggled, now:', !isSidebarOpen);
  };
  return (
    <Box sx={{
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      position: 'relative',
      bgcolor:theme.palette.background.backgroundColor,
      // bgcolor:theme.palette.background.backgroundColor
    }}>
      <Header onNavigate={navigate} mode={mode}
        setMode={setMode} onToggleSidebar={toggleSidebar} />
      <AppRoutes
        navigate={navigate}
        isSidebarOpen={isSidebarOpen}
      />
    </Box>
  );
};

export default AppProvider;