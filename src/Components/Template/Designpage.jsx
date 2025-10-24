/* eslint-disable react-hooks/exhaustive-deps */
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
  Alert,
  Snackbar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cv1 from "./Cv1";
import DefaultCvDesign from "./DefaultCvDesign";
import { apiUrl } from "../../utils/common";
import { useSelector } from "react-redux";
import Cv2 from "./Cv2";
import Cv3 from "./Cv3";
import Cv4 from "./Cv4";
import Cv6 from "./Cv6";
import Cv7 from "./Cv7";
import Cv8 from "./Cv8";

function DesignPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("cv");
  const [defaultTemplate, setDefaultTemplate] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [cvInfoId, setCvInfoId] = useState();

  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const userId = userProfile?.fetchedUsed?.userId;

  useEffect(() => {
    const fetchDefaultCv = async () => {
      try {
        const res = await axios.get(`${apiUrl}/defaultCv/${username}`);
        const templateName = res.data?.fetchedCvInfo?.templateName;
        setCvInfoId(res.data?.fetchedCvInfo?.cvInfoId);

        if (templateName) {
          setDefaultTemplate(templateName);
        }
      } catch (error) {
        console.error("❌ Failed to fetch default CV:", error);
      }
    };

    fetchDefaultCv();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSetDefault = async (templateName) => {
    try {
      await axios.put(`${apiUrl}/updateDefaultCvId`, {
        userId: userId,
        templateName: templateName,
        cvInfoId: cvInfoId,
      });

      setDefaultTemplate(templateName);
      setShowSnackbar(true);
    } catch (error) {
      console.error("❌ Error setting default CV:", error);
      alert("Failed to set default CV. Please try again.");
    }
  };

  const handlePreviewOpen = (id) => {
    navigate(`/Designpreview/cv/${id}`);
  };

  const cvDesigns = [
    { id: 1, name: "Cv1", Component: Cv1 },
    { id: 2, name: "Cv2", Component: Cv2 },
    { id: 3, name: "Cv3", Component: Cv3 },
    { id: 4, name: "Cv4", Component: Cv4 },
    { id: 5, name: "defaultCv", Component: DefaultCvDesign },
    { id: 6, name: "Cv6", Component: Cv6 },
    { id: 7, name: "Cv7", Component: Cv7 },
    { id: 8, name: "Cv8", Component: Cv8 },
  ];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.backgroundColor,
        minHeight: "100vh",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 3 }}>
        {/* CV Gallery */}
        <Grid container spacing={3} justifyContent="center">
          {cvDesigns.map(({ id, name, Component }, index) => {
            const isDefault = defaultTemplate === name;
            return (
              <Grid item key={id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    width: { xs: "280px" },
                    position: "relative",
                    height: "500px",
                    zIndex: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    background: theme.palette.grey[100],
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                      background: theme.palette.grey[200],
                    },
                  }}
                >
                  {/* Buttons Section - Moved to top */}
                  <Box
                    sx={{
                      p: 2,
                      // backgroundColor: "#1a237e",
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      {/* Preview Button */}
                      <Box width={"33.33%"}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            color: "white",
                            borderColor: "rgba(255,255,255,0.3)",
                            backgroundColor: "#1a237e",
                            fontSize: "0.75rem",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#283593",
                              borderColor: "rgba(255,255,255,0.8)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              color: "#ffffff",
                            },
                          }}
                          onClick={() => handlePreviewOpen(id)}
                        >
                          Preview
                        </Button>
                      </Box>

                      {/* Demo Button */}
                      <Box width={"33.33%"}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            color: "white",
                            borderColor: "rgba(255,255,255,0.3)",
                            backgroundColor: "#1a237e",
                            fontSize: "0.75rem",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#283593",
                              borderColor: "rgba(255,255,255,0.8)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              color: "#ffffff",
                            },
                          }}
                          onClick={() => handlePreviewOpen(id)}
                        >
                          Demo
                        </Button>
                      </Box>

                      {/* Publish/Selected Button */}
                      <Box width={"33.33%"}>
                        {isDefault ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              backgroundColor: "#34A853",
                              color: "white",
                              fontSize: "0.75rem",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#2E8B47",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(52, 168, 83, 0.4)",
                              },
                            }}
                            startIcon={
                              <CheckCircleIcon sx={{ fontSize: "1rem" }} />
                            }
                          >
                            Selected
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              backgroundColor: "#4285F4",
                              color: "white",
                              fontSize: "0.75rem",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#3367D6",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(66, 133, 244, 0.4)",
                              },
                            }}
                            onClick={() => handleSetDefault(name)}
                          >
                            Publish
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* CV Preview Section - Moved to bottom */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      overflow: "hidden",
                      cursor: "pointer",
                      backgroundColor: "white",
                      p: 2,
                      margin: 1,
                      borderRadius: 2,
                      mt: 1,
                    }}
                    onClick={() => handlePreviewOpen(id)}
                  >
                    <Box
                      sx={{
                        transform: "scale(0.35)",
                        transformOrigin: "top center",
                        pointerEvents: "none",
                        width: "800px",
                        height: "1130px",
                      }}
                    >
                      <Component />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Snackbar */}
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

export default DesignPage;
