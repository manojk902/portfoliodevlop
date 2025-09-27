import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  // Avatar,
  CircularProgress,
  Box,
  Chip,
  Divider,
  alpha,
  useTheme,
  Tooltip,
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
  CardMembership
} from "@mui/icons-material";

// import {AlternateEmailIcon} from '@mui/icons-material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WorkOutlineSharpIcon from '@mui/icons-material/WorkOutlineSharp';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';
import HomeRepairServiceSharpIcon from '@mui/icons-material/HomeRepairServiceSharp';
import InterestsSharpIcon from '@mui/icons-material/InterestsSharp';
import MilitaryTechSharpIcon from '@mui/icons-material/MilitaryTechSharp';
import LanguageSharpIcon from '@mui/icons-material/LanguageSharp';

// import WorkOutlineSharpIcon from '@material-ui/icons/WorkOutlineSharp';

// import { apiUrl } from "../../utils/common";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { apiUrl } from "../../utils/common";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";



const Cv6 = ({ UserDataFromDesignPage }) => {
  const theme = useTheme();
  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  // Path parameter: e.g., 'johnsmith' from URL route /johnsmith?cv=true
  const { username } = useParams();
  // Query parameter: 'true' or null (for public view from HomePage)
  const cvPublicView = searchParams.get("cv");

  const userProfile = useSelector(state => state.userProfile?.data?.fetchedUsed);
  const userNameRedux = userProfile?.userName; // Logged-in user's username 

  // --- 2. State Management ---
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvData = async () => {
      setLoading(true);
      let usernameToFetch = null;
      let isDifferentUser = (username && userNameRedux && username !== userNameRedux);

      // --- 1. PRIORITY CHECK: DIFFERENT USER OR EXPLICIT PUBLIC FLAG ---
      // Condition: Agar URL mein username hai AND (ya toh user alag hai OR 'cv=true' hai)
      // Ya agar user logged in nahi hai but URL mein username hai.
      if (username && (isDifferentUser || cvPublicView === "true" || !userNameRedux)) {

        // Lekin agar user logged-in hai AUR woh apna hi public link dekh raha hai, 
        // tab bhi hume URL user ko fetch karna hai.
        usernameToFetch = username;
        console.log(`✅ Public View (URL based) Activated. Fetching: ${username}`);
      }

      // --- 2. FALLBACK: PRIVATE VIEW (Logged-in user) ---
      // Yeh block tab chalega jab koi URL username nahi hai ya URL username hi Redux user hai (Home page)
      else if (userNameRedux) {
        usernameToFetch = userNameRedux;
        console.log(`👤 Private View (Redux based) Activated. Fetching: ${userNameRedux}`);
      }

      // --- 3. EXECUTE FETCH ---
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
  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">Loading CV...</Typography>
      </Box>
    );
  }

  if (!cvData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
        <Typography color="error">No CV data available for this user.</Typography>
      </Box>
    );
  }

  const {
    firstName,
    lastName,
    designation,
    dob,
    email,
    gender,
    phoneNo,
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
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <WorkOutlineSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Professional Summary
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {section.data}
            </Typography>
          </Paper>
        );
      case "Skill":
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <WorkOutlineSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Skills
              </Typography>
            </Box>
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
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <HomeRepairServiceSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Work Experience
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((exp, idx) => (
              <React.Fragment key={idx}>
                <Box key={idx} mb={3}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {exp.jobTitle}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {exp.company}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                        {exp.startDate} - {exp.endDate}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, textAlign: "end" }} variant="body2" color="text.secondary">
                        {exp.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                      <MarkdownPreview
                        style={{
                          backgroundColor: 'transparent',  // removes black
                          color: 'inherit',                // use your text color
                          padding: 0,                      // optional
                        }}
                        source={exp.description || ""} />
                    </Typography>
                  </Box>

                  {idx < section.data.length - 1 && <Divider sx={{ mt: 2 }} />}

                </Box>
              </React.Fragment>

            ))}
          </Paper>
        );
      case "Education":
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <Tooltip title="Education Section" placement="top">
                <SchoolSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              </Tooltip>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Education
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {section.data.map((edu, idx) => (
              //  console.log(edu.grade,"Grade"),
              <React.Fragment key={idx}>
                <Box mb={3} sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {edu.course}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {edu.college}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {edu.fieldOfStudy}
                    </Typography>
                    {edu.grade ? (<Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                      Grade: {edu.grade}
                    </Typography>) : null}

                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, textAlign: "end" }} variant="body2" color="text.secondary">
                      {edu.location}
                    </Typography>
                  </Box>
                </Box>
                {idx < section.data.length - 1 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
          </Paper>

        );
      case "Project":
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {section.data.map((proj, idx) => (
              // console.log(proj.technologies,"jjjj"),

              <Box key={idx} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                 {idx+1}. {proj.name}
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
                {proj.technologies && proj.technologies.length > 0 ? (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>Technologies: </Box>
                    {proj.technologies.join(", ")}
                  </Typography>
                ) : null}
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
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <CardMembership sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                Certifications
              </Typography>
            </Box>
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
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <LanguageSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Languages
              </Typography>
            </Box>
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
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <EmojiEventsSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Awards
              </Typography>
            </Box>
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

                  <Typography variant="body2" component="div" color="text.secondary">
                    <MarkdownPreview
                      style={{
                        backgroundColor: 'transparent',  // removes black
                        color: 'inherit',                // use your text color
                        padding: 0,                      // optional
                      }}
                      source={award.description || ""} />

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
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <MilitaryTechSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Achievement
              </Typography>
            </Box>
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
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <InterestsSharpIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                Interests
              </Typography>
            </Box>

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

export default Cv6;