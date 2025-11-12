// Sidebar.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
  Divider,
  Typography,
  Badge,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Person,
  DesignServices,
  Dashboard,
  Settings,
  Help,
  Star,
  TrendingUp,
  KeyboardArrowRight,
  ExpandMore,
  Menu,
  Close,
} from "@mui/icons-material";

const Sidebar = ({ variant = "permanent", onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManuallyOpen, setIsManuallyOpen] = useState(false);

  const mainMenuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: <Dashboard sx={{ fontSize: "20px" }} />,
      badge: "New",
    },
    {
      label: "User Profile",
      path: "/edit",
      icon: <Person sx={{ fontSize: "20px" }} />,
      active: true,
    },
    {
      label: "Templates",
      path: "/edit/template",
      icon: <DesignServices sx={{ fontSize: "20px" }} />,
      badge: "8",
    },
  ];

  const secondaryMenuItems = [
    {
      label: "Settings",
      path: "/settings",
      icon: <Settings sx={{ fontSize: "20px" }} />,
    },
    {
      label: "Help & Support",
      path: "/help",
      icon: <Help sx={{ fontSize: "20px" }} />,
    },
  ];

  const sidebarWidth = isExpanded ? 180 : 60;

  const handleToggle = () => {
    setIsManuallyOpen(!isManuallyOpen);
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      sx={{
        width: sidebarWidth,
        backgroundColor: "#fffafae6",
        backdropFilter: "blur(20px)",
        height: "calc(100vh - 69px)",
        position: "fixed",
        left: 0,
        top: 69,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 1200,
        boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: isExpanded ? "flex-end" : "center",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          background: "#fffafae6",
        }}
      >
        <Tooltip
          title={isExpanded ? "Close sidebar" : "Open sidebar"}
          placement="right"
        >
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 32,
              height: 32,
              color: "#5d6d7e",
              "&:hover": {
                background: "rgba(52, 152, 219, 0.1)",
                color: "#3498db",
              },
            }}
          >
            {isExpanded ? (
              <Close sx={{ fontSize: "18px" }} />
            ) : (
              <Menu sx={{ fontSize: "18px" }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ p: 1, pt: 2 }}>
        <List disablePadding>
          {mainMenuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={!isExpanded ? item.label : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 44,
                    borderRadius: "8px",
                    justifyContent: isExpanded ? "initial" : "center",
                    px: 1.5,
                    background:
                      location.pathname === item.path
                        ? "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
                        : "transparent",
                    color:
                      location.pathname === item.path ? "white" : "#5d6d7e",
                    position: "relative",
                    overflow: "hidden",
                    border:
                      location.pathname === item.path
                        ? "none"
                        : "1px solid transparent",
                    "&:before":
                      location.pathname === item.path
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: "3px",
                            background:
                              "linear-gradient(180deg, #2c3e50 0%, #3498db 100%)",
                            borderRadius: "0 2px 2px 0",
                          }
                        : {},
                    "&:hover": {
                      background:
                        location.pathname === item.path
                          ? "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
                          : "rgba(52, 152, 219, 0.08)",
                      color:
                        location.pathname === item.path ? "white" : "#2c3e50",
                      border:
                        location.pathname === item.path
                          ? "none"
                          : "1px solid rgba(52, 152, 219, 0.2)",
                      transform: "translateX(2px)",
                      "& .menu-icon": {
                        transform: "scale(1.1)",
                      },
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isExpanded ? 1.5 : "auto",
                      justifyContent: "center",
                      color: "inherit",
                    }}
                  >
                    <Box
                      className="menu-icon"
                      sx={{ transition: "transform 0.2s ease" }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      opacity: isExpanded ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Space Filler */}
      <Box sx={{ flex: 1 }} />

      {/* Sidebar Footer */}
      <Box
        sx={{
          pt: 54,
          borderBottom: "1px solid rgba(0, 0, 0, 0.41)",
          opacity: isExpanded ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            color: "#95a5a6",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          DriveOSx Portfolio
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
