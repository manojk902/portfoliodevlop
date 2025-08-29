// src/pages/HomePage/Cv1.jsx
import React from "react";
import { Box, Typography, Divider, Avatar, Grid } from "@mui/material";

const Cv1 = () => {
  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 4, bgcolor: "white", boxShadow: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src="https://via.placeholder.com/120"
          alt="Profile"
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Jatin Sharma
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Full Stack Developer
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Contact Info */}
      <Typography variant="h6" gutterBottom>
        Contact
      </Typography>
      <Typography>Email: jatin@example.com</Typography>
      <Typography>Phone: +91 9876543210</Typography>
      <Typography>Location: Delhi, India</Typography>

      <Divider sx={{ my: 3 }} />

      {/* Skills */}
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>
      <Grid container spacing={1}>
        {["React", "Node.js", "JavaScript", "MongoDB"].map((skill, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {skill}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Experience */}
      <Typography variant="h6" gutterBottom>
        Experience
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Software Engineer - ABC Company
        </Typography>
        <Typography variant="body2" color="text.secondary">
          2021 - Present
        </Typography>
        <Typography>
          Worked on developing scalable web applications with React and Node.js.
        </Typography>
      </Box>
    </Box>
  );
};

export default Cv1;
