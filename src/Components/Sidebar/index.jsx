// Sidebar.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemText, Collapse, useTheme } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const Sidebar = ({ variant = "permanent", onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvOpen, setCvOpen] = useState(true);
  const theme = useTheme();


  const menuItems = [
    { label: "User Info", path: "/edit" },
    { label: "Templates", path: "/edit/template" },
  ];

  return (
    <Box
      sx={{
        width: 160,
        bgcolor: theme.palette.background.backgroundColor,
        boxShadow: theme.palette.borderColor ? `2px 0 5px -2px ${theme.palette.borderColor}` : 'none',
        color: theme.palette.textColor,
        height: "100%",
        p: 1,
      }}
      role="presentation"
      onClick={variant === "temporary" ? onClose : undefined} // mobile drawer close on click
    >
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setCvOpen(!cvOpen)}
            sx={{
              py: 0.5,
              bgcolor: location.pathname.startsWith("/edit") ? theme.palette.background.light : "transparent",
              color: location.pathname.startsWith("/edit") ? theme.palette.primary.main : theme.palette.textColor,
              "&:hover": { bgcolor: theme.palette.background.hover },
            }}
          >
            <ListItemText primary="CV" primaryTypographyProps={{ fontSize: "1rem", fontWeight: 500 }} />
            {cvOpen ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={cvOpen} timeout="auto" unmountOnExit>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  py: 0.5,
                  bgcolor: location.pathname === item.path ? "#1976d2" : "transparent",
                  color: location.pathname === item.path ? "#f4ebebff" : "#150808ff",
                  "&:hover": {
                    bgcolor: location.pathname === item.path ? "#1565c0" : "#444",
                  },
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.875rem" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;
