import React, { useState, useRef } from "react";
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
  IconButton
} from "@mui/material";
import { Print, PictureAsPdf, Edit, Delete } from "@mui/icons-material";
import styled from "@emotion/styled";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

export default function ProfessionalCV() {
  const cvRef = useRef();
  const [cvData, setCvData] = useState({
    personal: {
      name: "Simran Kaur",
      title: "Content Strategist & Brand Storyteller",
      initial: "SK"
    },
    contact: {
      items: [
        { id: 1, content: "+91 9123456789" },
        { id: 2, content: "simran.kaur@email.com" },
        { id: 3, content: "Chandigarh, Punjab, India" },
        { id: 4, content: "LinkedIn: /simrankaur" },
        { id: 5, content: "Behance: /simrankaurs" },
      ]
    },
    skills: {
      items: [
        { id: 1, content: "Content Strategy" },
        { id: 2, content: "Brand Storytelling" },
        { id: 3, content: "SEO Optimization" },
        { id: 4, content: "Copywriting" },
        { id: 5, content: "Social Media Marketing" },
        { id: 6, content: "Data Analytics" }
      ]
    },
    languages: {
      items: [
        { id: 1, content: "English (Fluent)" },
        { id: 2, content: "Punjabi (Native)" },
        { id: 3, content: "Hindi (Fluent)" }
      ]
    },
    awards: {
      items: [
        {
          id: 1,
          title: "Top Marketer Award 2021",
          subtitle: "Marketing Excellence Forum"
        },
        {
          id: 2,
          title: "Best Content Campaign",
          subtitle: "Digital India Summit 2020"
        }
      ]
    },
    profile: {
      content: "Results-driven Content Strategist with 5+ years of experience crafting compelling brand narratives. Specialized in developing data-backed content ecosystems that drive engagement, enhance brand visibility, and increase conversion. Passionate about creating human-centered stories that resonate across digital platforms."
    },
    experience: [
      {
        id: 1,
        title: "Senior Content Lead",
        company: "ABC Marketing | 2020–Present",
        description: "• Revitalized brand content strategy resulting in 40% engagement increase\n• Managed 12-member content team across 4 product verticals\n• Developed award-winning \"Authentic Voices\" campaign"
      },
      {
        id: 2,
        title: "Content Specialist",
        company: "XYZ Agency | 2018–2020",
        description: "• Created SEO-optimized content for 20+ clients across industries\n• Increased average client organic traffic by 65% YOY\n• Implemented content analytics framework still in use today"
      }
    ],
    education: [
      {
        id: 1,
        degree: "MA Digital Marketing",
        institution: "MICA, Ahmedabad | 2020"
      },
      {
        id: 2,
        degree: "BA English Literature",
        institution: "Delhi University | 2018"
      }
    ],
    certifications: {
      items: [
        { id: 1, content: "• HubSpot Content Marketing" },
        { id: 2, content: "• Google Analytics Professional" },
        { id: 3, content: "• SEMrush Content Marketing" },
        { id: 4, content: "• Brand Storytelling (Berkeley)" }
      ]
    },
    projects: [
      {
        id: 1,
        title: "Heritage Brands Revival",
        description: "Content strategy for 5 traditional Indian brands transitioning to digital platforms. Developed multilingual content frameworks that increased market reach by 200%."
      },
      {
        id: 2,
        title: "Sustainable Fashion Campaign",
        description: "Led content creation for eco-fashion startup. Campaign generated 500K+ engagements and increased sales conversion by 35% through storytelling."
      }
    ],
    profileImage: null
  });

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
    documentTitle: "Simran_Kaur_CV",
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
    pdf.save('Simran_Kaur_CV.pdf');
  };

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
              </Grid>

              <Grid item xs={12} md={8}>
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

                <Grid container spacing={2}>
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
                </Grid>

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
              </Grid>
            </Grid>
          </CVContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}