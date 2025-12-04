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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
// import Cv7 from "./Cv7";
// import Cv8 from "./Cv8";
import DemoDialog from "./DemoDialog";

function DesignPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("cv");
  const [defaultTemplate, setDefaultTemplate] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [cvInfoId, setCvInfoId] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDemo, setOpenDemo] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  console.log(showWelcomeMessage);


  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const userId = userProfile?.fetchedUsed?.userId;
  console.log("ooo", !!userId);


  useEffect(() => {
    if (!userId) return;

    const key = `first_time_template_${userId}`;
    const val = localStorage.getItem(key);

    if (val === "true") {
      setShowWelcomeMessage(true);
      localStorage.removeItem(key); // so it won't show twice
    }
  }, [userId]);

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

  // CV designs with categories, search tags, and proper names
  const cvDesigns = [
    {
      id: 1,
      name: "Cv1",
      displayName: "Professional Blue",
      Component: Cv1,
      category: "Professional",
      tags: [
        "developer",
        "engineer",
        "professional",
        "technical",
        "fresher",
        "professional blue",
        "blue",
      ],
      heading: "Best for Developers",
    },
    {
      id: 2,
      name: "Cv2",
      displayName: "Modern Clean",
      Component: Cv2,
      category: "Modern",
      tags: [
        "fresher",
        "student",
        "modern",
        "creative",
        "modern clean",
        "clean",
      ],
      heading: "Best for Freshers",
    },
    {
      id: 3,
      name: "Cv3",
      displayName: "Corporate Executive",
      Component: Cv3,
      category: "Corporate",
      tags: [
        "hr",
        "manager",
        "corporate",
        "executive",
        "corporate executive",
        "business",
      ],
      heading: "Best for HR",
    },
    {
      id: 4,
      name: "Cv4",
      displayName: "Creative Portfolio",
      Component: Cv4,
      category: "Creative",
      tags: [
        "designer",
        "creative",
        "artist",
        "modern",
        "creative portfolio",
        "portfolio",
      ],
      heading: "Best for Designers",
    },
    {
      id: 5,
      name: "defaultCv",
      displayName: "Classic Professional",
      Component: DefaultCvDesign,
      category: "Standard",
      tags: [
        "all",
        "standard",
        "professional",
        "fresher",
        "classic professional",
        "classic",
      ],
      heading: "All Purpose CV",
    },
    {
      id: 6,
      name: "Cv6",
      displayName: "Executive Modern",
      Component: Cv6,
      category: "Executive",
      tags: [
        "executive",
        "manager",
        "senior",
        "lead",
        "executive modern",
        "modern",
      ],
      heading: "Best for Executives",
    },
    {
      id: 7,
      name: "Cv7",
      displayName: "Executive Modern",
      Component: Cv7,
      category: "Executive7",
      tags: [
        "executive",
        "manager",
        "senior",
        "lead",
        "executive modern",
        "modern",
      ],
      heading: "Best for Executives7",
    },
    // {
    //   id: 7,
    //   name: "Cv7",
    //   displayName: "Minimalist",
    //   Component: Cv7,
    //   category: "Minimal",
    //   tags: ["minimalist", "simple", "clean", "modern"],
    //   heading: "Best for Minimalists"
    // },
    // {
    //   id: 8,
    //   name: "Cv8",
    //   displayName: "Creative Color",
    //   Component: Cv8,
    //   category: "Creative",
    //   tags: ["colorful", "creative", "designer", "artist"],
    //   heading: "Best for Creatives"
    // },
  ];

  // Filter CVs based on search query (by name, tags, category, or heading)
  const filteredCvDesigns = cvDesigns.filter(
    (cv) =>
      cv.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      cv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.heading.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.backgroundColor,
        minHeight: "100vh",
        pt: 4,
        pb: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 3 }}>
        {showWelcomeMessage && (
          <Box sx={{ mb: 3 }}>
            <Alert
              severity="info"
              onClose={() => setShowWelcomeMessage(false)}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                fontWeight: 600,
              }}
            >
              Welcome! Choose a template to start — this message will show only once.
            </Alert>
          </Box>
        )}
        {/* Search Bar Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            mt: 2,
          }}
        >
          <TextField
            placeholder="Search by resume name, role, or category (Professional Blue, developer, hr, etc.)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: isMobile ? "100%" : "680px",
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                "&:hover": {
                  boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* CV Gallery */}
        <Box sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          justifyItems: "center",
        }}>
          {filteredCvDesigns.map(
            ({ id, name, Component, heading, displayName }, index) => {
              const isDefault = defaultTemplate === name;
              const isHovered = hoveredCard === id;
              const showButtons = isDefault || isHovered;

              return (
                <Box key={id} sx={{ width: "100%", maxWidth: 320 }}>
                  {/* Template Heading */}
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: "1rem",
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {heading}
                  </Typography>

                  <Card
                    sx={{
                      // width: { xs: "280px" },
                      position: "relative",
                      height: "400px",
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
                      border: isDefault ? `3px solid #34A853` : "none",
                    }}
                    onMouseEnter={() => setHoveredCard(id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* CV Preview Section */}
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
                        position: "relative",
                      }}
                      onClick={() => handlePreviewOpen(id)}
                    >
                      {/* Light Gradient Overlay with Buttons - Show on Hover or if Selected */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: showButtons
                            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(240, 248, 255, 0.5) 100%)"
                            : "transparent",
                          backdropFilter: showButtons ? "blur(2px)" : "none",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 2,
                          opacity: showButtons ? 1 : 0,
                          transition: "all 0.3s ease",
                          zIndex: 2,
                          pointerEvents: showButtons ? "auto" : "none",
                        }}
                      >
                        {/* Buttons Container */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            alignItems: "center",
                            width: "80%",
                          }}
                        >
                          {/* Preview Button - Blue Color */}
                          <Button
                            fullWidth
                            variant="outlined"
                            size="medium"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              color: "white",
                              backgroundColor: "#3498db", // Normal blue
                              "&:hover": {
                                background: "#2980b9",
                                transform: "translateY(-3px)",
                              },
                              fontSize: "0.85rem",
                              transition: "all 0.2s ease",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewOpen(id);
                            }}
                          >
                            Preview
                          </Button>

                          {/* Demo Button - Purple Color */}
                          <Button
                            fullWidth
                            variant="outlined"
                            size="medium"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              color: "#474a4aff",
                              fontSize: "0.85rem",
                              borderColor: "#5fa3f0ff",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const cvData = cvDesigns.find(
                                (cv) => cv.id === id
                              );
                              setSelectedCv({
                                ...cvData,
                                image: `/demo-cv${id}-1.png`,
                                image2: `/demo-cv${id}-2.png`, // 👈 Har CV ka image name same rakho
                                desc: cvData.heading,
                              });
                              setOpenDemo(true);
                            }}
                          >
                            Demo
                          </Button>

                          {/* Publish/Selected Button - Green/Orange Color */}
                          {isDefault ? (
                            <Button
                              fullWidth
                              variant="contained"
                              size="medium"
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                color: "white",
                                background: "#4cd964",
                                fontSize: "0.85rem",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  background: " #3cd054",
                                  transform: "translateY(-3px)",
                                },
                              }}
                              startIcon={
                                <CheckCircleIcon sx={{ fontSize: "1.1rem" }} />
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              Selected
                            </Button>
                          ) : (
                            <Button
                              fullWidth
                              variant="outlined"
                              size="medium"
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                color: "#474a4aff",
                                borderColor: "#34A853",
                                fontSize: "0.85rem",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(name);
                              }}
                            >
                              Publish
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {/* CV Content */}
                      <Box
                        sx={{
                          position: "relative",
                          top: "-40px",
                          transform: "scale(0.38)",
                          transformOrigin: "top center",
                          pointerEvents: "none",
                          width: "800px",
                          height: "1130px",
                          filter: showButtons ? "blur(1px)" : "none",
                          transition: "filter 0.3s ease",
                        }}
                      >
                        <Component />
                      </Box>
                    </Box>

                    {/* Resume Name Below CV */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: "0.9rem",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {displayName}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              );
            }
          )}
        </Box>

        {/* No Results Message */}
        {filteredCvDesigns.length === 0 && searchQuery && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No templates found for "{searchQuery}"
            </Typography>
            <Typography variant="body1">
              Try searching by resume name: Professional Blue, Modern Clean,
              Corporate Executive, etc.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
              Or search by role: developer, fresher, hr, designer, executive
            </Typography>
          </Box>
        )}
      </Container>

      <DemoDialog
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        selectedCv={selectedCv}
      />

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbar-root": {
            bottom: "80px",
          },
        }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#f0f9f0",
            color: "#1e4620",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid #4caf50",
            padding: "16px 20px",
            fontSize: "14px",
            fontWeight: 500,
            "& .MuiAlert-icon": {
              color: "#4caf50",
              fontSize: "24px",
              marginRight: "12px",
            },
            "& .MuiAlert-message": {
              padding: "0",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiAlert-action": {
              paddingLeft: "16px",
              marginRight: "0",
              "& .MuiIconButton-root": {
                color: "#4caf50",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                },
              },
            },
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: "15px", color: "#1e4620" }}
              >
                CV Published Successfully!
              </Typography>
              <Typography
                sx={{ fontSize: "13px", color: "#2e7d32", opacity: 0.9 }}
              >
                Your selected CV is now published on your Home page
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DesignPage;
