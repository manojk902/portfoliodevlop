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
} from "@mui/icons-material";

const Sidebar = ({ variant = "permanent", onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const mainMenuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: <Dashboard />,
      badge: "New",
    },
    {
      label: "User Profile",
      path: "/edit",
      icon: <Person />,
      active: true,
    },
    {
      label: "Templates",
      path: "/edit/template",
      icon: <DesignServices />,
      badge: "8",
    },
  ];

  const secondaryMenuItems = [
    { label: "Settings", path: "/settings", icon: <Settings /> },
    { label: "Help & Support", path: "/help", icon: <Help /> },
  ];

  const sidebarWidth = isExpanded ? 280 : 72;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        bgcolor: "#F4F4F6",
        background: "#F4F4F6",
        height: "calc(120vh - 80px)",
        position: "fixed",
        left: 0,
        top: 88,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 1200,
        boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        "&:hover": {
          width: 280,
        },
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main Navigation */}
      <Box sx={{ p: 2, pt: 2 }}>
        <List disablePadding>
          {mainMenuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <Tooltip
                title={!isExpanded ? item.label : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 52,
                    borderRadius: "12px",
                    justifyContent: isExpanded ? "initial" : "center",
                    px: 2,
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
                            width: "4px",
                            background:
                              "linear-gradient(180deg, #2c3e50 0%, #3498db 100%)",
                            borderRadius: "0 4px 4px 0",
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
                      transform: "translateX(4px)",
                      "& .menu-icon": {
                        transform: "scale(1.1)",
                      },
                      "& .arrow-icon": {
                        opacity: 1,
                        transform: "translateX(2px)",
                      },
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isExpanded ? 2 : "auto",
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
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.9rem",
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

                  {/* Arrow Icon */}
                  {isExpanded && (
                    <KeyboardArrowRight
                      className="arrow-icon"
                      sx={{
                        fontSize: "16px",
                        opacity: 0.5,
                        transition: "all 0.2s ease",
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Secondary Navigation */}
      <Box sx={{ p: 2, pt: 34 }}>
        <Box sx={{ px: 2, py: 8 }}></Box>
        {/* <List disablePadding>
          {secondaryMenuItems.map((item) => (
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
                    borderRadius: "10px",
                    justifyContent: isExpanded ? "initial" : "center",
                    px: 2,
                    color: "#7f8c8d",
                    background: "transparent",
                    "&:hover": {
                      background: "rgba(52, 152, 219, 0.06)",
                      color: "#2c3e50",
                      border: "1px solid rgba(52, 152, 219, 0.1)",
                      "& .menu-icon": {
                        transform: "scale(1.1)",
                        color: "#3498db",
                      },
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isExpanded ? 2 : "auto",
                      justifyContent: "center",
                      color: "inherit",
                    }}
                  >
                    <Box
                      className="menu-icon"
                      sx={{ transition: "all 0.2s ease" }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: isExpanded ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List> */}
      </Box>

      {/* Bottom Space Filler */}
      <Box sx={{ flex: 1 }} />

      {/* Sidebar Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(0,0,0,0.04)",
          background: "rgba(248, 250, 252, 0.8)",
          opacity: isExpanded ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
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
