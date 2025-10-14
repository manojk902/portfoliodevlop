/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
  useTheme,
  Button,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  GitHub,
  Public,
  Print,
} from "@mui/icons-material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";

const Cv8 = ({ UserDataFromDesignPage }) => {
  const theme = useTheme();

  // --- 1. Identify Context (URL & Redux) ---
  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");

  const userProfile = useSelector(
    (state) => state.userProfile?.data?.fetchedUsed
  );
  const userNameRedux = userProfile?.userName;

  // --- 2. State Management ---
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvData = async () => {
      setLoading(true);
      let usernameToFetch = null;
      let isDifferentUser =
        username && userNameRedux && username !== userNameRedux;

      if (
        username &&
        (isDifferentUser || cvPublicView === "true" || !userNameRedux)
      ) {
        usernameToFetch = username;
        console.log(
          `✅ Public View (URL based) Activated. Fetching: ${username}`
        );
      } else if (userNameRedux) {
        usernameToFetch = userNameRedux;
        console.log(
          `👤 Private View (Redux based) Activated. Fetching: ${userNameRedux}`
        );
      }

      if (usernameToFetch) {
        try {
          const res = await axios.get(`${apiUrl}/defaultCv/${usernameToFetch}`);
          setCvData(res?.data?.fetchedCvInfo?.defaultCvInfo);
          console.log(`⭐ Data Fetched for: ${usernameToFetch}.`);
        } catch (err) {
          console.error(`❌ Error fetching CV for ${usernameToFetch}:`, err);
          setCvData(null);
        }
      } else {
        setCvData(null);
      }

      setLoading(false);
    };

    fetchCvData();
  }, [cvPublicView, username, userNameRedux]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Loading CV...
        </Typography>
      </Box>
    );
  }

  if (!cvData) {
    return (
      <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <Typography color="error">
          No CV data available for this user.
        </Typography>
      </Box>
    );
  }

  // Function to determine icon for social links
  const getSocialIcon = (url) => {
    if (url.includes("linkedin")) return <LinkedIn sx={{ fontSize: 16 }} />;
    if (url.includes("github")) return <GitHub sx={{ fontSize: 16 }} />;
    return <Public sx={{ fontSize: 16 }} />;
  };

  // Print button component - hidden during print
  const PrintButton = () => (
    <Box
      sx={{ textAlign: "center", mb: 2, "@media print": { display: "none" } }}
    >
      <Button
        variant="contained"
        startIcon={<Print />}
        onClick={handlePrint}
        size="small"
        sx={{
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Print CV
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <PrintButton />

      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor: "white",
          minHeight: "297mm", // A4 height
          "@media print": {
            boxShadow: "none",
            p: 2.5,
            m: 0,
            minHeight: "297mm",
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 2,
          }}
        >
          <Avatar
            src={cvData.profilePhoto || ""}
            sx={{
              width: 80,
              height: 80,
              border: `2px solid ${theme.palette.primary.main}`,
              mr: 3,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: "1.8rem", lineHeight: 1.2 }}
            >
              {cvData.firstName} {cvData.lastName}
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontSize: "1.2rem", mb: 1 }}
            >
              {cvData.designation}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {cvData.email}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {cvData.phoneNo}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn
                  sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }}
                />
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {cvData.address?.city}, {cvData.address?.state}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - 40% */}
          <Grid item xs={12} md={5}>
            {/* Professional Summary */}
            {cvData.sections?.find((s) => s.name === "Summary")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  SUMMARY
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.5,
                    fontSize: "0.75rem",
                    textAlign: "justify",
                  }}
                >
                  {cvData.sections.find((s) => s.name === "Summary").data}
                </Typography>
              </Box>
            )}

            {/* Skills */}
            {cvData.sections?.find((s) => s.name === "Skill")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  SKILLS
                </Typography>
                <Box>
                  {cvData.sections
                    .find((s) => s.name === "Skill")
                    .data.map((skill, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", fontWeight: "medium" }}
                          >
                            {skill.skill}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                          >
                            {skill.rating}/5
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 4,
                            backgroundColor: "#e0e0e0",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              backgroundColor: theme.palette.primary.main,
                              width: `${(skill.rating / 5) * 100}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Box>
            )}

            {/* Education */}
            {cvData.sections?.find((s) => s.name === "Education")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  EDUCATION
                </Typography>
                {cvData.sections
                  .find((s) => s.name === "Education")
                  .data.map((edu, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                      >
                        {edu.course}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                      >
                        {edu.college}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.7rem",
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        {edu.startDate} - {edu.endDate}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                        Grade: {edu.grade}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            )}

            {/* Certifications */}
            {cvData.sections?.find((s) => s.name === "Certification")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  CERTIFICATIONS
                </Typography>
                {cvData.sections
                  .find((s) => s.name === "Certification")
                  .data.map((cert, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.75rem", fontWeight: "medium" }}
                      >
                        {cert.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                      >
                        {cert.institute}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                        {cert.issueDate}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            )}

            {/* Social Links */}
            {cvData.socialLinks?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  LINKS
                </Typography>
                <Box>
                  {cvData.socialLinks.map((link, i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                    >
                      {getSocialIcon(link)}
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          fontSize: "0.7rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {link}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Right Column - 60% */}
          <Grid item xs={12} md={7}>
            {/* Work Experience */}
            {cvData.sections?.find((s) => s.name === "Experience")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  WORK EXPERIENCE
                </Typography>
                {cvData.sections
                  .find((s) => s.name === "Experience")
                  .data.map((exp, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                        >
                          {exp.jobTitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        >
                          {exp.startDate} - {exp.endDate}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        {exp.company} | {exp.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          lineHeight: 1.4,
                          fontSize: "0.75rem",
                          "& p": { margin: 0 },
                        }}
                      >
                        <MarkdownPreview
                          style={{
                            backgroundColor: "transparent",
                            color: "inherit",
                            padding: 0,
                            fontSize: "0.75rem",
                          }}
                          source={exp.description || ""}
                        />
                      </Typography>
                      {i <
                        cvData.sections.find((s) => s.name === "Experience")
                          .data.length -
                        1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
              </Box>
            )}

            {/* Projects */}
            {cvData.sections?.find((s) => s.name === "Project")?.data && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "primary.main",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                    mb: 1,
                  }}
                >
                  PROJECTS
                </Typography>
                {cvData.sections
                  .find((s) => s.name === "Project")
                  .data.map((proj, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", fontWeight: "bold", mb: 0.5 }}
                      >
                        {proj.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          lineHeight: 1.4,
                          fontSize: "0.75rem",
                          mb: 0.5,
                          "& p": { margin: 0 },
                        }}
                      >
                        <MarkdownPreview
                          style={{
                            backgroundColor: "transparent",
                            color: "inherit",
                            padding: 0,
                            fontSize: "0.75rem",
                          }}
                          source={proj.description || ""}
                        />
                      </Typography>
                      {proj.technologies && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mb: 0.5,
                          }}
                        >
                          {proj.technologies.map((tech, idx) => (
                            <Chip
                              key={idx}
                              label={tech}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.6rem",
                                "& .MuiChip-label": { px: 1 },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      {i <
                        cvData.sections.find((s) => s.name === "Project").data
                          .length -
                        1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
              </Box>
            )}

            {/* Additional Info */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                color: "text.secondary",
                mt: 2,
                pt: 1,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                DOB: {new Date(cvData.dob).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                Last Updated: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <style>
        {`
          // @media print {
          //   @page {
          //     size: A4;
          //     margin: 10mm;
          //   }
            
            // body {
            //   -webkit-print-color-adjust: exact;
            //   print-color-adjust: exact;
            //   background: white !important;
            // }
            
            // .MuiContainer-root {
            //   padding: 0 !important;
            //   margin: 0 !important;
            //   max-width: none !important;
            // }
            
            // .MuiPaper-root {
            //   box-shadow: none !important;
            //   margin: 0 !important;
            //   padding: 2.5mm !important;
            //   min-height: 297mm !important;
            // }
            
          //   /* Hide print button */
          //   .MuiButton-root {
          //     display: none !important;
          //   }
            
          //   /* Ensure good print quality */
          //   * {
          //     -webkit-print-color-adjust: exact;
          //   }
          // }
          
          // /* Screen styles */
          // @media screen {
          //   .MuiPaper-root {
          //     max-width: 210mm;
          //     margin: 0 auto;
          //   }
          // }
        `}
      </style>
    </Container>
  );
};

export default Cv8;
