// src/app/AppProvider.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Layout/Header';
import AppRoutes from '../../routes/AppRoutes'; // Correct path
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTemplate } from '../../store/features/resume/resumeSlice';
// import Footer from '../../Components/Layout/Footer';

const AppProvider = ({ onToggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedTemplateId = useSelector((state) => state.resume.selectedTemplateId);
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
  };

  // --- Crucial: This function is defined here ---
  const handleChooseTemplate = (templateId) => {
    console.log(`Template chosen: ${templateId}`);
    dispatch(setSelectedTemplate(templateId));
    navigate('/build-resume');
  };
  // --- End Crucial ---

  return (
    <Box sx={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: 'customColors.grayBg',
      minHeight: '100vh',
      position: 'relative',
      pb: 20,
    }}>
      <Header onNavigate={navigate} onToggleSidebar={toggleSidebar} />

      {/* --- Crucial: handleChooseTemplate is passed as a prop to AppRoutes --- */}
      <AppRoutes
        navigate={navigate}
        handleChooseTemplate={handleChooseTemplate} // <--- Passed here
        selectedTemplateId={selectedTemplateId}
        isSidebarOpen={isSidebarOpen}
      />
      {/* --- End Crucial --- */}
      {/* <Footer/> footer work later */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: 'white',
          p: 1.5,
          borderRadius: '50%',
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          fontSize: '3rem',
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        😊
      </Box>
    </Box>
  );
};

export default AppProvider;