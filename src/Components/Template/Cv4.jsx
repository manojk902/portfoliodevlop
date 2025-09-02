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
  Card,
  CardContent,
  Button,
  Container,
  List,
  ListItem,
  Tooltip
} from "@mui/material";
import {
  LinkedIn,
  GitHub,
  Twitter,
  Download as DownloadIcon,
  LightMode,
  DarkMode,
  Star,
  Print,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

// Themes configuration
const themes = [
  {
    name: "Dark Charcoal",
    bg: "#2C2C2C",
    text: "#F5F5DC",
    accent: "#3B82F6",
    font: "Manrope, sans-serif",
  },
  {
    name: "Light Cream",
    bg: "#F5F5DC",
    text: "#2C2C2C",
    accent: "#3B82F6",
    font: "Inter, sans-serif",
  },
  {
    name: "Blue Gray",
    bg: "#1E293B",
    text: "#F5F5DC",
    accent: "#3B82F6",
    font: "Fira Sans, sans-serif",
  },
  {
    name: "Soft Olive",
    bg: "#556B2F",
    text: "#F5F5DC",
    accent: "#3B82F6",
    font: "Source Sans Pro, sans-serif",
  },
];

// Styled components
const CVContainer = styled(Box)`
  width: 210mm;
  min-height: 297mm;
  margin: auto;
  padding: 20mm;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 8px;
  box-sizing: border-box;
  position: relative;

  @media print {
    box-shadow: none;
    padding: 20mm !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    page-break-after: always;
    background: white !important;
  }
`;

const SectionCard = styled(Card)`
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  page-break-inside: avoid;
  position: relative;

  &:hover .section-controls {
    opacity: 1;
  }

  @media print {
    box-shadow: none !important;
    background: white !important;
    color: black !important;
    border: 1px solid #eee;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 700 !important;
  margin-bottom: 1rem !important;
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
    background: ${({ theme }) => theme.palette.primary.main};
  }

  @media print {
    color: #3B82F6 !important;
    &::after {
      background: #3B82F6 !important;
    }
  }
`;

const PrintHide = styled(Box)`
  @media print {
    display: none !important;
  }
`;

const ExperienceItem = styled(Box)`
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 16px;
  border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  
  &::before {
    content: "";
    position: absolute;
    left: -6px;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.primary.main};
  }

  &:hover .edit-controls {
    opacity: 1;
  }

  @media print {
    border-left: 3px solid #3B82F6 !important;
    &::before {
      background: #3B82F6 !important;
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

const SectionControls = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
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

const EditableImage = styled(Box)`
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
  &:hover .edit-controls {
    opacity: 1;
  }
`;

// const EditableText = styled(Box)`
//   position: relative;
//   &:hover .edit-controls {
//     opacity: 1;
//   }
// `;

export default function ProfessionalCV() {
  const [themeIndex, setThemeIndex] = useState(1); // Default to light theme
  const active = themes[themeIndex];
  const cvRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [cvData, setCvData] = useState({
    personal: {
      name: "Priya Desai",
      title: "Senior Fullstack Developer",
      summary: "Senior Fullstack Developer with 5+ years of experience building scalable web applications. Specialized in React ecosystems with expertise in design systems and component libraries.",
      profileImage: "https://via.placeholder.com/150"
    },
    contact: {
      phone: "+91 9876012345",
      email: "priya.desai@email.com",
      location: "Pune, Maharashtra",
      social: [
        { id: 1, icon: <LinkedIn />, url: "#" },
        { id: 2, icon: <GitHub />, url: "#" },
        { id: 3, icon: <Twitter />, url: "#" },
      ]
    },
    skills: [
      "React", "Next.js", "Node.js", "TypeScript",
      "GraphQL", "Material UI", "Tailwind CSS", "Redux",
      "Express", "MongoDB", "PostgreSQL", "AWS",
      "Docker", "Jest", "Cypress", "CI/CD"
    ],
    experience: [
      {
        id: 1,
        title: "Senior Fullstack Developer",
        company: "ZYX Digital | 2022–Present",
        description: "• Led development of enterprise SaaS platform serving 100K+ users\n• Created design system used across 15+ products\n• Reduced bundle size by 40% through code optimization"
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "LMN Studio | 2020–2022",
        description: "• Developed responsive UIs for e-commerce platforms\n• Implemented component library reducing dev time by 30%\n• Optimized performance achieving 95+ Lighthouse scores"
      }
    ],
    education: [
      {
        id: 1,
        degree: "Master of Computer Applications",
        institution: "Pune University | 2017–2020",
        details: "CGPA: 9.1/10"
      },
      {
        id: 2,
        degree: "Bachelor of Science (Computer Science)",
        institution: "Mumbai University | 2014–2017"
      }
    ],
    projects: [
      {
        id: 1,
        title: "Design System Library",
        description: "Comprehensive React component library with 50+ components used across company products."
      },
      {
        id: 2,
        title: "SaaS Analytics Dashboard",
        description: "Real-time analytics platform processing 1M+ events daily."
      }
    ],
    certifications: [
      "Meta Frontend Professional Certificate (Coursera)",
      "AWS Certified Developer - Associate",
      "Google Cloud Professional Developer",
      "React Advanced Concepts (Frontend Masters)"
    ],
    achievements: [
      "Speaker at React Conf India 2023",
      "Published 15+ technical articles on Medium"
    ]
  });

  const theme = createTheme({
    palette: {
      mode: themeIndex === 1 ? "light" : "dark",
      background: { default: active.bg, paper: active.bg },
      text: { primary: active.text },
      primary: { main: active.accent },
    },
    typography: {
      fontFamily: active.font,
      h4: { fontWeight: 700, letterSpacing: 0.5 },
      h5: { fontWeight: 600, letterSpacing: 0.5 },
      body1: { lineHeight: 1.6 }
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            marginRight: 4,
            marginBottom: 4,
            '@media print': {
              borderColor: '#3B82F6 !important',
              color: 'black !important'
            }
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 5
          }
        }
      }
    }
  });

  // Handle text editing
  const handleTextChange = (path, value) => {
    setCvData(prev => {
      const newData = { ...prev };
      let target = newData;
      const segments = path.split('.');

      segments.slice(0, -1).forEach(segment => {
        target = target[segment];
      });

      const lastSegment = segments[segments.length - 1];
      target[lastSegment] = value;

      return newData;
    });
  };

  // Handle array item editing
  // const handleArrayItemChange = (path, index, value) => {
  //   setCvData(prev => {
  //     const newData = { ...prev };
  //     let target = newData;
  //     const segments = path.split('.');

  //     segments.slice(0, -1).forEach(segment => {
  //       target = target[segment];
  //     });

  //     const lastSegment = segments[segments.length - 1];
  //     target[lastSegment][index] = value;

  //     return newData;
  //   });
  // };

  // Handle object item editing
  const handleObjectItemChange = (path, id, field, value) => {
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
          personal: {
            ...prev.personal,
            profileImage: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleImageDelete = () => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        profileImage: null
      }
    }));
  };

  // Add new item to a section
  const addNewItem = (section) => {
    const newItemId = Date.now();

    setCvData(prev => {
      if (section === 'experience') {
        return {
          ...prev,
          experience: [
            ...prev.experience,
            {
              id: newItemId,
              title: "New Position",
              company: "Company Name | Year",
              description: "• Description point 1\n• Description point 2"
            }
          ]
        };
      } else if (section === 'projects') {
        return {
          ...prev,
          projects: [
            ...prev.projects,
            {
              id: newItemId,
              title: "New Project",
              description: "Project description"
            }
          ]
        };
      }
      return prev;
    });
  };

  // PDF Download functionality
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const originalTheme = themeIndex;

    // Force light theme for PDF generation
    if (originalTheme !== 1) {
      setThemeIndex(1);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

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

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

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
      if (originalTheme !== 1) {
        setThemeIndex(originalTheme);
      }
      setIsGeneratingPDF(false);
    }
  };

  const nextTheme = () =>
    setThemeIndex((prev) => (prev + 1) % themes.length);

  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body, html {
          width: 210mm;
          height: 297mm;
        }
        body {
          margin: 0;
          padding: 0;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .MuiCard-root {
          break-inside: avoid;
        }
      }
    `,
    onAfterPrint: () => console.log("Printed successfully!")
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ '@media print': { padding: '0 !important' } }}>
        <PrintHide display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={nextTheme} color="primary" sx={{ mr: 1 }}>
            {themeIndex === 1 ? <DarkMode /> : <LightMode />}
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
        </PrintHide>

        <CVContainer ref={cvRef}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <EditableWrapper>
              <Typography variant="h4" color="primary" sx={{ '@media print': { color: '#3B82F6 !important' } }}>
                {cvData.personal.name}
              </Typography>
              <EditControls className="edit-controls">
                <IconButton size="small" onClick={() => {
                  const newValue = prompt("Edit name", cvData.personal.name);
                  if (newValue !== null) {
                    handleTextChange('personal.name', newValue);
                  }
                }}>
                  <Edit fontSize="small" />
                </IconButton>
              </EditControls>
            </EditableWrapper>
            <EditableWrapper>
              <Typography variant="h6" color="textSecondary" sx={{ '@media print': { color: 'black !important' } }}>
                {cvData.personal.title}
              </Typography>
              <EditControls className="edit-controls">
                <IconButton size="small" onClick={() => {
                  const newValue = prompt("Edit title", cvData.personal.title);
                  if (newValue !== null) {
                    handleTextChange('personal.title', newValue);
                  }
                }}>
                  <Edit fontSize="small" />
                </IconButton>
              </EditControls>
            </EditableWrapper>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={5}>
              <SectionCard>
                <CardContent>
                  <SectionControls className="section-controls">
                    <Tooltip title="Edit section">
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </SectionControls>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      {cvData.personal.profileImage ? (
                        <EditableImage>
                          <Avatar
                            src={cvData.personal.profileImage}
                            sx={{
                              width: 120,
                              height: 120,
                              border: `3px solid ${active.accent}`,
                              '@media print': { borderColor: '#3B82F6 !important' }
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
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => document.getElementById('image-upload').click()}
                          sx={{ width: 120, height: 120 }}
                        >
                          Add Photo
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <EditableWrapper>
                        <Typography variant="body1" sx={{ '@media print': { color: 'black !important' } }}>
                          <Box component="span" fontWeight="bold">Phone:</Box> {cvData.contact.phone}
                        </Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit phone", cvData.contact.phone);
                            if (newValue !== null) {
                              handleTextChange('contact.phone', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>

                      <EditableWrapper>
                        <Typography variant="body1" sx={{ '@media print': { color: 'black !important' } }}>
                          <Box component="span" fontWeight="bold">Email:</Box> {cvData.contact.email}
                        </Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit email", cvData.contact.email);
                            if (newValue !== null) {
                              handleTextChange('contact.email', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>

                      <EditableWrapper>
                        <Typography variant="body1" sx={{ '@media print': { color: 'black !important' } }}>
                          <Box component="span" fontWeight="bold">Location:</Box> {cvData.contact.location}
                        </Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit location", cvData.contact.location);
                            if (newValue !== null) {
                              handleTextChange('contact.location', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>

                      <Box mt={1} sx={{ '@media print': { display: 'none' } }}>
                        {cvData.contact.social.map((item) => (
                          <IconButton key={item.id} color="primary">
                            {item.icon}
                          </IconButton>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <SectionTitle variant="h5" color="primary">
                    Skills
                  </SectionTitle>
                  <SectionControls className="section-controls">
                    <Tooltip title="Add skill">
                      <IconButton size="small" onClick={() => {
                        const newSkill = prompt("Add new skill");
                        if (newSkill) {
                          setCvData(prev => ({
                            ...prev,
                            skills: [...prev.skills, newSkill]
                          }));
                        }
                      }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </SectionControls>
                  <Grid container spacing={1}>
                    {cvData.skills.map((skill, index) => (
                      <Grid item xs={6} key={index}>
                        <EditableWrapper>
                          <Chip
                            label={skill}
                            color="primary"
                            variant="outlined"
                            sx={{ '@media print': { color: 'black !important', borderColor: '#3B82F6 !important' } }}
                          />
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit skill", skill);
                              if (newValue !== null) {
                                const newSkills = [...cvData.skills];
                                newSkills[index] = newValue;
                                setCvData(prev => ({
                                  ...prev,
                                  skills: newSkills
                                }));
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => {
                              setCvData(prev => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== index)
                              }));
                            }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableWrapper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <SectionTitle variant="h5" color="primary">
                    Certifications
                  </SectionTitle>
                  <SectionControls className="section-controls">
                    <Tooltip title="Add certification">
                      <IconButton size="small" onClick={() => {
                        const newCert = prompt("Add new certification");
                        if (newCert) {
                          setCvData(prev => ({
                            ...prev,
                            certifications: [...prev.certifications, newCert]
                          }));
                        }
                      }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </SectionControls>
                  <List dense>
                    {cvData.certifications.map((cert, index) => (
                      <ListItem key={index} sx={{ py: 0.5, position: 'relative' }}>
                        <EditableWrapper>
                          <Typography>• {cert}</Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit certification", cert);
                              if (newValue !== null) {
                                const newCerts = [...cvData.certifications];
                                newCerts[index] = newValue;
                                setCvData(prev => ({
                                  ...prev,
                                  certifications: newCerts
                                }));
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => {
                              setCvData(prev => ({
                                ...prev,
                                certifications: prev.certifications.filter((_, i) => i !== index)
                              }));
                            }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableWrapper>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <SectionTitle variant="h5" color="primary">
                    Achievements
                  </SectionTitle>
                  <SectionControls className="section-controls">
                    <Tooltip title="Add achievement">
                      <IconButton size="small" onClick={() => {
                        const newAchievement = prompt("Add new achievement");
                        if (newAchievement) {
                          setCvData(prev => ({
                            ...prev,
                            achievements: [...prev.achievements, newAchievement]
                          }));
                        }
                      }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </SectionControls>
                  <Box mt={1}>
                    {cvData.achievements.map((achievement, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={1} position="relative">
                        <EditableWrapper>
                          <Star color="primary" sx={{ mr: 1 }} />
                          <Typography>{achievement}</Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit achievement", achievement);
                              if (newValue !== null) {
                                const newAchievements = [...cvData.achievements];
                                newAchievements[index] = newValue;
                                setCvData(prev => ({
                                  ...prev,
                                  achievements: newAchievements
                                }));
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => {
                              setCvData(prev => ({
                                ...prev,
                                achievements: prev.achievements.filter((_, i) => i !== index)
                              }));
                            }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableWrapper>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </SectionCard>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={7}>
              <SectionCard>
                <CardContent>
                  <SectionTitle variant="h5" color="primary">
                    Professional Summary
                  </SectionTitle>
                  <EditableWrapper>
                    <Typography sx={{ '@media print': { color: 'black !important' } }}>
                      {cvData.personal.summary}
                    </Typography>
                    <EditControls className="edit-controls">
                      <IconButton size="small" onClick={() => {
                        const newValue = prompt("Edit summary", cvData.personal.summary);
                        if (newValue !== null) {
                          handleTextChange('personal.summary', newValue);
                        }
                      }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </EditControls>
                  </EditableWrapper>
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <SectionTitle variant="h5" color="primary">
                      Experience
                    </SectionTitle>
                    <Tooltip title="Add experience">
                      <IconButton onClick={() => addNewItem('experience')}>
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {cvData.experience.map((exp) => (
                    <ExperienceItem key={exp.id}>
                      <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                        <IconButton size="small" onClick={() => {
                          const newTitle = prompt("Edit position", exp.title);
                          if (newTitle !== null) {
                            handleObjectItemChange('experience', exp.id, 'title', newTitle);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('experience', exp.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>

                      <EditableWrapper>
                        <Typography variant="subtitle1" fontWeight={600}>{exp.title}</Typography>
                      </EditableWrapper>

                      <EditableWrapper>
                        <Typography color="primary" fontStyle="italic">{exp.company}</Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit company", exp.company);
                            if (newValue !== null) {
                              handleObjectItemChange('experience', exp.id, 'company', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>

                      <EditableWrapper sx={{ mt: 1 }}>
                        <Typography variant="body2" whiteSpace="pre-line">
                          {exp.description}
                        </Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit description", exp.description);
                            if (newValue !== null) {
                              handleObjectItemChange('experience', exp.id, 'description', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>
                    </ExperienceItem>
                  ))}
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <SectionTitle variant="h5" color="primary">
                    Education
                  </SectionTitle>
                  {cvData.education.map((edu, index) => (
                    <Box key={index} mb={2} position="relative">
                      <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                        <IconButton size="small" onClick={() => {
                          const newDegree = prompt("Edit degree", edu.degree);
                          if (newDegree !== null) {
                            const newEducation = [...cvData.education];
                            newEducation[index] = { ...newEducation[index], degree: newDegree };
                            setCvData(prev => ({
                              ...prev,
                              education: newEducation
                            }));
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setCvData(prev => ({
                            ...prev,
                            education: prev.education.filter((_, i) => i !== index)
                          }));
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>

                      <EditableWrapper>
                        <Typography fontWeight={600}>{edu.degree}</Typography>
                      </EditableWrapper>

                      <EditableWrapper>
                        <Typography>{edu.institution}</Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit institution", edu.institution);
                            if (newValue !== null) {
                              const newEducation = [...cvData.education];
                              newEducation[index] = { ...newEducation[index], institution: newValue };
                              setCvData(prev => ({
                                ...prev,
                                education: newEducation
                              }));
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>

                      {edu.details && (
                        <EditableWrapper>
                          <Typography color="textSecondary">{edu.details}</Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit details", edu.details);
                              if (newValue !== null) {
                                const newEducation = [...cvData.education];
                                newEducation[index] = { ...newEducation[index], details: newValue };
                                setCvData(prev => ({
                                  ...prev,
                                  education: newEducation
                                }));
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableWrapper>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </SectionCard>

              <SectionCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <SectionTitle variant="h5" color="primary">
                      Projects
                    </SectionTitle>
                    <Tooltip title="Add project">
                      <IconButton onClick={() => addNewItem('projects')}>
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {cvData.projects.map((project) => (
                    <Box key={project.id} mt={2} position="relative">
                      <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                        <IconButton size="small" onClick={() => {
                          const newTitle = prompt("Edit project title", project.title);
                          if (newTitle !== null) {
                            handleObjectItemChange('projects', project.id, 'title', newTitle);
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('projects', project.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>

                      <EditableWrapper>
                        <Typography fontWeight={600}>{project.title}</Typography>
                      </EditableWrapper>

                      <EditableWrapper>
                        <Typography variant="body2" mt={1}>
                          {project.description}
                        </Typography>
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => {
                            const newValue = prompt("Edit description", project.description);
                            if (newValue !== null) {
                              handleObjectItemChange('projects', project.id, 'description', newValue);
                            }
                          }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </EditControls>
                      </EditableWrapper>
                    </Box>
                  ))}
                </CardContent>
              </SectionCard>
            </Grid>
          </Grid>
        </CVContainer>
      </Container>
    </ThemeProvider>
  );
}