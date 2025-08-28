import React, { useState, useRef, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Grid,
  Button,
  Container,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  LinkedIn,
  GitHub,
  Twitter,
  Print,
  PictureAsPdf,
  Palette,
  Email,
  Phone,
  LocationOn,
  Language,
  Edit,
  Delete,
  Add,
  Close,
  Save,
  Image as ImageIcon,
  MoreVert,
} from "@mui/icons-material";
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Professional themes
const themes = [
  { name: "Deep Teal", color: "#00695c", font: "Roboto, sans-serif" },
  { name: "Burgundy", color: "#6a1b9a", font: "Poppins, sans-serif" },
  { name: "Navy Blue", color: "#0d47a1", font: "Lato, sans-serif" },
];

// Available section types
const SECTION_TYPES = [
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "languages",
  "achievements",
  "custom"
];

const Card = styled(Box)`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  page-break-inside: avoid;

  &:hover .section-edit-icons {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionEditIcons = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
`;

const EditIcons = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
`;

const EditableText = styled(Box)`
  position: relative;
  padding-right: 24px;
  page-break-inside: avoid;
  
  &:hover .edit-icons {
    opacity: 1;
  }
`;

const EditableListItem = styled(Box)`
  position: relative;
  padding-right: 24px;
  display: flex;
  align-items: flex-start;
  page-break-inside: avoid;
  
  &:hover .edit-icons {
    opacity: 1;
  }
`;

const ProfessionalBackground = styled(Box)`
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media print {
    background: white !important;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const SectionHeader = styled(Typography)`
  border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
  position: relative;
  page-break-inside: avoid;
  
  @media print {
    border-color: ${({ theme }) => theme.palette.primary.dark} !important;
  }
`;

const NonPrintable = styled.div`
  @media print {
    display: none;
  }
`;

const PrintableContainer = styled(Container)`
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 20px auto;
  
  @media print {
    box-shadow: none;
    width: 100%;
    min-height: 100%;
    padding: 0;
    margin: 0;
    page-break-after: avoid;
    page-break-before: avoid;
  }
`;

const PrintableChip = styled(Chip)`
  @media print {
    border: 1px solid #ddd;
    background: transparent !important;
    color: #333 !important;
  }
`;

const SkillBar = styled(LinearProgress)`
  height: 8px !important;
  border-radius: 4px !important;
  margin-top: 4px;
`;

const AvatarContainer = styled(Box)`
  position: relative;
  display: inline-block;
  page-break-inside: avoid;
  
  &:hover .edit-icons {
    opacity: 1;
  }
`;

const LineEditIcons = styled(Box)`
  position: absolute;
  right: -24px;
  top: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
`;

export default function ProfessionalCV() {
  const [themeIndex, setThemeIndex] = useState(0);
  const cvRef = useRef();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionType, setNewSectionType] = useState("experience");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const fileInputRef = useRef();

  // Initial CV data state with sections array
  const [cvData, setCvData] = useState({
    name: "Aarav Sharma",
    title: "Senior Frontend Developer",
    contact: {
      phone: "+91 9876543210",
      email: "aarav.sharma@email.com",
      location: "Bangalore, India",
      website: "aarav-dev.com"
    },
    summary: "Experienced Frontend Developer with 5+ years specializing in React ecosystem and modern JavaScript. Proven expertise in building scalable web applications with focus on performance, accessibility, and user experience. Strong advocate for clean code practices and test-driven development.",
    avatar: "https://via.placeholder.com/150",
    sections: [
      {
        id: "experience",
        title: "Work Experience",
        type: "experience",
        data: [
          {
            id: 1,
            position: "Senior Frontend Developer",
            company: "Tech Innovations Inc.",
            period: "Jan 2022 - Present",
            location: "Bangalore, India",
            responsibilities: [
              "Led migration of legacy codebase to modern React/TypeScript architecture",
              "Implemented design system used by 15+ products across organization",
              "Mentored junior developers through code reviews and technical workshops",
              "Reduced CI/CD pipeline execution time by 35% through optimization"
            ]
          },
          {
            id: 2,
            position: "Frontend Developer",
            company: "Digital Solutions Ltd.",
            period: "Mar 2020 - Dec 2021",
            location: "Mumbai, India",
            responsibilities: [
              "Developed responsive UIs for enterprise SaaS applications",
              "Implemented comprehensive test suite increasing coverage to 85%",
              "Optimized core application workflows improving user engagement by 22%",
              "Collaborated with UX team to implement design system components"
            ]
          }
        ]
      },
      {
        id: "projects",
        title: "Key Projects",
        type: "projects",
        data: [
          {
            id: 1,
            name: "Financial Analytics Dashboard",
            technologies: "React, Redux, D3.js, Highcharts",
            details: [
              "Created real-time data visualization platform for financial data",
              "Developed reusable chart components library",
              "Optimized data processing reducing load time by 60%"
            ]
          },
          {
            id: 2,
            name: "E-commerce Platform",
            technologies: "Next.js, Node.js, Stripe API",
            details: [
              "Built full-featured e-commerce solution handling 50k+ monthly users",
              "Integrated payment processing and inventory management",
              "Implemented server-side rendering improving SEO ranking"
            ]
          }
        ]
      },
      {
        id: "skills",
        title: "Technical Skills",
        type: "skills",
        data: [
          { id: 1, name: "React", value: 95 },
          { id: 2, name: "TypeScript", value: 90 },
          { id: 3, name: "JavaScript", value: 95 },
          { id: 4, name: "Node.js", value: 85 },
          { id: 5, name: "CSS/SCSS", value: 90 },
          { id: 6, name: "Redux", value: 90 },
        ]
      },
      {
        id: "education",
        title: "Education",
        type: "education",
        data: {
          degree: "B.Tech Computer Science",
          institution: "Indian Institute of Technology, Delhi",
          period: "2016 - 2020",
          grade: "CGPA: 8.9/10"
        }
      },
      {
        id: "certifications",
        title: "Certifications",
        type: "certifications",
        data: [
          "AWS Certified Developer (2023)",
          "Google Professional UX Design (2022)",
          "React Advanced Concepts (2021)"
        ]
      },
      {
        id: "languages",
        title: "Languages",
        type: "languages",
        data: ["English (Fluent)", "Hindi (Native)", "French (Intermediate)"]
      },
      {
        id: "achievements",
        title: "Professional Achievements",
        type: "achievements",
        data: [
          "Published author of 'Modern React Patterns' (2023)",
          "Speaker at React India Conference (2022)",
          "Winner of National Hackathon (2021)",
          "Open Source Contributor (50+ merged PRs)"
        ]
      }
    ]
  });

  const theme = createTheme({
    palette: {
      primary: { main: themes[themeIndex].color },
    },
    typography: {
      fontFamily: themes[themeIndex].font,
      allVariants: {
        color: "#333",
      },
    },
  });

  const nextTheme = () =>
    setThemeIndex((prev) => (prev + 1) % themes.length);

  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: "Professional_CV",
    pageStyle: `
      @page { 
        size: A4; 
        margin: 1cm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
          background: white !important;
        }
        .MuiAvatar-root {
          border-color: ${themes[themeIndex].color} !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    const input = cvRef.current;

    // Store original styles
    const originalWidth = input.style.width;
    const originalHeight = input.style.height;
    const originalOverflow = input.style.overflow;

    // Set dimensions for PDF
    input.style.width = '210mm';
    input.style.height = 'auto';
    input.style.overflow = 'visible';

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add print styles to document head
      const printStyles = `
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .MuiAvatar-root {
            border-color: ${themes[themeIndex].color} !important;
          }
        }
      `;

      const style = document.createElement('style');
      style.innerHTML = printStyles;
      document.head.appendChild(style);

      // Capture the entire content
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowHeight: input.scrollHeight,
        height: input.scrollHeight,
        width: input.scrollWidth,
      });

      // Remove temporary styles
      document.head.removeChild(style);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calculate number of pages needed
      const numPages = Math.ceil(imgHeight / pageHeight);

      // Add each page
      for (let i = 0; i < numPages; i++) {
        if (i > 0) pdf.addPage();

        const position = -i * pageHeight;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      }

      pdf.save("Professional_CV.pdf");
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Restore original styles
      input.style.width = originalWidth;
      input.style.height = originalHeight;
      input.style.overflow = originalOverflow;
    }
  };

  const openEditDialog = (field, value, path = null, index = null) => {
    setCurrentEdit({
      field,
      value: Array.isArray(value) ? value.join('\n') : value,
      path,
      index
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setCurrentEdit({
      ...currentEdit,
      value: e.target.value
    });
  };

  const saveEdit = () => {
    const { field, value, path, index } = currentEdit;

    setCvData(prev => {
      const newData = { ...prev };

      if (path) {
        if (index !== null) {
          // Handle array items
          const newArray = [...newData[path]];
          if (field === 'responsibilities' || field === 'details') {
            // Split by new lines for list items
            newArray[index][field] = value.split('\n');
          } else if (Array.isArray(newArray[index])) {
            // Handle simple arrays (certifications, languages, etc.)
            newArray[index] = value;
          } else {
            newArray[index][field] = value;
          }
          newData[path] = newArray;
        } else {
          // Handle nested objects
          newData[path][field] = value;
        }
      } else {
        // Handle top level fields
        newData[field] = value;
      }

      return newData;
    });

    setEditDialogOpen(false);
  };

  const deleteItem = (path, index) => {
    setCvData(prev => {
      const newData = { ...prev };
      newData[path] = prev[path].filter((_, i) => i !== index);
      return newData;
    });
  };

  const addItem = (path, template) => {
    setCvData(prev => {
      const newData = { ...prev };
      newData[path] = [...prev[path], { ...template }];
      return newData;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  // SECTION MANAGEMENT FUNCTIONS
  const deleteSection = (sectionId) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const editSectionTitle = (sectionId, newTitle) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    }));
  };

  const openSectionDialog = (section = null) => {
    setCurrentSection(section);
    if (section) {
      setNewSectionTitle(section.title);
      setNewSectionType(section.type);
    } else {
      setNewSectionTitle("");
      setNewSectionType("experience");
    }
    setSectionDialogOpen(true);
  };

  const saveSection = () => {
    if (currentSection) {
      // Edit existing section
      editSectionTitle(currentSection.id, newSectionTitle);
    } else {
      // Add new section
      const newSection = {
        id: `section-${Date.now()}`,
        title: newSectionTitle,
        type: newSectionType,
        data: getDefaultDataForSectionType(newSectionType)
      };

      setCvData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
    }
    setSectionDialogOpen(false);
  };

  const getDefaultDataForSectionType = (type) => {
    switch (type) {
      case "experience":
        return [{
          id: Date.now(),
          position: "",
          company: "",
          period: "",
          location: "",
          responsibilities: [""]
        }];
      case "projects":
        return [{
          id: Date.now(),
          name: "",
          technologies: "",
          details: [""]
        }];
      case "skills":
        return [{ id: Date.now(), name: "", value: 50 }];
      case "education":
        return {
          degree: "",
          institution: "",
          period: "",
          grade: ""
        };
      case "certifications":
        return ["New Certification"];
      case "languages":
        return ["New Language"];
      case "achievements":
        return ["New Achievement"];
      case "custom":
      default:
        return ["Custom content"];
    }
  };

  const moveSection = (sectionId, direction) => {
    setCvData(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);

      if ((direction === 'up' && index > 0) ||
        (direction === 'down' && index < sections.length - 1)) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      }

      return { ...prev, sections };
    });
  };

  // Render a section based on its type
  const renderSection = (section) => {
    switch (section.type) {
      case "experience":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            {section.data.map((exp, expIndex) => (
              <Box key={exp.id} mb={3} position="relative">
                <EditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Experience">
                    <IconButton size="small" onClick={() => openEditDialog('position', exp.position, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Experience">
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== expIndex);
                        return { ...prev, sections: newSections };
                      });
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </EditIcons>

                <EditableText>
                  <Typography variant="h6" fontWeight="600">
                    {exp.position} | {exp.company}
                  </Typography>
                  <LineEditIcons className="edit-icons no-print">
                    <Tooltip title="Edit Position">
                      <IconButton size="small" onClick={() => openEditDialog('position', exp.position, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </LineEditIcons>
                </EditableText>

                <EditableText>
                  <Typography variant="body2" fontStyle="italic">
                    {exp.period} | {exp.location}
                  </Typography>
                </EditableText>

                <Typography mt={1} component="div">
                  <ul style={{ marginTop: 0, paddingLeft: "20px" }}>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <EditableListItem key={respIndex}>
                        <li>{resp}</li>
                        <LineEditIcons className="edit-icons no-print">
                          <Tooltip title="Edit Responsibility">
                            <IconButton size="small" onClick={() => openEditDialog('responsibilities', exp.responsibilities, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Responsibility">
                            <IconButton size="small" onClick={() => {
                              const newResponsibilities = [...exp.responsibilities];
                              newResponsibilities.splice(respIndex, 1);
                              setCvData(prev => {
                                const newSections = [...prev.sections];
                                const sectionIndex = newSections.findIndex(s => s.id === section.id);
                                newSections[sectionIndex].data[expIndex].responsibilities = newResponsibilities;
                                return { ...prev, sections: newSections };
                              });
                            }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </LineEditIcons>
                      </EditableListItem>
                    ))}
                  </ul>
                </Typography>
                <Box className="no-print" mt={1}>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      const newResponsibilities = [...exp.responsibilities, "New responsibility"];
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data[expIndex].responsibilities = newResponsibilities;
                        return { ...prev, sections: newSections };
                      });
                    }}
                  >
                    Add Responsibility
                  </Button>
                </Box>
              </Box>
            ))}

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  const newExperience = {
                    id: Date.now(),
                    position: "",
                    company: "",
                    period: "",
                    location: "",
                    responsibilities: [""]
                  };
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, newExperience];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Experience
              </Button>
            </Box>
          </Card>
        );

      case "projects":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            {section.data.map((project, projIndex) => (
              <Box key={project.id} mb={2} position="relative">
                <EditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Project">
                    <IconButton size="small" onClick={() => openEditDialog('name', project.name, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Project">
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== projIndex);
                        return { ...prev, sections: newSections };
                      });
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </EditIcons>

                <EditableText>
                  <Typography variant="h6" fontWeight="600">
                    {project.name}
                  </Typography>
                </EditableText>

                <EditableText>
                  <Typography variant="body2" fontStyle="italic">
                    {project.technologies}
                  </Typography>
                </EditableText>

                <Typography mt={1} component="div">
                  <ul style={{ marginTop: 0, paddingLeft: "20px" }}>
                    {project.details.map((detail, detailIndex) => (
                      <EditableListItem key={detailIndex}>
                        <li>{detail}</li>
                        <LineEditIcons className="edit-icons no-print">
                          <Tooltip title="Edit Project Detail">
                            <IconButton size="small" onClick={() => openEditDialog('details', project.details, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Project Detail">
                            <IconButton size="small" onClick={() => {
                              const newDetails = [...project.details];
                              newDetails.splice(detailIndex, 1);
                              setCvData(prev => {
                                const newSections = [...prev.sections];
                                const sectionIndex = newSections.findIndex(s => s.id === section.id);
                                newSections[sectionIndex].data[projIndex].details = newDetails;
                                return { ...prev, sections: newSections };
                              });
                            }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </LineEditIcons>
                      </EditableListItem>
                    ))}
                  </ul>
                </Typography>
                <Box className="no-print" mt={1}>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      const newDetails = [...project.details, "New project detail"];
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data[projIndex].details = newDetails;
                        return { ...prev, sections: newSections };
                      });
                    }}
                  >
                    Add Project Detail
                  </Button>
                </Box>
              </Box>
            ))}

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  const newProject = {
                    id: Date.now(),
                    name: "",
                    technologies: "",
                    details: [""]
                  };
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, newProject];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Project
              </Button>
            </Box>
          </Card>
        );

      case "skills":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            {section.data.map((skill, skillIndex) => (
              <Box key={skill.id} mb={2} position="relative">
                <EditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Skill">
                    <IconButton size="small" onClick={() => openEditDialog('name', skill.name, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Skill">
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== skillIndex);
                        return { ...prev, sections: newSections };
                      });
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </EditIcons>

                <EditableText>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{skill.name}</Typography>
                    <Typography variant="body2">{skill.value}%</Typography>
                  </Box>
                  <LineEditIcons className="edit-icons no-print">
                    <Tooltip title="Edit Skill Value">
                      <IconButton size="small" onClick={() => {
                        const newValue = prompt("Enter new skill value (0-100):", skill.value);
                        if (newValue !== null && !isNaN(newValue)) {
                          const numValue = Math.min(100, Math.max(0, parseInt(newValue)));
                          setCvData(prev => {
                            const newSections = [...prev.sections];
                            const sectionIndex = newSections.findIndex(s => s.id === section.id);
                            newSections[sectionIndex].data[skillIndex].value = numValue;
                            return { ...prev, sections: newSections };
                          });
                        }
                      }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </LineEditIcons>
                </EditableText>
                <SkillBar
                  variant="determinate"
                  value={skill.value}
                  color="primary"
                />
              </Box>
            ))}

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  const newSkill = {
                    id: Date.now(),
                    name: "",
                    value: 50
                  };
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, newSkill];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Skill
              </Button>
            </Box>
          </Card>
        );

      case "education":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            <EditableText>
              <Typography variant="h6" fontWeight="600">
                {section.data.degree}
              </Typography>
              <LineEditIcons className="edit-icons no-print">
                <Tooltip title="Edit Degree">
                  <IconButton size="small" onClick={() => openEditDialog('degree', section.data.degree, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </LineEditIcons>
            </EditableText>

            <EditableText>
              <Typography>
                {section.data.institution}
              </Typography>
              <LineEditIcons className="edit-icons no-print">
                <Tooltip title="Edit Institution">
                  <IconButton size="small" onClick={() => openEditDialog('institution', section.data.institution, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </LineEditIcons>
            </EditableText>

            <EditableText>
              <Typography variant="body2" fontStyle="italic">
                {section.data.period} | {section.data.grade}
              </Typography>
              <LineEditIcons className="edit-icons no-print">
                <Tooltip title="Edit Period">
                  <IconButton size="small" onClick={() => openEditDialog('period', section.data.period, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </LineEditIcons>
            </EditableText>
          </Card>
        );

      case "certifications":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            {section.data.map((cert, certIndex) => (
              <EditableText key={certIndex}>
                <Typography>
                  <strong>{cert}</strong>
                </Typography>
                <LineEditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Certification">
                    <IconButton size="small" onClick={() => openEditDialog(certIndex, cert, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Certification">
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => {
                        const newSections = [...prev.sections];
                        const sectionIndex = newSections.findIndex(s => s.id === section.id);
                        newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== certIndex);
                        return { ...prev, sections: newSections };
                      });
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </LineEditIcons>
              </EditableText>
            ))}

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, "New Certification"];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Certification
              </Button>
            </Box>
          </Card>
        );

      case "languages":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {section.data.map((lang, langIndex) => (
                <Box key={langIndex} position="relative">
                  <PrintableChip
                    label={lang}
                    color="primary"
                  />
                  <LineEditIcons className="edit-icons no-print" style={{ right: -30, top: 0 }}>
                    <Tooltip title="Edit Language">
                      <IconButton size="small" onClick={() => openEditDialog(langIndex, lang, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Language">
                      <IconButton size="small" onClick={() => {
                        setCvData(prev => {
                          const newSections = [...prev.sections];
                          const sectionIndex = newSections.findIndex(s => s.id === section.id);
                          newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== langIndex);
                          return { ...prev, sections: newSections };
                        });
                      }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </LineEditIcons>
                </Box>
              ))}
            </Box>

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, "New Language"];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Language
              </Button>
            </Box>
          </Card>
        );

      case "achievements":
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {section.data.filter((_, i) => i % 2 === 0).map((ach, achIndex) => (
                  <EditableText key={achIndex * 2}>
                    <Typography>• {ach}</Typography>
                    <LineEditIcons className="edit-icons no-print">
                      <Tooltip title="Edit Achievement">
                        <IconButton size="small" onClick={() => openEditDialog(achIndex * 2, ach, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Achievement">
                        <IconButton size="small" onClick={() => {
                          setCvData(prev => {
                            const newSections = [...prev.sections];
                            const sectionIndex = newSections.findIndex(s => s.id === section.id);
                            newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== (achIndex * 2));
                            return { ...prev, sections: newSections };
                          });
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </LineEditIcons>
                  </EditableText>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                {section.data.filter((_, i) => i % 2 !== 0).map((ach, achIndex) => (
                  <EditableText key={achIndex * 2 + 1}>
                    <Typography>• {ach}</Typography>
                    <LineEditIcons className="edit-icons no-print">
                      <Tooltip title="Edit Achievement">
                        <IconButton size="small" onClick={() => openEditDialog(achIndex * 2 + 1, ach, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Achievement">
                        <IconButton size="small" onClick={() => {
                          setCvData(prev => {
                            const newSections = [...prev.sections];
                            const sectionIndex = newSections.findIndex(s => s.id === section.id);
                            newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== (achIndex * 2 + 1));
                            return { ...prev, sections: newSections };
                          });
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </LineEditIcons>
                  </EditableText>
                ))}
              </Grid>
            </Grid>

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    newSections[sectionIndex].data = [...newSections[sectionIndex].data, "New Achievement"];
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Achievement
              </Button>
            </Box>
          </Card>
        );

      default:
        return (
          <Card key={section.id}>
            <SectionEditIcons className="section-edit-icons no-print">
              <Tooltip title="Move Up">
                <IconButton size="small" onClick={() => moveSection(section.id, 'up')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↩️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton size="small" onClick={() => moveSection(section.id, 'down')}>
                  <span style={{ transform: 'rotate(90deg)' }}>↪️</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={() => openSectionDialog(section)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Section">
                <IconButton size="small" onClick={() => deleteSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </SectionEditIcons>

            <SectionHeader variant="h5">
              {section.title}
            </SectionHeader>

            {Array.isArray(section.data) ? (
              section.data.map((item, index) => (
                <EditableText key={index}>
                  <Typography>{item}</Typography>
                  <LineEditIcons className="edit-icons no-print">
                    <Tooltip title="Edit Content">
                      <IconButton size="small" onClick={() => openEditDialog(index, item, 'sections', cvData.sections.findIndex(s => s.id === section.id))}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Content">
                      <IconButton size="small" onClick={() => {
                        setCvData(prev => {
                          const newSections = [...prev.sections];
                          const sectionIndex = newSections.findIndex(s => s.id === section.id);
                          newSections[sectionIndex].data = newSections[sectionIndex].data.filter((_, i) => i !== index);
                          return { ...prev, sections: newSections };
                        });
                      }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </LineEditIcons>
                </EditableText>
              ))
            ) : (
              <EditableText>
                <Typography>{JSON.stringify(section.data)}</Typography>
              </EditableText>
            )}

            <Box className="no-print" mt={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  setCvData(prev => {
                    const newSections = [...prev.sections];
                    const sectionIndex = newSections.findIndex(s => s.id === section.id);
                    if (Array.isArray(newSections[sectionIndex].data)) {
                      newSections[sectionIndex].data = [...newSections[sectionIndex].data, "New Content"];
                    }
                    return { ...prev, sections: newSections };
                  });
                }}
              >
                Add Content
              </Button>
            </Box>
          </Card>
        );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <ProfessionalBackground>
          <NonPrintable>
            <Box display="flex" justifyContent="flex-end" gap={1} mb={2}
              flexDirection={{ xs: "column", sm: "row" }}>
              <Button
                onClick={nextTheme}
                variant="outlined"
                color="primary"
                startIcon={<Palette />}
                sx={{ mb: { xs: 1, sm: 0 } }}
                className="no-print"
              >
                Change Theme
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdf />}
                sx={{ mb: { xs: 1, sm: 0 } }}
                className="no-print"
              >
                Download PDF
              </Button>
              <Button
                onClick={handlePrint}
                variant="contained"
                color="primary"
                startIcon={<Print />}
                className="no-print"
              >
                Print CV
              </Button>
              <Button
                onClick={() => openSectionDialog()}
                variant="contained"
                color="primary"
                startIcon={<Add />}
                className="no-print"
              >
                Add Section
              </Button>
            </Box>
          </NonPrintable>

          <PrintableContainer maxWidth="md" ref={cvRef}>
            {/* Header Section */}
            <Card>
              <EditIcons className="edit-icons no-print">
                <Tooltip title="Edit Name">
                  <IconButton size="small" onClick={() => openEditDialog('name', cvData.name)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </EditIcons>

              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <EditableText>
                    <Typography variant="h3" fontWeight="bold" color="primary"
                      sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                      {cvData.name}
                    </Typography>
                    <LineEditIcons className="edit-icons no-print">
                      <Tooltip title="Edit Name">
                        <IconButton size="small" onClick={() => openEditDialog('name', cvData.name)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </LineEditIcons>
                  </EditableText>

                  <EditableText>
                    <Typography variant="h5" mt={1} fontWeight="500">
                      {cvData.title}
                    </Typography>
                    <LineEditIcons className="edit-icons no-print">
                      <Tooltip title="Edit Title">
                        <IconButton size="small" onClick={() => openEditDialog('title', cvData.title)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </LineEditIcons>
                  </EditableText>

                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} sm={6}>
                      <EditableText>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Phone fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{cvData.contact.phone}</Typography>
                          <LineEditIcons className="edit-icons no-print">
                            <Tooltip title="Edit Phone">
                              <IconButton size="small" onClick={() => openEditDialog('phone', cvData.contact.phone, 'contact')}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Phone">
                              <IconButton size="small" onClick={() => {
                                setCvData(prev => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    phone: ""
                                  }
                                }));
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </LineEditIcons>
                        </Box>
                      </EditableText>

                      <EditableText>
                        <Box display="flex" alignItems="center">
                          <Email fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{cvData.contact.email}</Typography>
                          <LineEditIcons className="edit-icons no-print">
                            <Tooltip title="Edit Email">
                              <IconButton size="small" onClick={() => openEditDialog('email', cvData.contact.email, 'contact')}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Email">
                              <IconButton size="small" onClick={() => {
                                setCvData(prev => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    email: ""
                                  }
                                }));
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </LineEditIcons>
                        </Box>
                      </EditableText>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <EditableText>
                        <Box display="flex" alignItems="center" mb={1}>
                          <LocationOn fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{cvData.contact.location}</Typography>
                          <LineEditIcons className="edit-icons no-print">
                            <Tooltip title="Edit Location">
                              <IconButton size="small" onClick={() => openEditDialog('location', cvData.contact.location, 'contact')}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Location">
                              <IconButton size="small" onClick={() => {
                                setCvData(prev => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    location: ""
                                  }
                                }));
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </LineEditIcons>
                        </Box>
                      </EditableText>

                      <EditableText>
                        <Box display="flex" alignItems="center">
                          <Language fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{cvData.contact.website}</Typography>
                          <LineEditIcons className="edit-icons no-print">
                            <Tooltip title="Edit Website">
                              <IconButton size="small" onClick={() => openEditDialog('website', cvData.contact.website, 'contact')}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Website">
                              <IconButton size="small" onClick={() => {
                                setCvData(prev => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    website: ""
                                  }
                                }));
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </LineEditIcons>
                        </Box>
                      </EditableText>
                    </Grid>
                  </Grid>

                  <Box mt={2} display="flex" justifyContent={{ xs: "center", md: "flex-start" }}>
                    <IconButton color="primary" className="no-print">
                      <LinkedIn />
                    </IconButton>
                    <IconButton color="primary" className="no-print">
                      <GitHub />
                    </IconButton>
                    <IconButton color="primary" className="no-print">
                      <Twitter />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} display="flex" justifyContent="center">
                  <AvatarContainer>
                    <Avatar
                      src={cvData.avatar}
                      sx={{
                        width: 150,
                        height: 150,
                        border: `3px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <EditIcons className="edit-icons no-print">
                      <Tooltip title="Change Photo">
                        <IconButton size="small" onClick={triggerImageUpload}>
                          <ImageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Photo">
                        <IconButton size="small" onClick={() => {
                          setCvData(prev => ({
                            ...prev,
                            avatar: ""
                          }));
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </EditIcons>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </AvatarContainer>
                </Grid>
              </Grid>
            </Card>

            {/* Summary */}
            <Card>
              <SectionHeader variant="h5">
                Professional Summary
                <EditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Summary">
                    <IconButton size="small" onClick={() => openEditDialog('summary', cvData.summary)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Summary">
                    <IconButton size="small" onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        summary: ""
                      }));
                    }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </EditIcons>
              </SectionHeader>
              <EditableText>
                <Typography>
                  {cvData.summary}
                </Typography>
                <LineEditIcons className="edit-icons no-print">
                  <Tooltip title="Edit Summary">
                    <IconButton size="small" onClick={() => openEditDialog('summary', cvData.summary)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </LineEditIcons>
              </EditableText>
            </Card>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={8}>
                {cvData.sections
                  .filter(section => ['experience', 'projects'].includes(section.type))
                  .map(renderSection)}
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                {cvData.sections
                  .filter(section => ['skills', 'education', 'certifications', 'languages'].includes(section.type))
                  .map(renderSection)}
              </Grid>
            </Grid>

            {/* Full Width Sections */}
            {cvData.sections
              .filter(section => ['achievements', 'custom'].includes(section.type))
              .map(renderSection)}
          </PrintableContainer>
        </ProfessionalBackground>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={currentEdit.value || ''}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} startIcon={<Close />}>
              Cancel
            </Button>
            <Button onClick={saveEdit} color="primary" startIcon={<Save />}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Section Dialog */}
        <Dialog open={sectionDialogOpen} onClose={() => setSectionDialogOpen(false)}>
          <DialogTitle>{currentSection ? "Edit Section" : "Add New Section"}</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Section Type</InputLabel>
                <Select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value)}
                  label="Section Type"
                  disabled={!!currentSection}
                >
                  {SECTION_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              autoFocus
              margin="dense"
              fullWidth
              variant="outlined"
              label="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSectionDialogOpen(false)} startIcon={<Close />}>
              Cancel
            </Button>
            <Button onClick={saveSection} color="primary" startIcon={<Save />}>
              {currentSection ? "Update" : "Add Section"}
            </Button>
          </DialogActions>
        </Dialog>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}