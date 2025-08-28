import React, { useState, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Container,
  List,
  ListItem
} from "@mui/material";
import { LinkedIn, GitHub, Email, Print as PrintIcon, PictureAsPdf, Edit, Delete } from "@mui/icons-material";
import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

// Professional color scheme
const colors = {
  primary: "#2B7A78",  // Teal
  secondary: "#17252A", // Dark blue
  background: "#FFFFFF",
  section: "#F8F9FA",
  text: "#212529",
  accent: "#3AAFA9"    // Light teal
};

// Styled components
const CVContainer = styled(Box)`
  width: 210mm;
  min-height: 297mm;
  margin: auto;
  padding: 20mm;
  background-color: ${colors.background};
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  box-sizing: border-box;
  position: relative;

  @media print {
    box-shadow: none;
    padding: 20mm !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    page-break-after: always;
    background-color: white !important;
  }
`;

const Section = styled(Box)`
  background: ${colors.section};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  page-break-inside: avoid;
  position: relative;
  border-left: 3px solid ${colors.primary};

  @media print {
    background: ${colors.section} !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 700 !important;
  margin-bottom: 1rem !important;
  color: ${colors.primary} !important;
  position: relative;
  display: inline-block;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background: ${colors.primary};
  }

  @media print {
    color: ${colors.primary} !important;
    &::after {
      background: ${colors.primary} !important;
    }
  }
`;

const ProgressContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
`;

const SkillLabel = styled(Typography)`
  min-width: 120px;
  font-weight: 500 !important;
`;

const PrintHide = styled(Box)`
  @media print {
    display: none !important;
  }
`;

const ExperienceItem = styled(Box)`
  padding-left: 16px;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 6px;
    left: -6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${colors.primary};
  }
`;

const StyledChip = styled(Chip)`
  && {
    margin-right: 4px;
    margin-bottom: 4px;
    color: ${colors.primary};
    background-color: #E5F7F0;
    
    @media print {
      background-color: #E5F7F0 !important;
      color: ${colors.primary} !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

const EditableWrapper = styled(Box)`
  position: relative;
  &:hover .edit-controls {
    opacity: 1;
  }
`;

const EditControls = styled(Box)`
  position: absolute;
  top: -12px;
  right: -12px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  display: flex;
  
  @media print {
    display: none !important;
  }
`;

const EditableText = styled(Box)`
  position: relative;
  &:hover .edit-controls {
    opacity: 1;
  }
`;

const EditableImage = styled(Box)`
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
  &:hover .edit-controls {
    opacity: 1;
  }
`;

export default function ProfessionalCV() {
  const cvRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [cvData, setCvData] = useState({
    personal: {
      name: "Rohan Verma",
      title: "Senior Full Stack Developer",
      summary: "Passionate about building scalable web applications with modern JavaScript stacks",
      initial: "RV"
    },
    contact: {
      items: [
        { id: 1, content: "+91 9988776655" },
        { id: 2, content: "rohan.verma@email.com" },
        { id: 3, content: "Mumbai, Maharashtra, India" },
      ],
      social: [
        { id: 1, icon: <LinkedIn />, url: "#" },
        { id: 2, icon: <GitHub />, url: "#" },
        { id: 3, icon: <Email />, url: "#" },
      ]
    },
    skills: {
      items: [
        { id: 1, name: "React", value: 95 },
        { id: 2, name: "Node.js", value: 90 },
        { id: 3, name: "Express", value: 85 },
        { id: 4, name: "MongoDB", value: 80 },
        { id: 5, name: "REST APIs", value: 90 },
      ]
    },
    languages: {
      items: [
        { id: 1, content: "English (Fluent)" },
        { id: 2, content: "Hindi (Native)" },
        { id: 3, content: "Marathi (Native)" },
      ]
    },
    interests: {
      items: [
        { id: 1, content: "Cricket" },
        { id: 2, content: "Tech Blogging" },
        { id: 3, content: "Open Source" },
        { id: 4, content: "Game Development" },
      ]
    },
    awards: {
      items: [
        {
          id: 1,
          title: "Best Employee 2023",
          subtitle: "DEF Corp"
        },
        {
          id: 2,
          title: "Hackathon Winner 2022",
          subtitle: "Tech Innovators Challenge"
        }
      ]
    },
    summary: {
      content: "Full-stack developer with 5+ years of experience building scalable web applications. Specialized in MERN stack with expertise in cloud deployment and CI/CD pipelines. Passionate about clean code architecture and mentoring junior developers."
    },
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "DEF Corp | 2021–Present",
        description: "• Led development of enterprise SaaS platform serving 50K+ users\n• Reduced API response time by 40% through query optimization\n• Implemented CI/CD pipeline reducing deployment time by 70%\n• Mentored 5 junior developers in React best practices"
      },
      {
        id: 2,
        title: "Software Developer Intern",
        company: "GHI Tech | Jan 2020–Jun 2020",
        description: "• Developed RESTful APIs for e-commerce platform\n• Created admin dashboard with React and Material UI\n• Implemented JWT authentication system\n• Reduced server costs by 25% through query optimization"
      }
    ],
    education: [
      {
        id: 1,
        degree: "B.Sc in Information Technology",
        institution: "University of Mumbai | 2017–2020",
        details: "CGPA: 9.2/10"
      },
      {
        id: 2,
        degree: "Diploma in Web Development",
        institution: "Coders Academy | 2016–2017"
      }
    ],
    projects: [
      {
        id: 1,
        title: "Task Manager Pro",
        description: "Full-stack task management system with real-time updates"
      },
      {
        id: 2,
        title: "Portfolio Builder",
        description: "Drag-and-drop portfolio generator with 20+ templates"
      },
      {
        id: 3,
        title: "E-commerce CMS",
        description: "Headless CMS for product management with analytics"
      }
    ],
    certifications: {
      items: [
        { id: 1, content: "AWS Certified Developer - Associate" },
        { id: 2, content: "Google Cloud Professional Developer" },
        { id: 3, content: "Docker Certified Associate" },
        { id: 4, content: "MongoDB Certified Developer" },
      ]
    },
    profileImage: "https://via.placeholder.com/150"
  });

  const theme = createTheme({
    palette: {
      mode: "light",
      background: { default: colors.background, paper: colors.section },
      text: { primary: colors.text },
      primary: { main: colors.primary },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h4: {
        fontWeight: 700,
        color: colors.primary
      },
      h5: {
        fontWeight: 600,
        color: colors.primary
      },
      h6: {
        fontWeight: 500,
        color: colors.secondary
      },
      body1: {
        lineHeight: 1.6,
        color: colors.text
      },
      body2: {
        lineHeight: 1.5,
        color: colors.text
      }
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            marginRight: 4,
            marginBottom: 4,
            backgroundColor: '#E5F7F0',
            color: colors.primary,
            '@media print': {
              backgroundColor: '#E5F7F0 !important',
              color: `${colors.primary} !important`,
            }
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 5,
            backgroundColor: '#E5F7F0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.primary,
            },
            '@media print': {
              backgroundColor: '#E5F7F0 !important',
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${colors.primary} !important`,
              }
            }
          }
        }
      }
    }
  });

  // Handle text editing
  const handleTextChange = (path, id, value) => {
    setCvData(prev => {
      const newData = { ...prev };
      let target = newData;

      path.split('.').forEach(segment => {
        target = target[segment];
      });

      if (Array.isArray(target)) {
        const index = target.findIndex(item => item.id === id);
        if (index !== -1) {
          target[index] = { ...target[index], content: value };
        }
      } else if (typeof target === 'object' && target !== null) {
        target.content = value;
      }

      return newData;
    });
  };

  // Handle complex object editing
  const handleObjectFieldChange = (path, id, field, value) => {
    setCvData(prev => {
      const newData = { ...prev };
      const targetArray = newData[path];
      const index = targetArray.findIndex(item => item.id === id);

      if (index !== -1) {
        targetArray[index] = { ...targetArray[index], [field]: value };
      }

      return newData;
    });
  };

  // Handle item deletion
  const handleDeleteItem = (path, id) => {
    setCvData(prev => {
      const newData = { ...prev };
      let target = newData;
      const segments = path.split('.');

      segments.slice(0, -1).forEach(segment => {
        target = target[segment];
      });

      const lastSegment = segments[segments.length - 1];
      if (Array.isArray(target[lastSegment])) {
        target[lastSegment] = target[lastSegment].filter(item => item.id !== id);
      }

      return newData;
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleImageDelete = () => {
    setCvData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // PDF Download functionality
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = cvRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#FFFFFF",
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is taller than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('professional-cv.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
    onAfterPrint: () => console.log("Printed successfully!")
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ '@media print': { padding: '0 !important' } }}>
        <PrintHide display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
        </PrintHide>

        <CVContainer ref={cvRef}>
          {/* Header Section */}
          <Section>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <EditableWrapper>
                  <Typography variant="h4">{cvData.personal.name}</Typography>
                  <EditControls className="edit-controls">
                    <IconButton size="small" onClick={() => {
                      const newValue = prompt("Edit name", cvData.personal.name);
                      if (newValue !== null) {
                        setCvData(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            name: newValue
                          }
                        }));
                      }
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </EditControls>
                </EditableWrapper>

                <EditableWrapper>
                  <Typography variant="h6" sx={{ letterSpacing: 1.5, mt: 0.5 }}>
                    {cvData.personal.title}
                  </Typography>
                  <EditControls className="edit-controls">
                    <IconButton size="small" onClick={() => {
                      const newValue = prompt("Edit title", cvData.personal.title);
                      if (newValue !== null) {
                        setCvData(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            title: newValue
                          }
                        }));
                      }
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </EditControls>
                </EditableWrapper>

                <EditableWrapper>
                  <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                    "{cvData.personal.summary}"
                  </Typography>
                  <EditControls className="edit-controls">
                    <IconButton size="small" onClick={() => {
                      const newValue = prompt("Edit summary", cvData.personal.summary);
                      if (newValue !== null) {
                        setCvData(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            summary: newValue
                          }
                        }));
                      }
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </EditControls>
                </EditableWrapper>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                {cvData.profileImage && (
                  <EditableImage>
                    <Avatar
                      src={cvData.profileImage}
                      sx={{
                        width: 120,
                        height: 120,
                        border: `3px solid ${colors.primary}`,
                        backgroundColor: colors.section
                      }}
                    />
                    <EditControls className="edit-controls">
                      <IconButton size="small" onClick={() => document.getElementById('image-upload').click()}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleImageDelete}>
                        <Delete fontSize="small" />
                      </IconButton>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </EditControls>
                  </EditableImage>
                )}
              </Grid>
            </Grid>
          </Section>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={5}>
              <Section>
                <SectionTitle variant="h5">Contact</SectionTitle>
                <Box>
                  {cvData.contact.items.map((item) => (
                    <EditableText key={item.id} sx={{ position: 'relative' }}>
                      <Typography>{item.content}</Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit contact", item.content);
                          if (newValue !== null) {
                            handleTextChange('contact.items', item.id, newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('contact.items', item.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>
                  ))}
                  <Box mt={2} display="flex">
                    {cvData.contact.social.map((item) => (
                      <IconButton key={item.id} color="primary">
                        {item.icon}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              </Section>

              <Section>
                <SectionTitle variant="h5">Skills</SectionTitle>
                <Box mt={2}>
                  {cvData.skills.items.map((skill) => (
                    <ProgressContainer key={skill.id}>
                      <SkillLabel>{skill.name}</SkillLabel>
                      <LinearProgress
                        variant="determinate"
                        value={skill.value}
                        color="primary"
                        sx={{ flexGrow: 1 }}
                      />
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newName = prompt("Edit skill name", skill.name);
                          if (newName !== null) {
                            handleObjectFieldChange('skills.items', skill.id, 'name', newName);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit skill value (0-100)", skill.value);
                          if (newValue !== null && !isNaN(newValue)) {
                            handleObjectFieldChange('skills.items', skill.id, 'value', parseInt(newValue));
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('skills.items', skill.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </ProgressContainer>
                  ))}
                </Box>
              </Section>

              <Section>
                <SectionTitle variant="h5">Languages</SectionTitle>
                <Box mt={1}>
                  {cvData.languages.items.map((lang) => (
                    <EditableText key={lang.id} sx={{ position: 'relative' }}>
                      <StyledChip label={lang.content} />
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit language", lang.content);
                          if (newValue !== null) {
                            handleTextChange('languages.items', lang.id, newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('languages.items', lang.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>
                  ))}
                </Box>
              </Section>

              <Section>
                <SectionTitle variant="h5">Interests</SectionTitle>
                <Box mt={1}>
                  {cvData.interests.items.map((interest) => (
                    <EditableText key={interest.id} sx={{ position: 'relative' }}>
                      <StyledChip label={interest.content} />
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit interest", interest.content);
                          if (newValue !== null) {
                            handleTextChange('interests.items', interest.id, newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('interests.items', interest.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>
                  ))}
                </Box>
              </Section>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={7}>
              <Section>
                <SectionTitle variant="h5">Professional Summary</SectionTitle>
                <EditableText sx={{ position: 'relative' }}>
                  <Typography>{cvData.summary.content}</Typography>
                  <EditControls className="edit-controls">
                    <IconButton size="small" onClick={() => {
                      const newValue = prompt("Edit summary", cvData.summary.content);
                      if (newValue !== null) {
                        setCvData(prev => ({
                          ...prev,
                          summary: { content: newValue }
                        }));
                      }
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        summary: { content: "" }
                      }));
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </EditControls>
                </EditableText>
              </Section>

              <Section>
                <SectionTitle variant="h5">Experience</SectionTitle>

                {cvData.experience.map((exp) => (
                  <ExperienceItem key={exp.id}>
                    <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                      <IconButton size="small" onClick={() => {
                        const newTitle = prompt("Edit position", exp.title);
                        if (newTitle !== null) {
                          handleObjectFieldChange('experience', exp.id, 'title', newTitle);
                        }
                      }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteItem('experience', exp.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </EditControls>

                    <EditableText>
                      <Typography variant="subtitle1" fontWeight={600}>{exp.title}</Typography>
                    </EditableText>

                    <EditableText>
                      <Typography color="primary" fontStyle="italic">{exp.company}</Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit company", exp.company);
                          if (newValue !== null) {
                            handleObjectFieldChange('experience', exp.id, 'company', newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>

                    <EditableText sx={{ mt: 1 }}>
                      <Typography variant="body2" whiteSpace="pre-line">
                        {exp.description}
                      </Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit description", exp.description);
                          if (newValue !== null) {
                            handleObjectFieldChange('experience', exp.id, 'description', newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>
                  </ExperienceItem>
                ))}
              </Section>

              <Section>
                <SectionTitle variant="h5">Education</SectionTitle>
                {cvData.education.map((edu) => (
                  <Box key={edu.id} mb={2} sx={{ position: 'relative' }}>
                    <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                      <IconButton size="small" onClick={() => handleDeleteItem('education', edu.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </EditControls>

                    <EditableText>
                      <Typography fontWeight={600}>{edu.degree}</Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit degree", edu.degree);
                          if (newValue !== null) {
                            handleObjectFieldChange('education', edu.id, 'degree', newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>

                    <EditableText>
                      <Typography>{edu.institution}</Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit institution", edu.institution);
                          if (newValue !== null) {
                            handleObjectFieldChange('education', edu.id, 'institution', newValue);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>

                    {edu.details && (
                      <EditableText>
                        <Typography color="textSecondary">{edu.details}</Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit details", edu.details);
                            if (newValue !== null) {
                              handleObjectFieldChange('education', edu.id, 'details', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableText>
                    )}
                  </Box>
                ))}
              </Section>

              <Section>
                <SectionTitle variant="h5">Projects</SectionTitle>
                <Grid container spacing={2} mt={1}>
                  {cvData.projects.map((project) => (
                    <Grid item xs={12} sm={6} key={project.id}>
                      <Box sx={{
                        p: 2,
                        borderLeft: `3px solid ${colors.primary}`,
                        background: 'rgba(43, 122, 120, 0.05)',
                        position: 'relative'
                      }}>
                        <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                          <IconButton size="small" onClick={() => {
                            const newTitle = prompt("Edit project title", project.title);
                            if (newTitle !== null) {
                              handleObjectFieldChange('projects', project.id, 'title', newTitle);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('projects', project.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </EditControls>

                        <EditableText>
                          <Typography fontWeight={600}>{project.title}</Typography>
                        </EditableText>

                        <EditableText>
                          <Typography variant="body2" mt={1}>
                            {project.description}
                          </Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit description", project.description);
                              if (newValue !== null) {
                                handleObjectFieldChange('projects', project.id, 'description', newValue);
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableText>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Section>
            </Grid>
          </Grid>
        </CVContainer>
      </Container>
    </ThemeProvider>
  );
}