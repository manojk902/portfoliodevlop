import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Box,
  Chip,
  Divider,
  alpha,
  useTheme,
  // Rating
} from "@mui/material";
import {
  Email,
  Phone,
  Cake,
  LocationOn,
  LinkedIn,
  GitHub,
  Language,
  Facebook,
} from "@mui/icons-material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// import { apiUrl } from "../../utils/common";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import MarkdownPreview from '@uiw/react-markdown-preview';



const Cv3 = ({ UserData }) => {
  const [cvData,] = useState(UserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  // const userProfile = useSelector((state) => state.userProfile.data);
  // const username = userProfile?.fetchedUsed?.userName;
  // const name = useParams()
  console.log(cvData, "cvData from cv3");

  useEffect(() => {
    const fetchCV = async () => {
      try {
        // const res = await fetch(
        //   // `${apiUrl}/defaultCv/${username}`
        //   // `${apiUrl}/defaultCv/${username}`
        // );
        // const data = await res.json();
        // setCvData(data.fetchedCvInfo.defaultCvInfo);
        // setCvData(UserData?.data?.fetchedCvInfo?.defaultCvInfo);

      } catch (err) {
        setError("Failed to fetch CV data");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [UserData?.data?.fetchedCvInfo?.defaultCvInfo]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  if (!cvData) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography variant="h6">No CV data available</Typography>
    </Box>
  );

  const {
    firstName,
    lastName,
    designation,
    dob,
    email,
    gender,
    phoneNo,
    profilePhoto,
    socialLinks,
    sections,
  } = cvData;

  // Helper function to render social links with icons
  const renderSocialLinks = () => {
    if (!socialLinks || socialLinks.length === 0) return null;

    return (
      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
        {socialLinks.map((link, index) => {
          let icon = <Language />;
          if (link.includes("linkedin")) icon = <LinkedIn />;
          if (link.includes("github")) icon = <GitHub />;
          if (link.includes("facebook")) icon = <Facebook />;
          if (link.includes("gmail")) icon = <AlternateEmailIcon />;

          return (
            <Chip
              key={index}
              icon={icon}
              label={link}
              onClick={() => window.open(link, "_blank")}
              size="small"
              variant="outlined"
            />
          );
        })}
      </Box>
    );
  };

  // Helper function to render sections
  const renderSection = (section) => {
    if (!section || !section.data || section.data.length === 0) return null;

    switch (section.name) {
      case "Summary":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Professional Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {section.data}
            </Typography>
          </Paper>
        );
      case "Skill":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {section.data.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill.skill ? `${skill.skill} (${skill.rating}/5)` : skill.skill}
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Paper>
        );
      case "Experience":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((exp, idx) => (
              <Box key={idx} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {exp.jobTitle}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {exp.company} | {exp.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                  {exp.startDate} - {exp.endDate}
                </Typography>
                <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                  <MarkdownPreview
                    style={{
                      backgroundColor: 'transparent',  // removes black
                      color: 'inherit',                // use your text color
                      padding: 0,                      // optional
                    }}
                    source={exp.description || ""} />
                </Typography>
                {idx < section.data.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        );
      case "Education":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((edu, idx) => (
              <Box key={idx} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {edu.course}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {edu.college} | {edu.fieldOfStudy}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                  {edu.startDate} - {edu.endDate} | Grade: {edu.grade}
                </Typography>
                <Typography variant="body2">
                  Location: {edu.location}
                </Typography>
                {idx < section.data.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        );
      case "Project":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((proj, idx) => (
              <Box key={idx} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {proj.name}
                </Typography>
                <Typography variant="body2" component="div" sx={{ mb: 1, lineHeight: 1.6 }}>
                  <MarkdownPreview
                    style={{
                      backgroundColor: 'transparent',  // removes black
                      color: 'inherit',                // use your text color
                      padding: 0,                      // optional
                    }}
                    source={proj.description || ""} />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Technologies: </Box>
                  {proj.technologies.join(", ")}
                </Typography>
                {proj.url && (
                  <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>URL: </Box>
                    <Box
                      component="a"
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {proj.url}
                    </Box>
                  </Typography>
                )}
                {idx < section.data.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        );
      case "Certification":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Certifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((cert, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {cert.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cert.institute}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Issued: {cert.issueDate}
                </Typography>
              </Box>
            ))}
          </Paper>
        );
      case "Language":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Languages
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {section.data.map((lang, idx) => (
                <Box key={idx}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {lang.language}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lang.proficiency}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case "Award":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Awards
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {section.data.map((award, idx) => (
                <Box key={idx}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Title: {award.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issuer: {award.issuer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description {award.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued: {award.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case "Achievement":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Achievement
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {section.data.map((Achievement, idx) => (
                <Box key={idx}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {idx + 1}: {Achievement}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case "Interest":
        return (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Interests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {section.data.map((interest, idx) => (
                <Box key={idx}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {idx + 1}: {interest}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={profilePhoto || ""}
              alt={`${firstName} ${lastName}`}
              sx={{ width: 180, height: 180, border: `4px solid ${theme.palette.primary.main}` }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              {firstName} {lastName}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              {designation}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">{email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">{phoneNo}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Cake sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {new Date(dob).toLocaleDateString()} ({gender})
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {cvData?.address?.city}, {cvData?.address?.state}, {cvData?.address?.country}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {renderSocialLinks()}
          </Grid>
        </Grid>
      </Paper>

      {/* Sections */}
      {sections?.map((section, idx) => (
        <React.Fragment key={idx}>{renderSection(section)}</React.Fragment>
      ))}
    </Container>
  );
};

export default Cv3;