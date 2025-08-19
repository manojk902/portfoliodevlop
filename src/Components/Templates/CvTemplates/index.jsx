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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// === Import all your CVs ===
import Cv1 from "../CvTemplates/Cv1";


 function CvTemplates() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState("cv");
  // const [path,setPath]= useState();

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  const handlenavigate = (e)=>{
    console.log(e);
    navigate("/cv1")
  }
    useEffect(()=>{

    },[])

  const cvDesigns = [
    {
      id: 1,
      name: "Professional Classic",
      Component: Cv1,
      scale: 0.25,
      baseWidth: 800,
    },
   

  ];

  const designsToShow =
    selectedCategory === "cv" ? cvDesigns : "";

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
            }}
          >
            Professional Templates
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4a5568",
              fontSize: "1.1rem",
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
            <Tab
              label="Portfolio Templates"
              value="portfolio"
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
            const isPortfolio = selectedCategory === "portfolio";
            const itemProps = isPortfolio
              ? { xs: 12, sm: 12, md: 6 } // 2 per row
              : { xs: 12, sm: 6, md: 3 }; // CV same as before

            const cardMaxWidth = isPortfolio ? 600 : 320;
            const previewHeight = isPortfolio ? 400 : 260;

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

                  {/* === Preview === */}
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
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        transform: `scale(${isPortfolio ? scale * 1 : scale})`,
                        transformOrigin: "top center",
                        pointerEvents: "none",
                        width: `${baseWidth}px`,
                      }}
                    >
                      <Component />
                    </Box>
                  </Box>

                  <Box sx={{ p: 3, pt: 2 }}>
                    <Button
                      // component={Link}
                      // to={`/Designpreview/${selectedCategory}/${id}`}
                      onClick={handlenavigate}
                      fullWidth
                      variant="contained"
                      disableElevation
                      sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "1rem",
                        py: 1.5,
                        borderRadius: 2,
                        background:
                          "linear-gradient(to right, #4c6fff, #7e5cff)",
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #3a5bff, #6a4cff)",
                        },
                      }}
                    >
                      Use This Template
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
export default CvTemplates