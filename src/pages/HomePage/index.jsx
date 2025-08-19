// src/pages/HomePage/index.jsx
// This component represents the application's home or landing page.
// It now integrates the 3D scroll effect component and an example TemplateCard.

import React from 'react';
import { Box, Typography } from '@mui/material';
import ThreeDScrollEffect from '../../Components/Common/ThreeDScrollEffect';
import CvTemplates from '../../Components/Templates/CvTemplates';

const HomePage = () => {
  // const handleChooseSampleTemplate = (templateId) => {
  //   console.log(`Sample Template ${templateId} chosen on homepage!`);
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)', // Adjust height based on header to fill remaining space
        p: 2, // Padding
        textAlign: 'center', // Center text alignment
      }}
    >
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'extrabold', color: 'text.primary', mb: 2 }}>
        Welcome to Resume Now!
      </Typography>

      <CvTemplates />

      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
        Build your professional resume quickly and easily.
      </Typography>

      <Box sx={{ width: '100%', maxWidth: '600px', mb: 4, mt: 4 }}>
        <ThreeDScrollEffect />
      </Box>

      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        Navigate to the Templates page to get started or learn more about our features.
      </Typography>
    </Box>
  );
};

export default HomePage;
