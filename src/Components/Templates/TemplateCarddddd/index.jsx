// src/components/Templates/TemplateCard/index.jsx
// This component represents a single resume template card displayed in the selection page.
// import React from 'react';
import { Card, CardMedia, CardContent, Button, Typography, Box } from '@mui/material';

const TemplateCard = ({ template, onChooseTemplate }) => {
  return (
    // Card is a flexible MUI container for displaying content in a structured way.
    <Card
      sx={{
        position: 'relative',
        borderRadius: '12px',
        boxShadow: 2, // MUI shadow level (similar to Tailwind shadow-lg)
        '&:hover': {
          boxShadow: 4, // Higher shadow on hover for visual feedback
        },
        transition: 'box-shadow 0.3s', // Smooth transition for shadow
        mx: 'auto', // Center the card
        width: '100%',
        maxWidth: 384, // Max width for responsiveness
      }}
    >
      {/* "RECOMMENDED" badge, conditionally rendered */}
      {template.isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 0,
            bgcolor: 'primary.main', // Uses primary color from theme
            color: 'white',
            fontSize: '0.75rem', // text-xs equivalent
            fontWeight: 'semibold',
            px: 2,
            py: 0.5,
            borderTopLeftRadius: 9999, // large value for rounded-l-full
            borderBottomLeftRadius: 9999, // large value for rounded-l-full
            zIndex: 10,
          }}
        >
          RECOMMENDED
        </Box>
      )}
      {/* Template preview image using CardMedia */}
      <CardMedia
        component="img"
        height="256" // Fixed height for consistent card size
        image={template.templateImage || `https://placehold.co/300x400/CCCCCC/000000?text=Template%20Preview`}
        alt={`Template for ${template.name}`}
        sx={{
          objectFit: 'cover', // Ensures image covers the area
          bgcolor: 'grey.100', // Light background for the image area
          borderBottom: 1, // Bottom border
          borderColor: 'grey.200', // Border color
        }}
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x400/CCCCCC/000000?text=Image%20Error" }}
      />
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Template name */}
        <Typography variant="body2" sx={{ fontWeight: 'semibold', color: 'text.secondary', mb: 1 }}>
          {template.name}
        </Typography>
        {/* "Choose template" button */}
        <Button
          onClick={() => onChooseTemplate(template.id)} // Calls the prop function to choose template
          variant="contained" // Filled button style
          color="primary" // Uses primary color from theme
          fullWidth // Makes button take full width
          sx={{
            py: 1.5,
            px: 3,
            fontWeight: 'semibold',
            '&:hover': { transform: 'scale(1.02)' }, // Subtle scale effect on hover
            transition: 'transform 0.2s, background-color 0.2s', // Smooth transition
          }}
        >
          Choose template
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;