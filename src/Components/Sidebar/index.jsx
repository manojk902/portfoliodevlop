import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvOpen, setCvOpen] = useState(true); // Default open for CV dropdown

  const menuItems = [
    { label: 'User Info', path: '/edit' },
    { label: 'Templates', path: '/edit/template' },
  ];

  return (
    <Box
      sx={{
        width: 200, // Reduced width for minimal look
        bgcolor: '#f5f5f5',
        height: '100vh',
        p: 1, // Minimal padding
      }}
    >
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setCvOpen(!cvOpen)}
            sx={{
              py: 0.5, // Reduced padding
              bgcolor: location.pathname.startsWith('/edit') ? '#e3f2fd' : 'transparent',
              color: location.pathname.startsWith('/edit') ? '#1976d2' : '#333',
              '&:hover': {
                bgcolor: location.pathname.startsWith('/edit') ? '#bbdefb' : '#e0e0e0',
              },
            }}
          >
            <ListItemText primary="CV" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
            {cvOpen ? <ExpandLess sx={{ fontSize: 16, color: location.pathname.startsWith('/edit') ? '#1976d2' : '#666' }} /> : <ExpandMore sx={{ fontSize: 16, color: '#666' }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={cvOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuItems.map(item => (
              <ListItem key={item.label} disablePadding sx={{ pl: 2 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    py: 0.5,
                    bgcolor: location.pathname === item.path ? '#1976d2' : 'transparent',
                    color: location.pathname === item.path ? '#fff' : '#333',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? '#1565c0' : '#e0e0e0',
                    },
                  }}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;