import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  Button,
  Container,
  IconButton,
  CircularProgress,
  Alert
} from "@mui/material";
import { Print, PictureAsPdf, Edit, Delete } from "@mui/icons-material";
import styled from "@emotion/styled";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { apiUrl } from "../../utils/common";

const themeData = {
  name: "Professional Light",
  bg: "#FFFFFF",
  text: "#2C3E50",
  accent: "#2980B9",
  font: "'Roboto Slab', serif",
  body: "'Roboto', sans-serif",
};

const CVContainer = styled(Box)`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 15mm;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  background-color: ${themeData.bg};
  box-sizing: border-box;
  overflow: hidden;

  @media print {
    box-shadow: none;
    padding: 0 !important;
    margin: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    overflow: visible !important;
  }
`;

const Initial = styled(Typography)`
  font-size: 12rem;
  font-weight: bold;
  opacity: 0.05;
  position: absolute;
  top: -30px;
  right: 0;
  z-index: 0;
  line-height: 1;
  pointer-events: none;

  @media print {
    opacity: 0.07;
    font-size: 10rem;
    top: -20px;
  }
`;

const Section = styled(Box)`
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;

  @media print {
    margin-bottom: 1rem;
    page-break-inside: avoid;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 700 !important;
  letter-spacing: 1px;
  margin-bottom: 0.75rem !important;
  position: relative;
  display: inline-block;
  padding-bottom: 4px;
  text-transform: uppercase;
  font-size: 1.1rem !important;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background: ${themeData.accent};
  }
`;

const PrintHide = styled(Box)`
  @media print {
    display: none !important;
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
  background: ${themeData.bg};
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

export default function Cv2() {
  const cvRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvData, setCvData] = useState({
    personal: {
      name: "",
      title: "",
      initial: ""
    },
    contact: {
      items: []
    },
    skills: {
      items: []
    },
    languages: {
      items: []
    },
    awards: {
      items: []
    },
    achievements: {
      items: []
    },
    interests: {
      items: []
    },
    profile: {
      content: ""
    },
    experience: [],
    education: [],
    certifications: {
      items: []
    },
    projects: [],
    profileImage: null
  });

  // Fetch data from API
  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/defaultCv/mukesh_277`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the API response to console
        console.log("API Response:", data);

        // Check if the API response has the expected structure
        if (data.status === 'success' && data.fetchedCvInfo) {
          // Transform API data to match our component structure
          const transformedData = transformAPIData(data.fetchedCvInfo);
          setCvData(transformedData);
        } else {
          throw new Error("Invalid API response structure");
        }

        setLoading(false);
      } catch (err) {
        // console.error("Error fetching CV data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);

  // Function to transform API data to our component structure
  const transformAPIData = (apiData) => {
    // Create initials from first and last name
    const firstName = apiData.firstName || '';
    const lastName = apiData.lastName || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

    // Create address string
    const address = apiData.defaultCvInfo?.address
      ? `${apiData.defaultCvInfo.address.city || ''}, ${apiData.defaultCvInfo.address.state || ''}, ${apiData.defaultCvInfo.address.country || ''}`
      : '';

    // Format date of birth
    const dob = apiData.dob ? new Date(apiData.dob).toLocaleDateString() : '';

    // Create contact items
    const contactItems = [
      { id: 1, content: apiData.phoneNo || '' },
      { id: 2, content: apiData.email || '' },
      { id: 3, content: address },
      { id: 4, content: `DOB: ${dob}` },
      { id: 5, content: `Gender: ${apiData.gender || ''}` },
      ...(apiData.socialLinks?.map((link, index) => ({ id: 6 + index, content: link })) || [])
    ].filter(item => item.content && item.content !== 'DOB: ' && item.content !== 'Gender: '); // Remove empty items

    // Extract sections from API data
    const sections = {};
    if (apiData.sections && Array.isArray(apiData.sections)) {
      apiData.sections.forEach(section => {
        sections[section.name] = section.data;
      });
    }

    return {
      personal: {
        name: `${firstName} ${lastName}`.trim(),
        title: apiData.designation || '',
        initial: initials
      },
      contact: {
        items: contactItems
      },
      skills: {
        items: (sections.Skill || []).map((skill, index) => ({
          id: index + 1,
          content: `${skill.skill}${skill.rating ? ` (${skill.rating}/10)` : ''}`
        }))
      },
      languages: {
        items: (sections.Language || []).map((lang, index) => ({
          id: index + 1,
          content: `${lang.language} (${lang.proficiency})`
        }))
      },
      awards: {
        items: (sections.Award || []).map((award, index) => ({
          id: index + 1,
          title: award.title || '',
          subtitle: `${award.issuer || ''}${award.date ? `, ${new Date(award.date).getFullYear()}` : ''}`
        }))
      },
      achievements: {
        items: (sections.Achievement || []).map((achievement, index) => ({
          id: index + 1,
          content: achievement
        }))
      },
      interests: {
        items: (sections.Interest || []).map((interest, index) => ({
          id: index + 1,
          content: interest
        }))
      },
      profile: {
        content: sections.Summary || ''
      },
      experience: (sections.Experience || []).map((exp, index) => ({
        id: index + 1,
        title: exp.jobTitle || '',
        company: `${exp.company || ''}${exp.location ? `, ${exp.location}` : ''} | ${formatDateRange(exp.startDate, exp.endDate)}`,
        description: exp.description || ''
      })),
      education: (sections.Education || []).map((edu, index) => ({
        id: index + 1,
        degree: `${edu.course || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
        institution: `${edu.college || ''}${edu.location ? `, ${edu.location}` : ''} | ${formatDateRange(edu.startDate, edu.endDate)}${edu.grade ? `, Grade: ${edu.grade}` : ''}`
      })),
      certifications: {
        items: (sections.Certification || []).map((cert, index) => ({
          id: index + 1,
          content: `${cert.name || ''}${cert.institute ? `, ${cert.institute}` : ''}${cert.issueDate ? `, ${new Date(cert.issueDate).getFullYear()}` : ''}`
        }))
      },
      projects: (sections.Project || []).map((proj, index) => ({
        id: index + 1,
        title: proj.name || '',
        description: proj.description || ''
      })),
      profileImage: apiData.profilePhoto || null
    };
  };

  // Helper function to format date range
  const formatDateRange = (startDate, endDate) => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.getFullYear();
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';

    return start && end ? `${start}-${end}` : start || end;
  };

  const theme = createTheme({
    palette: {
      mode: "light",
      background: { default: themeData.bg, paper: themeData.bg },
      text: { primary: themeData.text },
      primary: { main: themeData.accent },
    },
    typography: {
      fontFamily: themeData.body,
      h4: {
        fontFamily: themeData.font,
        fontWeight: 700,
        letterSpacing: 1.5,
        marginBottom: '0.5rem'
      },
      h5: {
        fontFamily: themeData.font,
        fontWeight: 600,
        letterSpacing: 1
      },
      h6: {
        fontFamily: themeData.font,
        letterSpacing: 1.2,
        fontWeight: 500
      },
      body1: {
        lineHeight: 1.6,
        fontSize: '0.95rem'
      },
      body2: {
        lineHeight: 1.5,
        fontSize: '0.9rem'
      }
    },
    components: {
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: themeData.accent + "40"
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

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: "Professional_CV",
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
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: ${themeData.bg} !important;
          margin: 0;
          padding: 0;
        }
        ${CVContainer} {
          box-shadow: none;
          padding: 0 !important;
          margin: 0 !important;
          width: 210mm !important;
          min-height: 297mm !important;
        }
      }
    `,
    onAfterPrint: () => console.log("Printed successfully!")
  });

  // PDF Download functionality
  const handleDownloadPDF = async () => {
    const input = cvRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the scale to fit the content
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('Professional_CV.pdf');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading CV data: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          padding: '20px 0',
          '@media print': {
            padding: 0,
            margin: 0,
            width: '100%',
            height: '100%'
          },
        }}
      >
        <PrintHide
          display="flex"
          justifyContent="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
          sx={{
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ minWidth: '180px' }}
          >
            Print CV
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadPDF}
            sx={{ minWidth: '180px' }}
          >
            Download PDF
          </Button>
        </PrintHide>

        <Box display="flex" justifyContent="center" sx={{ '@media print': { margin: 0 } }}>
          <CVContainer ref={cvRef}>
            <Initial>{cvData.personal.initial}</Initial>

            <Box mb={4} position="relative" zIndex={1}>
              <EditableWrapper>
                <Typography variant="h4" color="primary">
                  {cvData.personal.name}
                </Typography>
                <EditControls className="edit-controls">
                  <IconButton size="small" onClick={() => {
                    const newName = prompt("Edit name", cvData.personal.name);
                    if (newName) {
                      setCvData(prev => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          name: newName
                        }
                      }));
                    }
                  }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </EditControls>
              </EditableWrapper>

              <EditableWrapper>
                <Typography variant="h6" sx={{ letterSpacing: 1.5 }}>
                  {cvData.personal.title}
                </Typography>
                <EditControls className="edit-controls">
                  <IconButton size="small" onClick={() => {
                    const newTitle = prompt("Edit title", cvData.personal.title);
                    if (newTitle) {
                      setCvData(prev => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          title: newTitle
                        }
                      }));
                    }
                  }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </EditControls>
              </EditableWrapper>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Section>
                  <SectionTitle variant="h5" color="primary">
                    Contact
                  </SectionTitle>
                  <Box>
                    {cvData.profileImage && (
                      <EditableImage>
                        <img
                          src={cvData.profileImage}
                          alt="Profile"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 8
                          }}
                        />
                        <EditControls className="edit-controls">
                          <IconButton size="small" onClick={() => document.getElementById('image-upload').click()}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={handleImageDelete}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </EditControls>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                      </EditableImage>
                    )}
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
                  </Box>
                </Section>

                {cvData.skills.items.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Skills
                    </SectionTitle>
                    <List dense sx={{ py: 0 }}>
                      {cvData.skills.items.map((skill) => (
                        <ListItem key={skill.id} sx={{ py: 0.25, px: 0, position: 'relative' }}>
                          <EditableText>
                            • {skill.content}
                            <EditControls className="edit-controls">
                              <IconButton size="small" onClick={() => {
                                const newValue = prompt("Edit skill", skill.content);
                                if (newValue !== null) {
                                  handleTextChange('skills.items', skill.id, newValue);
                                }
                              }}>
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteItem('skills.items', skill.id)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </EditControls>
                          </EditableText>
                        </ListItem>
                      ))}
                    </List>
                  </Section>
                )}

                {cvData.languages.items.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Languages
                    </SectionTitle>
                    {cvData.languages.items.map((lang) => (
                      <EditableText key={lang.id} sx={{ position: 'relative' }}>
                        <Typography>{lang.content}</Typography>
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
                  </Section>
                )}

                {cvData.awards.items.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Awards
                    </SectionTitle>
                    <Box>
                      {cvData.awards.items.map((award) => (
                        <Box key={award.id} sx={{ position: 'relative', mb: 1 }}>
                          <EditableText>
                            <Typography fontWeight={500}>{award.title}</Typography>
                            <EditControls className="edit-controls">
                              <IconButton size="small" onClick={() => {
                                const newValue = prompt("Edit award title", award.title);
                                if (newValue !== null) {
                                  setCvData(prev => {
                                    const newItems = prev.awards.items.map(item =>
                                      item.id === award.id ? { ...item, title: newValue } : item
                                    );
                                    return {
                                      ...prev,
                                      awards: { ...prev.awards, items: newItems }
                                    };
                                  });
                                }
                              }}>
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => {
                                setCvData(prev => ({
                                  ...prev,
                                  awards: {
                                    ...prev.awards,
                                    items: prev.awards.items.filter(item => item.id !== award.id)
                                  }
                                }));
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </EditControls>
                          </EditableText>
                          <EditableText>
                            <Typography variant="body2">{award.subtitle}</Typography>
                            <EditControls className="edit-controls">
                              <IconButton size="small" onClick={() => {
                                const newValue = prompt("Edit award subtitle", award.subtitle);
                                if (newValue !== null) {
                                  setCvData(prev => {
                                    const newItems = prev.awards.items.map(item =>
                                      item.id === award.id ? { ...item, subtitle: newValue } : item
                                    );
                                    return {
                                      ...prev,
                                      awards: { ...prev.awards, items: newItems }
                                    };
                                  });
                                }
                              }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </EditControls>
                          </EditableText>
                        </Box>
                      ))}
                    </Box>
                  </Section>
                )}

                {cvData.achievements.items.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Achievements
                    </SectionTitle>
                    <List dense sx={{ py: 0 }}>
                      {cvData.achievements.items.map((achievement) => (
                        <ListItem key={achievement.id} sx={{ py: 0.25, px: 0, position: 'relative' }}>
                          <EditableText>
                            • {achievement.content}
                            <EditControls className="edit-controls">
                              <IconButton size="small" onClick={() => {
                                const newValue = prompt("Edit achievement", achievement.content);
                                if (newValue !== null) {
                                  handleTextChange('achievements.items', achievement.id, newValue);
                                }
                              }}>
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteItem('achievements.items', achievement.id)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </EditControls>
                          </EditableText>
                        </ListItem>
                      ))}
                    </List>
                  </Section>
                )}

                {cvData.interests.items.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Interests
                    </SectionTitle>
                    <List dense sx={{ py: 0 }}>
                      {cvData.interests.items.map((interest) => (
                        <ListItem key={interest.id} sx={{ py: 0.25, px: 0, position: 'relative' }}>
                          <EditableText>
                            • {interest.content}
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
                        </ListItem>
                      ))}
                    </List>
                  </Section>
                )}
              </Grid>

              <Grid item xs={12} md={8}>
                {cvData.profile.content && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Profile
                    </SectionTitle>
                    <EditableText sx={{ position: 'relative' }}>
                      <Typography>{cvData.profile.content}</Typography>
                      <EditControls className="edit-controls">
                        <IconButton size="small" onClick={() => {
                          const newValue = prompt("Edit profile", cvData.profile.content);
                          if (newValue !== null) {
                            setCvData(prev => ({
                              ...prev,
                              profile: { content: newValue }
                            }));
                          }
                        }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setCvData(prev => ({
                            ...prev,
                            profile: { content: "" }
                          }));
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </EditControls>
                    </EditableText>
                  </Section>
                )}

                {cvData.experience.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Experience
                    </SectionTitle>
                    {cvData.experience.map((exp) => (
                      <Box key={exp.id} mb={3} sx={{ position: 'relative' }}>
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
                          <Typography fontWeight={600}>{exp.title}</Typography>
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
                      </Box>
                    ))}
                  </Section>
                )}

                <Grid container spacing={2}>
                  {cvData.education.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Section>
                        <SectionTitle variant="h5" color="primary">
                          Education
                        </SectionTitle>
                        <Box>
                          {cvData.education.map((edu) => (
                            <Box key={edu.id} sx={{ position: 'relative', mb: 1.5 }}>
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
                                <Typography variant="body2">{edu.institution}</Typography>
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
                            </Box>
                          ))}
                        </Box>
                      </Section>
                    </Grid>
                  )}

                  {cvData.certifications.items.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Section>
                        <SectionTitle variant="h5" color="primary">
                          Certifications
                        </SectionTitle>
                        <Box>
                          {cvData.certifications.items.map((cert) => (
                            <EditableText key={cert.id} sx={{ position: 'relative' }}>
                              <Typography variant="body2">{cert.content}</Typography>
                              <EditControls className="edit-controls">
                                <IconButton size="small" onClick={() => {
                                  const newValue = prompt("Edit certification", cert.content);
                                  if (newValue !== null) {
                                    handleTextChange('certifications.items', cert.id, newValue);
                                  }
                                }}>
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteItem('certifications.items', cert.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </EditControls>
                            </EditableText>
                          ))}
                        </Box>
                      </Section>
                    </Grid>
                  )}
                </Grid>

                {cvData.projects.length > 0 && (
                  <Section>
                    <SectionTitle variant="h5" color="primary">
                      Projects
                    </SectionTitle>
                    {cvData.projects.map((project) => (
                      <Box key={project.id} mb={2} sx={{ position: 'relative' }}>
                        <EditControls className="edit-controls" sx={{ top: -8, right: -8 }}>
                          <IconButton size="small" onClick={() => handleDeleteItem('projects', project.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </EditControls>

                        <EditableText>
                          <Typography fontWeight={600}>{project.title}</Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit project title", project.title);
                              if (newValue !== null) {
                                handleObjectFieldChange('projects', project.id, 'title', newValue);
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableText>

                        <EditableText>
                          <Typography variant="body2">{project.description}</Typography>
                          <EditControls className="edit-controls">
                            <IconButton size="small" onClick={() => {
                              const newValue = prompt("Edit project description", project.description);
                              if (newValue !== null) {
                                handleObjectFieldChange('projects', project.id, 'description', newValue);
                              }
                            }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </EditControls>
                        </EditableText>
                      </Box>
                    ))}
                  </Section>
                )}
              </Grid>
            </Grid>
          </CVContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}