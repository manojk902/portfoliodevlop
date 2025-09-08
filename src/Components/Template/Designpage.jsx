import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Card,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios"; // ✅ ADD THIS

import DefaultCv from "../DefaultCv";

// Import all your CVs
import CV1 from "./Cv1";
import CV2 from "./Cv2";
import CV3 from "./Cv3";
import CV4 from "./Cv4";
import CV5 from "./Cv5";
import CV6 from "./Cv6";
import { apiUrl } from "../../utils/common";

 function DesignPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState("cv");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [defaultTemplate, setDefaultTemplate] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    localStorage.setItem("defaultCvTemplate", selectedTemplate?.name);
  });

  const templateFromStorage = localStorage.getItem("defaultCvTemplate");

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handlePreviewOpen = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setSelectedTemplate(null);
  };

  // ✅ UPDATED FUNCTION WITH API CALL
  const handleSetDefault = async (cvid) => {
    try {
      // 1️⃣ API CALL
      const response = await axios.put(
        `${apiUrl}/updateDefaultCvId`,
        {
            userId: 4,
            templateName: "Cv4",
            cvInfoId: "555668be-02d0-476d-b3b9-58c11a23a159" 
        }
      );

      console.log("✅ API Response:", response.data);

      // 2️⃣ Local + State Update
      localStorage.setItem("defaultCv", cvid);
      setDefaultTemplate(cvid);
      setShowSnackbar(true);
    } catch (error) {
      console.error("❌ Error setting default CV:", error);
      alert("Failed to set default CV. Please try again.");
    }
  };

  const cvDesigns = [
    { id: 1, name: "defaultCv", Component: CV1, scale: 0.25, baseWidth: 800 },
    { id: 2, name: "defaultCv", Component: CV2, scale: 0.25, baseWidth: 800 },
    { id: 3, name: "defaultCv", Component: CV3, scale: 0.25, baseWidth: 800 },
    { id: 4, name: "defaultCv", Component: CV4, scale: 0.25, baseWidth: 800 },
    { id: 5, name: "defaultCv", Component: CV5, scale: 0.25, baseWidth: 800 },
    { id: 6, name: "defaultCv", Component: CV6, scale: 0.25, baseWidth: 800 },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background: "linear-gradient(to bottom, #f0f4f8, #e6edf5)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 3 }}>
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1a202c",
              letterSpacing: "-0.5px",
              mb: 1,
              fontSize: isMobile ? "2rem" : "3rem",
            }}
          >
            Professional Templates
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4a5568",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Select a professionally designed template to showcase your skills
            and experience
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 5,
            borderBottom: "1px solid #e2e8f0",
            mx: isMobile ? 0 : 4,
          }}
        >
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant={isMobile ? "fullWidth" : "standard"}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTabs-indicator": {
                height: 4,
                borderRadius: "4px 4px 0 0",
              },
            }}
          >
            <Tab
              label="CV Templates"
              value="cv"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: isMobile ? "0.9rem" : "1rem",
                py: 2,
                px: isMobile ? 1 : 3,
                minHeight: "auto",
              }}
            />
          </Tabs>
        </Box>

        <Grid container spacing={3} justifyContent="flex-start">
          <DefaultCv template={templateFromStorage} />

          {cvDesigns.map(
            ({ id, name, Component, scale, baseWidth }, index) => {
              const isDefault = defaultTemplate === id;
              return (
                <Grid
                  item
                  key={id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: 320,
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    {isDefault && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Default"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background:
                            "linear-gradient(to right, #4c6fff, #7e5cff)",
                          color: "white",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(to right, #4c6fff, #7e5cff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Box
                      sx={{
                        background: "#f8fafc",
                        height: 260,
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handlePreviewOpen({ id, name, Component })
                      }
                    >
                      <Box
                        sx={{
                          transform: `scale(${scale})`,
                          transformOrigin: "top center",
                          pointerEvents: "none",
                          width: `${baseWidth}px`,
                        }}
                      >
                        <Component />
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: "center",
                          mb: 2,
                          fontWeight: 600,
                        }}
                      >
                        {name}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        sx={{
                          fontWeight: 700,
                          background:
                            "linear-gradient(to right, #4c6fff, #7e5cff)",
                          mb: 1,
                        }}
                      >
                        Use This Template
                      </Button>

                      {isDefault ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<CheckCircleIcon />}
                        >
                          Selected
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleSetDefault(id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            }
          )}
        </Grid>
      </Container>

      <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="lg">
        <DialogContent>
          {selectedTemplate && <selectedTemplate.Component />}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Template set as default successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
