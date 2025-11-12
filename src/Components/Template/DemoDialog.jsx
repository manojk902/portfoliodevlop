import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const DemoDialog = ({ open, onClose, selectedCv }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!selectedCv) return null;

  // Create array of images - use both image and image2 if available
  const images = [
    selectedCv.image,
    selectedCv.image2 ||
      "https://via.placeholder.com/600x800/ffffff/000000?text=Page+2+Preview",
  ].filter(Boolean);

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: "#3498db",
            color: "white",
            p: 1,
            position: "relative",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {selectedCv.displayName || "Template Preview"}
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          {/* Left Content Section */}
          <Box flex={1} sx={{ p: 3 }}>
            {/* ATS Features */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                350+ ATS friendly templates feature:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Customizable options to make you stand out
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Personalized recommendations based on your unique career
                  journey
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Tested and proven content created by experts and enhanced with
                  AI
                </Typography>
                <Typography component="li" variant="body2">
                  Unlimited ways to create your perfect resume and cover letter
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Template Features */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={500}>
                  Clean & Professional layout
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={500}>
                  100% ATS Friendly
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={500}>
                  Works on all devices
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={500}>
                  Designed for{" "}
                  {selectedCv.heading?.toLowerCase() || "professionals"}
                </Typography>
              </Box>
            </Box>

            {/* Best For Tags */}
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                Best for:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {selectedCv.tags?.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                      color: "#1976d2",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Preview Section with Slider */}
          <Box
            flex={1.3}
            sx={{
              backgroundColor: "#f8f9fa",
              borderLeft: { md: "1px solid #e0e0e0" },
              borderTop: { xs: "1px solid #e0e0e0", md: "none" },
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              position: "relative",
            }}
          >
            {/* Image Container */}
            <Box
              sx={{
                width: "100%",
                height: "500px",
                maxWidth: 400,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                position: "relative",
              }}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${selectedCv.displayName} - Page ${
                  currentImageIndex + 1
                }`}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <IconButton
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: currentImageIndex === 0 ? "#ccc" : "#1976d2",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,1)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(255,255,255,0.7)",
                      },
                    }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  {/* Right Arrow */}
                  <IconButton
                    onClick={handleNextImage}
                    disabled={currentImageIndex === images.length - 1}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color:
                        currentImageIndex === images.length - 1
                          ? "#ccc"
                          : "#1976d2",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,1)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(255,255,255,0.7)",
                      },
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Page Indicator */}
            {images.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                }}
              >
                {images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor:
                        currentImageIndex === index ? "#1976d2" : "#e0e0e0",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor:
                          currentImageIndex === index ? "#1976d2" : "#bdbdbd",
                      },
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDialog;
