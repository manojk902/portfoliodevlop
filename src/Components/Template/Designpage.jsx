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

  // IconButton,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
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
  const [res, setRes] = useState();
  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const userId = userProfile?.fetchedUsed?.userId;

  useEffect(() => {
    const fetchDefaultCv = async () => {
      try {
        const res = await axios.get(`${apiUrl}/defaultCv/${username}`);
        setRes(res);
        const templateName = res.data?.fetchedCvInfo?.templateName;
        setCvInfoId(res.data?.fetchedCvInfo?.cvInfoId);
        // setCvTemp(res.data?.fetchedCvInfo?.cvInfoId);
        console.log("📌 Fetched Default CV Template:", templateName);
        if (templateName) {
          setDefaultTemplate(templateName);
          // localStorage.setItem("defaultCvTemplate", templateName);
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
      const response = await axios.put(`${apiUrl}/updateDefaultCvId`, {
        userId: userId,
        templateName: templateName,
        cvInfoId: cvInfoId,
      });

      setDefaultTemplate(templateName);
      // localStorage.setItem("defaultCvTemplate", templateName);
      setShowSnackbar(true);
    } catch (error) {
      console.error("❌ Error setting default CV:", error);
      alert("Failed to set default CV. Please try again.");
    }
  };

  const handlePreviewOpen = (id) => {
    // Navigate to full-page preview
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
        minHeight: "100vh",
        py: 4,
        background: "linear-gradient(to bottom, #f0f4f8, #e6edf5)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 3 }}>
        {/* Heading */}
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

        {/* Tabs */}
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

        {/* CV Gallery */}
        <Grid container spacing={3} justifyContent="center">
          {cvDesigns.map(({ id, name, Component }, index) => {
            const isDefault = defaultTemplate === name;
            return (
              <Grid item key={id} xs={12} sm={6} md={4} lg={0}>
                <Card
                  sx={{
                    position: "relative",
                    height: "560px",
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Default Label */}
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
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Index Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(to right, #4c6fff, #7e5cff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Thumbnail */}
                  <Box
                    sx={{
                      background: "#f8fafc",
                      minHeight: 350,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      overflow: "hidden",
                      cursor: "pointer",
                      p: 1,
                    }}
                    onClick={() => handlePreviewOpen(id)}
                  >
                    <Box
                      sx={{
                        transform: "scale(0.28)",
                        transformOrigin: "top center",
                        pointerEvents: "none",
                        width: "900px",
                      }}
                    >
                      <Component />
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
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
                      onClick={() => handlePreviewOpen(id)}
                    >
                      Preview
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
                        onClick={() => handleSetDefault(name)}
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
