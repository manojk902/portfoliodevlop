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
  Divider,
  Button,
  Container
} from "@mui/material";
import {
  LinkedIn,
  GitHub,
  LightMode,
  DarkMode,
  Print,
  Download
} from "@mui/icons-material";
import styled from "@emotion/styled";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const themes = [
  {
    name: "Black-White",
    bg: "#FFFFFF",
    text: "#000000",
    accent: "#000000",
    headerFont: "Playfair Display, serif",
    bodyFont: "Lora, serif",
  },
  {
    name: "Off-White Pink",
    bg: "#FDF2F8",
    text: "#111827",
    accent: "#DB2777",
    headerFont: "Playfair Display, serif",
    bodyFont: "Lora, serif",
  },
  {
    name: "Gray-Charcoal",
    bg: "#F3F4F6",
    text: "#111827",
    accent: "#374151",
    headerFont: "Playfair Display, serif",
    bodyFont: "Lora, serif",
  },
  {
    name: "Soft Beige",
    bg: "#F5F5DC",
    text: "#111827",
    accent: "#C0A060",
    headerFont: "Playfair Display, serif",
    bodyFont: "Lora, serif",
  },
];

const CVContainer = styled(Box)`
  width: 210mm;
  min-height: 297mm;
  margin: auto;
  padding: 20mm;
  background: ${({ theme }) => theme.palette.background.default};
  box-sizing: border-box;
  position: relative;

  @media print {
    box-shadow: none;
    padding: 20mm !important;
    width: 210mm !important;
    margin: 0 !important;
    min-height: auto;
  }
`;

const BorderBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.palette.primary.main}30;
  border-radius: 0px;
  padding: 1.5rem;
  margin: 1rem 0;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main}80;
    background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(0,0,0,0.02)'
      : 'rgba(255,255,255,0.02)'};
  }

  @media print {
    border: 1px solid #00000020;
    padding: 1rem !important;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 700 !important;
  margin-bottom: 1rem !important;
  position: relative;
  display: inline-block;
  padding-bottom: 4px;
  border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
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
  border-left: 2px solid ${({ theme }) => theme.palette.primary.main};
  
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
`;

export default function EditorialMagazineCV() {
  const [themeIndex, setThemeIndex] = useState(0);
  const active = themes[themeIndex];
  const cvRef = useRef();

  const theme = createTheme({
    palette: {
      mode: "light",
      background: { default: active.bg, paper: active.bg },
      text: { primary: active.text },
      primary: { main: active.accent },
    },
    typography: {
      fontFamily: active.bodyFont,
      h3: {
        fontFamily: active.headerFont,
        fontWeight: 700,
        letterSpacing: 0.5,
      },
      h5: {
        fontFamily: active.headerFont,
        fontWeight: 600,
        letterSpacing: 0.5,
      },
      body1: {
        lineHeight: 1.6,
      },
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            marginRight: 1,
            marginBottom: 1,
            borderRadius: 4,
          }
        }
      }
    }
  });

  const nextTheme = () => setThemeIndex((prev) => (prev + 1) % themes.length);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!cvRef.current) return;

    const element = cvRef.current;
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;

    try {
      // Set fixed dimensions for capture
      element.style.width = '210mm';
      element.style.height = 'auto';

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('neha-bhatt-cv.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Restore original dimensions
      element.style.width = originalWidth;
      element.style.height = originalHeight;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ '@media print': { padding: 0 } }}>
        <PrintHide display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={nextTheme} color="primary" sx={{ mr: 1 }}>
            {themeIndex % 2 === 0 ? <DarkMode /> : <LightMode />}
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
            startIcon={<Download />}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </PrintHide>

        <CVContainer ref={cvRef}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h3">Neha Bhatt</Typography>
            <Typography variant="h6" color="textSecondary">
              Senior Editorial Designer
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center" mb={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" sx={{ maxWidth: "80%", fontStyle: 'italic' }}>
                "Bringing editorial elegance to digital design. Detail obsessed, story driven."
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Avatar
                src="https://via.placeholder.com/200"
                sx={{
                  width: 180,
                  height: 180,
                  border: `3px solid ${active.accent}`
                }}
              />
            </Grid>
          </Grid>

          {/* Contact */}
          <BorderBox>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>Phone: +91 9876001234</Typography>
                <Typography>Email: neha.bhatt@email.com</Typography>
                <Typography>Kolkata, WB, India</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <IconButton color="primary"><LinkedIn /></IconButton>
                <IconButton color="primary"><GitHub /></IconButton>
              </Grid>
            </Grid>
          </BorderBox>

          {/* 2-Column Layout */}
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={4}>
              <BorderBox>
                <SectionTitle variant="h5">Skills</SectionTitle>
                <Grid container spacing={1}>
                  {[
                    "Editorial Design", "UX Writing", "Figma", "Adobe Suite",
                    "Content Strategy", "Typography", "Layout Design",
                    "Brand Identity", "Art Direction", "Visual Storytelling"
                  ].map(skill => (
                    <Grid item xs={12} key={skill}>
                      <Typography>— {skill}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </BorderBox>

              <BorderBox>
                <SectionTitle variant="h5">Languages</SectionTitle>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  <Chip label="English (Fluent)" color="primary" />
                  <Chip label="Bengali (Native)" color="primary" />
                  <Chip label="Hindi (Fluent)" color="primary" />
                </Box>
              </BorderBox>

              <BorderBox>
                <SectionTitle variant="h5">Interests</SectionTitle>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  <Chip label="📷 Photography" color="primary" />
                  <Chip label="📝 Fashion Blogging" color="primary" />
                  <Chip label="✍️ Creative Writing" color="primary" />
                  <Chip label="🎨 Art Exhibitions" color="primary" />
                </Box>
              </BorderBox>

              <BorderBox>
                <SectionTitle variant="h5">Awards</SectionTitle>
                <Box mt={1}>
                  <Typography fontWeight={500}>🏆 Editorial Designer of the Year</Typography>
                  <Typography variant="body2" color="textSecondary">Design Excellence Awards, 2023</Typography>

                  <Typography fontWeight={500} mt={2}>🏅 Best Digital Publication</Typography>
                  <Typography variant="body2" color="textSecondary">India Design Forum, 2022</Typography>
                </Box>
              </BorderBox>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={8}>
              <BorderBox>
                <SectionTitle variant="h5">Professional Profile</SectionTitle>
                <Typography>
                  Editorial designer with 7+ years of experience creating visually compelling narratives
                  for print and digital media. Specialized in transforming complex stories into elegant
                  visual experiences. Passionate about typography, layout composition, and brand storytelling.
                </Typography>
              </BorderBox>

              <BorderBox>
                <SectionTitle variant="h5">Experience</SectionTitle>

                <ExperienceItem>
                  <Typography variant="subtitle1" fontWeight={600}>Design Lead</Typography>
                  <Typography color="primary" fontStyle="italic">Vogue Digital | 2021–Present</Typography>
                  <Typography variant="body2" mt={1}>
                    • Led redesign of digital magazine increasing engagement by 45%<br />
                    • Developed design system for 12+ editorial products<br />
                    • Managed team of 8 designers and illustrators<br />
                    • Collaborated with editors on visual storytelling strategies
                  </Typography>
                </ExperienceItem>

                <ExperienceItem>
                  <Typography variant="subtitle1" fontWeight={600}>Senior Designer</Typography>
                  <Typography color="primary" fontStyle="italic">HarperCollins India | 2018–2021</Typography>
                  <Typography variant="body2" mt={1}>
                    • Designed 50+ book covers and interior layouts<br />
                    • Created visual identity for 3 new imprint launches<br />
                    • Developed template system reducing production time by 30%<br />
                    • Mentored junior designers in editorial best practices
                  </Typography>
                </ExperienceItem>

                <ExperienceItem>
                  <Typography variant="subtitle1" fontWeight={600}>Design Associate</Typography>
                  <Typography color="primary" fontStyle="italic">The Telegraph | 2016–2018</Typography>
                  <Typography variant="body2" mt={1}>
                    • Designed daily newspaper layouts and special sections<br />
                    • Created infographics for complex data stories<br />
                    • Won internal design competition 3 times consecutively
                  </Typography>
                </ExperienceItem>
              </BorderBox>

              <BorderBox>
                <SectionTitle variant="h5">Education</SectionTitle>
                <Box mb={2}>
                  <Typography fontWeight={600}>MA Mass Communication</Typography>
                  <Typography>Jadavpur University | 2014–2016</Typography>
                  <Typography color="textSecondary">Specialization: Visual Communication</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>BFA Graphic Design</Typography>
                  <Typography>Government College of Art & Craft | 2011–2014</Typography>
                </Box>
              </BorderBox>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <BorderBox>
                    <SectionTitle variant="h5">Projects</SectionTitle>
                    <Box mt={1}>
                      <Typography fontWeight={600}>Digital Magazine Redesign</Typography>
                      <Typography variant="body2">
                        Complete visual overhaul for premium lifestyle magazine
                      </Typography>

                      <Typography fontWeight={600} mt={2}>Storytelling Platform</Typography>
                      <Typography variant="body2">
                        Interactive digital platform for long-form journalism
                      </Typography>

                      <Typography fontWeight={600} mt={2}>Art Book Series</Typography>
                      <Typography variant="body2">
                        Limited edition book series for contemporary artists
                      </Typography>
                    </Box>
                  </BorderBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  <BorderBox>
                    <SectionTitle variant="h5">Certificates</SectionTitle>
                    <Box mt={1}>
                      <Typography>• Adobe Certified Expert</Typography>
                      <Typography>• Typography Masterclass (TypeEd)</Typography>
                      <Typography>• Editorial Design (Domestika)</Typography>
                      <Typography>• UX Writing Fundamentals</Typography>
                    </Box>
                  </BorderBox>

                  <BorderBox>
                    <SectionTitle variant="h5">Achievements</SectionTitle>
                    <Box mt={1}>
                      <Typography>• Speaker at Design India Summit 2023</Typography>
                      <Typography>• Featured in Creative Review Annual</Typography>
                      <Typography>• Judge for National Design Awards</Typography>
                    </Box>
                  </BorderBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Footer */}
          <Divider sx={{ my: 4, borderColor: "primary.main" }} />
          <Box textAlign="center">
            <Typography variant="body2">
              Page 2 of 2 — Neha Bhatt
            </Typography>
          </Box>
        </CVContainer>
      </Container>
    </ThemeProvider>
  );
}