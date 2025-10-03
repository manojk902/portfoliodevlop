/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  Divider,
  // Avatar,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Cake,
  Work,
  School,
  Code,
  Star,
  CardMembership,
  LinkedIn,
  GitHub,
  Public
} from "@mui/icons-material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useSelector } from "react-redux";
const DefaultCvDesign = ({ UserDataFromDesignPage }) => {
  const theme = useTheme();

  // --- 1. Identify Context (URL & Redux) ---
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

  // Function to determine icon for social links
  const getSocialIcon = (url) => {
    if (url.includes("linkedin")) return <LinkedIn />;
    if (url.includes("github")) return <GitHub />;
    return <Public />;
  };

  // Left Column Components
  const PersonalInfo = () => (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        {cvData.firstName} {cvData.lastName}
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom align="center">
        {cvData.designation}
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ mr: 1 }} /> Contact
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Email color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{cvData.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Phone color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{cvData.phoneNo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Cake color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {new Date(cvData.dob).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {cvData.address?.city}, {cvData.address?.state}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {cvData.socialLinks?.length > 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Social Links
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box>
              {cvData.socialLinks.map((link, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getSocialIcon(link)}
                  <Typography variant="body2" sx={{ ml: 1, wordBreak: 'break-all' }}>
                    {link}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  // Right Column Components
  const ProfessionalSummary = () => {
    const summarySection = cvData.sections?.find(s => s.name === "Summary");
    if (!summarySection || !summarySection.data) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Work sx={{ mr: 1 }} /> Professional Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
            {summarySection.data}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const Experience = () => {
    const experienceSection = cvData.sections?.find(s => s.name === "Experience");
    if (!experienceSection || !experienceSection.data || experienceSection.data.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Work sx={{ mr: 1 }} /> Work Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {experienceSection.data.map((exp, i) => (
            <Box key={i} mb={3}>
              <Typography variant="h6" component="h3">
                {exp.jobTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {exp.company} | {exp.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                {exp.startDate} - {exp.endDate}
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, backgroundColor: 'transparent' }}>
                <MarkdownPreview
                  style={{
                    backgroundColor: 'transparent',  // removes black
                    color: 'inherit',                // use your text color
                    padding: 0,                      // optional
                  }}
                  source={exp.description || ""} />
              </Typography>
              {i < experienceSection.data.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const Education = () => {
    const educationSection = cvData.sections?.find(s => s.name === "Education");
    if (!educationSection || !educationSection.data || educationSection.data.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <School sx={{ mr: 1 }} /> Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {educationSection.data.map((edu, i) => (
            <Box key={i} mb={3}>
              <Typography variant="h6" component="h3">
                {edu.course}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {edu.college}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                {edu.startDate} - {edu.endDate}
              </Typography>
              <Typography variant="body2">
                <Box component="span" fontWeight="bold">Field of Study: </Box>
                {edu.fieldOfStudy}
              </Typography>
              <Typography variant="body2">
                <Box component="span" fontWeight="bold">Grade: </Box>
                {edu.grade}
              </Typography>
              <Typography variant="body2">
                <Box component="span" fontWeight="bold">Location: </Box>
                {edu.location}
              </Typography>
              {i < educationSection.data.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const Skills = () => {
    const skillsSection = cvData.sections?.find(s => s.name === "Skill");
    if (!skillsSection || !skillsSection.data || skillsSection.data.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1 }} /> Skills
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexWrap="wrap" gap={1}>
            {skillsSection.data.map((skill, i) => (
              <Chip
                key={i}
                label={`${skill.skill} (${'★'.repeat(skill.rating)}${'☆'.repeat(5 - skill.rating)})`}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const Projects = () => {
    const projectsSection = cvData.sections?.find(s => s.name === "Project");
    if (!projectsSection || !projectsSection.data || projectsSection.data.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Code sx={{ mr: 1 }} /> Projects
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {projectsSection.data.map((proj, i) => (
            <Box key={i} mb={3}>
              <Typography variant="h6" component="h3">
                {proj.name}
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, backgroundColor: 'transparent' }}>
                <MarkdownPreview
                  style={{
                    backgroundColor: 'transparent',  // removes black
                    color: 'inherit',                // use your text color
                    padding: 0,                      // optional
                  }}
                  source={proj.description || ""} />
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Box component="span" fontWeight="bold">Technologies: </Box>
                {proj.technologies?.join(", ")}
              </Typography>
              {proj.url && (
                <Typography variant="body2">
                  <Box component="span" fontWeight="bold">URL: </Box>
                  <Box
                    component="a"
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {proj.url}
                  </Box>
                </Typography>
              )}
              {i < projectsSection.data.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const Certifications = () => {
    const certificationsSection = cvData.sections?.find(s => s.name === "Certification");
    if (!certificationsSection || !certificationsSection.data || certificationsSection.data.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <CardMembership sx={{ mr: 1 }} /> Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {certificationsSection.data.map((cert, i) => (
            <Box key={i} mb={2}>
              <Typography variant="h6" component="h3">
                {cert.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cert.institute}
              </Typography>
              <Typography variant="body2">
                Issued: {cert.issueDate}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{
        p: 4,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
      }}>
        <Grid container sx={{ display: 'flex' , flexDirection: 'column' }} spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <PersonalInfo />
            <Skills />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <ProfessionalSummary />
            <Experience />
            <Projects />
            <Education />
            <Certifications />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DefaultCvDesign;