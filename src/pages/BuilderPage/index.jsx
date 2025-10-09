import React, { useState } from "react";
import { Box, IconButton, Drawer } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Sidebar from "../../Components/Sidebar"; 
import { Outlet } from "react-router-dom";

const BuilderPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", height: "89vh", }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
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
          width: 150, // 0 width so content gets full width
          flexShrink: 0,
        }}
      >
        {/* Optional: permanent Sidebar for desktop */}
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
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
