import React, { useState } from "react";
import { Box, IconButton, Drawer, useTheme } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Sidebar from "../../Components/Sidebar";
import { Outlet } from "react-router-dom";

const BuilderPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const theme = useTheme()

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", bgcolor: theme.palette.background.backgroundColor, height: "89vh", }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        onClose={handleDrawerToggle}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        // variant="temporary"
        open={mobileOpen}
        // onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          bgcolor: theme.palette.background.backgroundColor,
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 162 },
        }}
      >
        <Sidebar variant="temporary" onClose={handleDrawerToggle} />
      </Drawer>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          // width: 1500, // 0 width so content gets full width
          flexShrink: 0,
          bgcolor: theme.palette.background.backgroundColor
        }}
      >
        {/* Optional: permanent Sidebar for desktop */}
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </Box>

      {/* Main content */}
      <Box sx={{
        flexGrow: 1, bgcolor: theme.palette.background.backgroundColor, ml: { md: isExpanded ? "180px" : "60px" },  // main content shift
        transition: "margin 0.25s ease", overflow: "auto"
      }}>
        {/* Mobile menu button */}
        <IconButton
          sx={{ display: { md: "none" }, mb: 1 }}
          onClick={handleDrawerToggle}
        >
          <Menu />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  );
};

export default BuilderPage;
