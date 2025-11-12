import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const resumeTemplates = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Professional Clean",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Executive Classic",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1565689223820-b9a0f7e58fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Creative Modern",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Minimalist",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1586281380117-5a4ae0d1ef16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Corporate Professional",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Tech Portfolio",
  },
];

const ImageCard = styled(Card)(({ theme }) => ({
  height: "480px",
  width: "400px",
  transition: "all 0.3s ease-in-out",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
  color: "white",
  fontWeight: "bold",
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(3),
  fontSize: "1.1rem",
  boxShadow: "0 4px 15px rgba(33, 203, 243, 0.3)",
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0 30%, #00ACC1 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(33, 203, 243, 0.4)",
  },
}));

const ResumeSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const getSlidesPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: { xs: 6, md: 10 },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorations */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          // background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
          opacity: 0.1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          // background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
          opacity: 0.1,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              // background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: { xs: "2.2rem", md: "3.2rem", lg: "3.8rem" },
              mb: 2,
            }}
          >
            Professional Resume Templates
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            }}
          >
            Pick one of many world-class templates and build your resume in
            minutes
          </Typography>
        </Box>

        {/* Slider Section - Only Images */}
        <Box sx={{ position: "relative" }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={getSlidesPerView()}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={!isMobile}
            loop={true}
            speed={800}
            grabCursor={true}
            style={{
              padding: "20px 10px 60px",
            }}
          >
            {resumeTemplates.map((template) => (
              <SwiperSlide key={template.id}>
                <ImageCard>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={template.img}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </ImageCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* View All Button */}
        <Box textAlign="center" mt={4}>
          <GradientButton
            variant="contained"
            size="large"
            component={Link}
            to="/edit/template"
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
              color: "white",
              borderRadius: "12px",
              py: 1.2,
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2980b9 0%, #2471a3 100%)",
                boxShadow: "0 6px 20px rgba(52, 152, 219, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View All Templates
          </GradientButton>
        </Box>
      </Container>

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #1976d2 30%, #21cbf3 90%);
          transform: scale(1.4);
          box-shadow: 0 2px 8px rgba(33, 203, 243, 0.3);
        }

        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </Box>
  );
};

export default ResumeSlider;
