import React, { useEffect, useState } from "react";
import axios from "axios";
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
  // MilitaryTech,
  // Interests,
  CardMembership,
  // Language,
  // EmojiEvents,
  LinkedIn,
  GitHub,
  Public
} from "@mui/icons-material";
import { apiUrl } from "../../utils/common";

const Cv1 = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const res = await axios.get(`${apiUrl}/defaultCv/`);
        console.log("✅ CV Data Fetched:", res.data);

        setCvData(res.data.fetchedCvInfo.defaultCvInfo);
      } catch (err) {
        console.error("❌ Error fetching CV:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCv();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!cvData) return <Typography variant="h6" align="center" mt={4}>No CV data available</Typography>;

  // Function to determine icon for social links
  const getSocialIcon = (url) => {
    if (url.includes("linkedin")) return <LinkedIn />;
    if (url.includes("github")) return <GitHub />;
    return <Public />;
  };

  // Left Column Components
  const PersonalInfo = () => (
    <Box>
      <Avatar
        src={cvData.profilePhoto || ""}
        sx={{
          width: 150,
          height: 150,
          border: `4px solid ${theme.palette.primary.main}`,
          mx: 'auto',
          mb: 2
        }}
      />
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
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {exp.description}
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
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                {proj.description}
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
        <Grid container spacing={4}>
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

export default Cv1;