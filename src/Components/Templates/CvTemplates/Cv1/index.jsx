import React, { useState, useRef, useEffect } from "react";
import {
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Avatar,
  Button, Chip, Divider, IconButton, Grid, Paper, Container, Link,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import {
  LightMode, DarkMode, Print, Download, Email, Phone,
  LinkedIn, GitHub, Edit, AddAPhoto
} from "@mui/icons-material";
import { styled } from "@mui/system";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { apiUrl } from "../../../../utils/common";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f8f9fa", paper: "#ffffff" },
    text: { primary: "#2d3748" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700, letterSpacing: 0.5 },
    h5: { fontWeight: 600, fontSize: "1.3rem" },
    h6: { fontWeight: 600, fontSize: "1.1rem" },
    subtitle1: { color: "#4a5568" }
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#ce93d8" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#e2e8f0" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700, letterSpacing: 0.5 },
    h5: { fontWeight: 600, fontSize: "1.3rem" },
    h6: { fontWeight: 600, fontSize: "1.1rem" },
    subtitle1: { color: "#a0aec0" }
  }
});

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: 900,
  margin: "2rem auto",
  padding: "2rem",
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[4],
  borderRadius: 12,
  position: "relative",
  "@media print": {
    boxShadow: "none",
    padding: 0,
    margin: 0,
    maxWidth: "100%",
    width: "100%",
    minHeight: "297mm"
  }
}));

const ActionBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  "@media print": {
    display: "none"
  }
}));

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginTop: theme.spacing(3),
  borderRadius: 10,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: "relative"
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  position: "relative"
}));

const EditableWrapper = styled(Box)({
  position: "relative",
  display: "inline-block",
  "&:hover .edit-button": {
    opacity: 1,
    visibility: "visible"
  }
});

const EditButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 0,
  transform: "translate(50%, -50%)",
  background: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  padding: "4px",
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.2s, visibility 0.2s",
  "&:hover": {
    background: "#f5f5f5"
  }
});

const AvatarEditButton = styled(IconButton)({
  position: "absolute",
  bottom: 0,
  right: 0,
  background: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  padding: "4px",
  zIndex: 2,
  "&:hover": {
    background: "#f5f5f5"
  }
});

const SectionLine = ({ value, onChange, component: Component, ...props }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEditClick = () => {
    setTempValue(value);
    setEditing(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setEditing(false);
  };

  return (
    <EditableWrapper>
      <Component {...props}>{value}</Component>
      <EditButton
        className="edit-button no-print"
        onClick={handleEditClick}
        size="small"
      >
        <Edit fontSize="small" />
      </EditButton>

      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Edit Content</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </EditableWrapper>
  );
};

// const ListItemLine = ({ value, onChange }) => {
//   return (
//     <li>
//       <SectionLine
//         value={value}
//         onChange={onChange}
//         component={Typography}
//         variant="body2"
//       />
//     </li>
//   );
// };

function Cv1() {
  // const [cv, setCv] = useState(null); // Initialize with null to handle loading state
  const [hasVal] = useState(true);
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [isDark, setIsDark] = useState(false);
  const cvRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cvData, setCvData] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCvData = async () => {
      try {
        // Reset states on new fetch
        setLoading(true);
        setError(null);

        // Use our new 'get' function. No need to write the full URL!
        const fetchedCv = await axios.get(`${apiUrl}/cv-details/manoj_804`);
        const fetchedUser = await axios.get(`${apiUrl}/user-details/manoj_804`);

        console.log(fetchedCv.data.fetchedCv, "this");
        // setCv(fetchedCv); // Assuming the data is directly what you need
        setCvData(fetchedCv.data.fetchedCv)
        setUser(fetchedUser.data.fetchedUsed)

        console.log(fetchedUser.data.fetchedUsed, "this is user");

      } catch (err) {
        // The error was thrown by our helper, so we can catch it here
        setError('Failed to fetch CV details. Please try again later.');
        console.error(err); // Log the detailed error for developers
      } finally {
        // This runs whether the request succeeded or failed
        setLoading(false);
      }
    };

    fetchCvData();
  }, [])
  console.log(cvData, "this is cv dataaa");

  // Show a loading message
  if (loading) {
    return <div>Loading your CV...</div>;
  }

  // Show an error message if something went wrong
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }



  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeader('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update functions for each section
  const updateHeader = (field, value) => {
    setCvData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value
      }
    }));
  };

  const updateSummary = (value) => {
    setCvData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const updateExperience = (index, field, value) => {
    setCvData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = {
        ...newExperience[index],
        [field]: value
      };
      return { ...prev, experience: newExperience };
    });
  };

  // const updateExperiencePoint = (expIndex, pointIndex, value) => {
  //   setCvData(prev => {
  //     const newExperience = [...prev.experience];
  //     const newPoints = [...newExperience[expIndex].points];
  //     newPoints[pointIndex] = value;
  //     newExperience[expIndex] = {
  //       ...newExperience[expIndex],
  //       points: newPoints
  //     };
  //     return { ...prev, experience: newExperience };
  //   });
  // };

  const updateProject = (index, field, value) => {
    setCvData(prev => {
      const newProjects = [...prev.projects];
      newProjects[index] = {
        ...newProjects[index],
        [field]: value
      };
      return { ...prev, projects: newProjects };
    });
  };

  const updateEducation = (index, field, value) => {
    setCvData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
      return { ...prev, education: newEducation };
    });
  };

  const updateCertification = (index, value) => {
    setCvData(prev => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = value;
      return { ...prev, certifications: newCertifications };
    });
  };

  const updateSkills = (category, value) => {
    setCvData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: value
      }
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = () => {
    const input = cvRef.current;

    // Hide action buttons before capturing
    const actionBar = input.querySelector('.no-print');
    if (actionBar) actionBar.style.display = 'none';

    // Set the container to A4 dimensions for PDF
    const originalWidth = input.style.width;
    const originalPadding = input.style.padding;
    input.style.width = '210mm';
    input.style.padding = '0';
    input.style.boxShadow = 'none';

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: isDark ? "#121212" : "#ffffff",
      windowWidth: 794, // A4 width in pixels (210mm)
      width: 794,
      height: input.scrollHeight,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      // Restore original styles
      input.style.width = originalWidth;
      input.style.padding = originalPadding;
      input.style.boxShadow = '';
      if (actionBar) actionBar.style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${cvData.header.name}.pdf`);

    });
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <StyledContainer ref={cvRef}>
        <style>
          {`
            @media print {
              html, body, #root {
                width: 210mm;
                min-height: 297mm;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: white !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>

        <ActionBar className="no-print">
          <IconButton onClick={() => setIsDark(!isDark)} color="primary">
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            onClick={handlePrint}
            size="small"
          >
            Print
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Download />}
            onClick={downloadPDF}
            size="small"
          >
            PDF
          </Button>
        </ActionBar>

        {/* Header Section with Profile Image */}
        <Box display="flex" alignItems="center" gap={3} mb={3} position="relative">
          <Box position="relative" display="inline-block">
            <Avatar
              src={cvData?.header?.profileImage}
              alt={cvData?.header?.name}
              sx={{ width: 120, height: 120, border: "3px solid", borderColor: "primary.main" }}
            />
            <AvatarEditButton
              className="no-print"
              onClick={() => fileInputRef.current.click()}
              size="small"
            >
              <AddAPhoto fontSize="small" />
            </AvatarEditButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Box>




          <Box>
            {hasVal ? (<SectionLine
              value={`${user.firstName} ${user.lastName}`}
              onChange={(val) => updateHeader('name', val)}
              component={Typography}
              variant="h4"
            />) : <SectionLine
              value={"jatin"}
              onChange={(val) => updateHeader('name', val)}
              component={Typography}
              variant="h4"
            />}

            <SectionLine
              value={user.designation}
              onChange={(val) => updateHeader('title', val)}
              component={Typography}
              variant="subtitle1"
              mt={0.5}
            />
            <Box display="flex" gap={2} mt={1.5}>
              <Chip
                icon={<Email />}
                label={
                  <SectionLine
                    value={user.email}
                    onChange={(val) => updateHeader('email', val)}
                    component="span"
                  />
                }
                size="small"
              />
              <Chip
                icon={<Phone />}
                label={
                  <SectionLine
                    value={user.phoneNo}
                    onChange={(val) => updateHeader('phone', val)}
                    component="span"
                  />
                }
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Professional Summary
              </Typography>
              <SectionLine
                // value={"work  "}
                value={cvData.summary}
                onChange={updateSummary}
                component={Typography}
                variant="body1"
              />
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Work Experience
              </Typography>

              {/* "jobTitle": "string",
      "company": "string",
      "location": "string",
      "startDate": "2025-08-18",
      "endDate": "2025-08-18",
      "description": "string" */}

              {cvData?.experience.map((exp, expIndex) => (
                <Box key={expIndex} mb={3}>
                  <Box display="flex" justifyContent="space-between">
                    <SectionLine
                      value={exp.company}
                      onChange={(val) => updateExperience(expIndex, 'company', val)}
                      component={Typography}
                      variant="h6"
                    />
                    <SectionLine
                      value={`${exp.startDate}${exp.endDate}`}
                      onChange={(val) => updateExperience(expIndex, 'period', val)}
                      component={Typography}
                      variant="body2"
                      color="text.secondary"
                    />
                  </Box>
                  <SectionLine
                    value={exp.jobTitle}
                    onChange={(val) => updateExperience(expIndex, 'position', val)}
                    component={Typography}
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  />
                  {/* <ul>
                    {exp.points.map((point, pointIndex) => (
                      <ListItemLine
                        key={pointIndex}
                        value={point}
                        onChange={(val) => updateExperiencePoint(expIndex, pointIndex, val)}
                      />
                    ))}
                  </ul> */}
                </Box>
              ))}
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Projects
              </Typography>

              <Grid container spacing={2}>
                {cvData.projects.map((project, index) => (
                  <Box>
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper elevation={0} sx={{ p: 2, height: "100%", borderLeft: "3px solid", borderColor: "primary.main" }}>
                        <SectionLine
                          value={`${project.name} =>`}
                          onChange={(val) => updateProject(index, 'title', val)}
                          component={Typography}
                          variant="h6"
                          gutterBottom
                        />
                        <SectionLine
                          value={project.description}
                          onChange={(val) => updateProject(index, 'description', val)}
                          component={Typography}
                          variant="body2"
                        />
                        <Box mt={1.5}>
                          {project.technologies.map((skill, skillIndex) => (
                            <SkillChip
                              key={skillIndex}
                              label={
                                <SectionLine
                                  value={skill}
                                  onChange={(val) => {
                                    const newSkills = [...project.skills];
                                    newSkills[skillIndex] = val;
                                    updateProject(index, 'skills', newSkills);
                                  }}
                                  component="span"
                                />
                              }
                              size="small"
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Section>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Skills
              </Typography>
              <Box>
                {/* <Typography variant="subtitle1" fontWeight={600} mt={1}>
                  Frontend
                </Typography> */}
                <Box display="flex" flexWrap="wrap" mt={1}>
                  {cvData.skills.map((skill, index) => (
                    <SkillChip
                      key={index}
                      label={
                        <SectionLine
                          value={skill}
                          onChange={(val) => {
                            const newSkills = [...cvData.skills.frontend];
                            newSkills[index] = val;
                            updateSkills('frontend', newSkills);
                          }}
                          component="span"
                        />
                      }
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Languages
              </Typography>
              {
                cvData.languages.map((lang, langIndex) => (
                  <Typography key={langIndex}>{`${lang.language}(${lang.proficiency})`} </Typography>
                ))
              }
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                interests
              </Typography>
              {
                cvData.interests.map((interest, interIndex) => (
                  <Typography key={interIndex}>{`${interest}`} </Typography>
                ))
              }
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                achievements
              </Typography>
              {
                cvData.achievements.map((achive, achiveIndex) => (
                  <Typography key={achiveIndex}>{`${achive}`} </Typography>
                ))
              }
            </Section>
            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Education
              </Typography>
              {cvData.education.map((edu, index) => (
                <Box key={index} mb={index < cvData.education.length - 1 ? 2 : 0}>
                  <SectionLine
                    value={edu.fieldOfStudy}
                    onChange={(val) => updateEducation(index, 'degree', val)}
                    component={Typography}
                    variant="h6"
                  />
                  <SectionLine
                    value={edu.collage}
                    onChange={(val) => updateEducation(index, 'institution', val)}
                    component={Typography}
                    variant="body2"
                  />
                  <SectionLine
                    value={edu.details}
                    onChange={(val) => updateEducation(index, 'details', val)}
                    component={Typography}
                    variant="body2"
                    color="text.secondary"
                  />
                </Box>
              ))}
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Certifications
              </Typography>
              <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                {cvData.certifications.map((cert, index) => (
                  <li key={index}>
                    <SectionLine
                      value={`${cert.name} from ${cert.institute} IssueDate ${cert.issueDate}`}
                      onChange={(val) => updateCertification(index, val)}
                      component={Typography}
                      variant="body2"
                    />
                  </li>
                ))}
              </ul>
            </Section>

            <Section>
              <Typography variant="h5" color="primary" gutterBottom>
                Contact
              </Typography>
              <ContactItem>
                <Email fontSize="small" />
                <SectionLine
                  value={user.email}
                  onChange={(val) => updateHeader('email', val)}
                  component={Typography}
                  variant="body2"
                />
              </ContactItem>
              <ContactItem>
                <Phone fontSize="small" />
                <SectionLine
                  value={user.phoneNo}
                  onChange={(val) => updateHeader('phone', val)}
                  component={Typography}
                  variant="body2"
                />
              </ContactItem>
              <ContactItem>
                <LinkedIn fontSize="small" />
                <Link href="#" variant="body2">
                  <SectionLine
                    value={user?.linkedin}
                    onChange={(val) => updateHeader('linkedin', val)}
                    component="span"
                  />
                </Link>
              </ContactItem>
              <ContactItem>
                <GitHub fontSize="small" />
                <Link href="#" variant="body2">
                  <SectionLine
                    value={cvData?.header?.github}
                    onChange={(val) => updateHeader('github', val)}
                    component="span"
                  />
                </Link>
              </ContactItem>
            </Section>
          </Grid>
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
}
export default Cv1;