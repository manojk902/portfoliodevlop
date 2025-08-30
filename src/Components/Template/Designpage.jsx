import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Import all your CVs
import CV1 from "./Cv1";
import CV2 from "./Cv2";
import CV3 from "./Cv3";
import CV4 from "./Cv4";
import CV5 from "./Cv5";
import CV6 from "./Cv6";

export default function DesignPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState("cv");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [defaultTemplate, setDefaultTemplate] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

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

  const handleSetDefault = (templateId) => {
    setDefaultTemplate(templateId);
    setShowSnackbar(true);
  };

  const cvDesigns = [
    {
      id: 1,
      name: "Professional Classic",
      Component: CV1,
      scale: 0.25,
      baseWidth: 800,
    },
    {
      id: 2,
      name: "Modern Minimalist",
      Component: CV2,
      scale: 0.25,
      baseWidth: 800,
    },
    {
      id: 3,
      name: "Executive Style",
      Component: CV3,
      scale: 0.25,
      baseWidth: 800,
    },
    {
      id: 4,
      name: "Creative Edge",
      Component: CV4,
      scale: 0.25,
      baseWidth: 800,
    },
    {
      id: 5,
      name: "Clean Layout",
      Component: CV5,
      scale: 0.25,
      baseWidth: 800,
    },
    { id: 6, name: "Bold Look", Component: CV6, scale: 0.25, baseWidth: 800 },
  ];

  // Only show CV designs
  const designsToShow = cvDesigns;

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
          {designsToShow.map(({ id, name, Component, scale, baseWidth }, index) => {
            // const isPortfolio = false; // Only CV templates now
            const itemProps = { xs: 12, sm: 6, md: 4, lg: 3 }; // Adjusted layout for better spacing

            const cardMaxWidth = 320;
            const previewHeight = 260;
            const isDefault = defaultTemplate === id;

            return (
              <Grid
                item
                key={`${selectedCategory}-${id}`}
                {...itemProps}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    maxWidth: cardMaxWidth,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "none",
                    background: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Default Badge */}
                  {isDefault && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Default"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                        background: "linear-gradient(to right, #4c6fff, #7e5cff)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        height: 24,
                        "& .MuiChip-icon": {
                          color: "white",
                          fontSize: "1rem",
                        },
                      }}
                    />
                  )}

                  {/* Template Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      zIndex: 2,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(to right, #4c6fff, #7e5cff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Preview */}
                  <Box
                    sx={{
                      background: "#f8fafc",
                      height: previewHeight,
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                      borderTop: "1px solid #edf2f7",
                      borderBottom: "1px solid #edf2f7",
                      cursor: "pointer",
                      "&:hover": {
                        "& .preview-overlay": {
                          opacity: 1,
                        },
                      },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background:
                          "linear-gradient(to right, #4c6fff, #7e5cff)",
                        opacity: 0.2,
                      },
                    }}
                    onClick={() => handlePreviewOpen({ id, name, Component })}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                        pointerEvents: "none",
                        width: `${baseWidth}px`,
                      }}
                    >
                      <Component />
                    </Box>

                    {/* Preview Overlay */}
                    <Box
                      className="preview-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Click to Preview
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        textAlign: "center",
                        mb: 2,
                        color: "#2d3748",
                      }}
                    >
                      {name}
                    </Typography>

                    <Button
                      component={Link}
                      to={`/Designpreview/${selectedCategory}/${id}`}
                      fullWidth
                      variant="contained"
                      disableElevation
                      sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.9rem",
                        py: 1,
                        borderRadius: 2,
                        background:
                          "linear-gradient(to right, #4c6fff, #7e5cff)",
                        mb: 1,
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #3a5bff, #6a4cff)",
                        },
                      }}
                    >
                      Use This Template
                    </Button>

                    {isDefault ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#4c6fff",
                          borderColor: "#4c6fff",
                          "&:hover": {
                            borderColor: "#3a5bff",
                            background: "rgba(76, 111, 255, 0.04)",
                          },
                        }}
                      >
                        Selected
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleSetDefault(id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#4a5568",
                          borderColor: "#e2e8f0",
                          "&:hover": {
                            borderColor: "#cbd5e0",
                            background: "#f7fafc",
                          },
                        }}
                      >
                        Set as Default
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e2e8f0",
            background: "linear-gradient(to right, #4c6fff, #7e5cff)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedTemplate?.name} - Full Preview
          </Typography>
          <IconButton
            onClick={handlePreviewClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0, background: "#f8fafc" }}>
          {selectedTemplate && (
            <Box sx={{
              p: isMobile ? 1 : 4,
              display: "flex",
              justifyContent: "center",
              overflow: "auto",
              maxHeight: "70vh"
            }}>
              <Box sx={{
                width: "100%",
                maxWidth: 800,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                background: "white"
              }}>
                <selectedTemplate.Component />
              </Box>
            </Box>
          )}
        </DialogContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            borderTop: "1px solid #e2e8f0",
            gap: 1,
          }}
        >
          <Button
            onClick={handlePreviewClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#4a5568",
            }}
          >
            Close
          </Button>
          <Button
            component={Link}
            to={`/Designpreview/${selectedCategory}/${selectedTemplate?.id}`}
            variant="contained"
            disableElevation
            sx={{
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(to right, #4c6fff, #7e5cff)",
              "&:hover": {
                background: "linear-gradient(to right, #3a5bff, #6a4cff)",
              },
            }}
          >
            Use This Template
          </Button>
        </Box>
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