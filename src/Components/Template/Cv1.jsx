/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import printJS from "print-js";

const Cv1 = ({ UserDataFromDesignPage }) => {
  // --- 1. Identify Context (URL & Redux) ---
  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");
  const [showLoading, setShowLoading] = useState(true);

  // Ref for the CV content
  const cvContentRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const userProfile = useSelector(
    (state) => state.userProfile?.data?.fetchedUsed
  );
  const userNameRedux = userProfile?.userName;

  // --- 2. State Management ---
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvData = async () => {
      setLoading(true);
      let usernameToFetch = null;
      let isDifferentUser =
        username && userNameRedux && username !== userNameRedux;

      if (
        username &&
        (isDifferentUser || cvPublicView === "true" || !userNameRedux)
      ) {
        usernameToFetch = username;
        console.log(
          `✅ Public View (URL based) Activated. Fetching: ${username}`
        );
      } else if (userNameRedux) {
        usernameToFetch = userNameRedux;
        console.log(
          `👤 Private View (Redux based) Activated. Fetching: ${userNameRedux}`
        );
      }

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

  // Print-js print function
  const handlePrint = () => {
    if (!cvContentRef.current) {
      console.error("CV content not found");
      return;
    }

    // Get the HTML content
    const printContent = cvContentRef.current.innerHTML;

    // Use print-js with raw HTML
    printJS({
      printable: printContent,
      type: "raw-html",
      documentTitle: `${cvData?.firstName || "CV"} ${cvData?.lastName || ""
        } - Resume`,
      style: `
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Arial", "Helvetica", sans-serif;
          line-height: 1.3;
          width: 210mm;
        }
        .cv1-container {
          max-width: 210mm;
          margin: 0 auto;
          color: #000000;
          background: white;
        }
        .cv1-content {
          width: 794px !important;
  min-height: 1123px !important;
  margin: 0 auto;
  background: white;
  padding: 40px;
  box-sizing: border-box;
        }
        .cv1-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #000000;
          text-align: left;
        }
        .cv1-name {
          font-size: 26px;
          font-weight: bold;
          line-height: 1.1;
          margin-bottom: 4px;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cv1-designation {
          font-size: 16px;
          color: #000000;
          margin-bottom: 15px;
          font-weight: normal;
        }
        .cv1-contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cv1-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 10px;
          line-height: 1.3;
        }
        .cv1-contact-label {
          font-weight: bold;
          min-width: 55px;
          color: #000000;
        }
        .cv1-contact-text {
          font-weight: normal;
          color: #000000;
          word-break: break-word;
        }
        .cv1-section {
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #cccccc;
        }
        .cv1-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .cv1-section-title {
          font-size: 13px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding-bottom: 4px;
          border-bottom: 1px solid #000000;
          display: inline-block;
        }
        .cv1-summary-text {
          line-height: 1.3;
          font-size: 10px;
          text-align: justify;
          color: #000000;
          margin: 0;
          hyphens: auto;
          word-break: break-word;
        }
        .cv1-skills-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .cv1-skill-item {
          font-size: 10px;
          margin-bottom: 4px;
          color: #000000;
          line-height: 1.3;
        }
        .cv1-education-item {
          margin-bottom: 12px;
        }
        .cv1-education-course {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 2px;
          color: #000000;
          line-height: 1.3;
        }
        .cv1-education-college {
          font-size: 10px;
          color: #000000;
          margin-bottom: 2px;
          line-height: 1.3;
        }
        .cv1-education-dates {
          font-size: 10px;
          color: #666666;
          font-style: italic;
          margin: 0;
          line-height: 1.3;
        }
        .cv1-experience-item {
          margin-bottom: 16px;
        }
        .cv1-experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .cv1-experience-title {
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          margin: 0;
          line-height: 1.3;
        }
        .cv1-experience-dates {
          font-size: 10px;
          color: #666666;
          font-style: italic;
          margin: 0;
          line-height: 1.3;
        }
        .cv1-experience-company {
          font-size: 10px;
          color: #000000;
          margin-bottom: 6px;
          font-weight: bold;
          line-height: 1.3;
        }
        .cv1-experience-description {
          line-height: 1.3;
          font-size: 10px;
          color: #000000;
          margin: 0;
          hyphens: auto;
          word-break: break-word;
        }
        .cv1-project-item {
          margin-bottom: 16px;
        }
        .cv1-project-name {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 4px;
          color: #000000;
          line-height: 1.3;
        }
        .cv1-project-description {
          line-height: 1.3;
          font-size: 10px;
          margin-bottom: 6px;
          color: #000000;
          hyphens: auto;
          word-break: break-word;
        }
        .cv1-technologies-container {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 0;
        }
        .cv1-tech-label {
          font-size: 10px;
          font-weight: bold;
          color: #000000;
          margin-right: 4px;
          line-height: 1.3;
        }
        .cv1-technology-tag {
          border: 1px solid #cccccc;
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 9px;
          background: #f9f9f9;
          color: #000000;
          font-weight: normal;
          line-height: 1.3;
        }
        .cv1-divider {
          border: none;
          border-top: 1px solid #cccccc;
          margin: 12px 0;
        }
        .cv1-print-button-container {
          display: none !important;
        }
        .cv1-language-item {
          font-size: 10px;
          margin-bottom: 4px;
          color: #000000;
          line-height: 1.3;
        }
        .cv1-language-level {
          font-weight: normal;
          color: #666666;
        }
      `,
      onPrintDialogClose: () => {
        console.log("Print dialog closed");
      },
      onError: (error) => {
        console.error("Print error:", error);
        // Fallback to browser print
        window.print();
      },
    });
  };

  // ============ SECTION COMPONENTS ============

  // Header Section Component
  const HeaderSection = () => (
    <div className="cv1-header">
      <div className="cv1-header-content">
        <h1 className="cv1-name">
          {cvData.firstName} {cvData.lastName}
        </h1>
        <h2 className="cv1-designation">{cvData.designation}</h2>

        <div className="cv1-contact-info">
          {/* Email */}
          <div className="cv1-contact-item">
            <span className="cv1-contact-label">Email:</span>
            <span className="cv1-contact-text">{cvData.email}</span>
          </div>

          {/* Phone */}
          <div className="cv1-contact-item">
            <span className="cv1-contact-label">Phone:</span>
            <span className="cv1-contact-text">{cvData.phoneNo}</span>
          </div>

          {/* Address */}
          <div className="cv1-contact-item">
            <span className="cv1-contact-label">Address:</span>
            <span className="cv1-contact-text">
              {cvData.address?.city}, {cvData.address?.state}
            </span>
          </div>

          {/* Social Links */}
          {cvData.socialLinks.map((link, i) => (
            <div key={i} className="cv1-contact-item">
              <span className="cv1-contact-label">Link:</span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="cv1-link-url"
              >
                {link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Summary Section Component
  const SummarySection = () => {
    const summarySection = cvData.sections?.find((s) => s.name === "Summary");
    if (!summarySection?.data) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Professional Summary</h3>
        <p className="cv1-summary-text">{summarySection.data}</p>
      </div>
    );
  };

  // Skills Section Component
  const SkillsSection = () => {
    const skillsSection = cvData.sections?.find((s) => s.name === "Skill");
    if (!skillsSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Skills</h3>
        <ul className="cv1-skills-list">
          {skillsSection.data.map((skill, i) => (
            <li key={i} className="cv1-skill-item">
              {skill.skill}{" "}
              <span className="cv1-skill-rating">({skill.rating}/5)</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Education Section Component
  const EducationSection = () => {
    const educationSection = cvData.sections?.find(
      (s) => s.name === "Education"
    );
    if (!educationSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Education</h3>
        {educationSection.data.map((edu, i) => (
          <div key={i} className="cv1-education-item">
            <h4 className="cv1-education-course">{edu.course}</h4>
            <p className="cv1-education-college">{edu.college}</p>
            <p className="cv1-education-dates">
              {edu.startDate} – {edu.endDate} | Grade: {edu.grade}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Experience Section Component
  const ExperienceSection = () => {
    const experienceSection = cvData.sections?.find(
      (s) => s.name === "Experience"
    );
    if (!experienceSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Professional Experience</h3>
        {experienceSection.data.map((exp, i) => (
          <div key={i} className="cv1-experience-item">
            <div className="cv1-experience-header">
              <h4 className="cv1-experience-title">{exp.jobTitle}</h4>
              <span className="cv1-experience-dates">
                {exp.startDate} – {exp.endDate}
              </span>
            </div>
            <p className="cv1-experience-company">
              {exp.company}, {exp.location}
            </p>
            <div className="cv1-experience-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "10px",
                  lineHeight: 1.3,
                  fontFamily: "'Arial', 'Helvetica', sans-serif",
                }}
                source={exp.description || ""}
              />
            </div>
            {i < experienceSection.data.length - 1 && (
              <hr className="cv1-divider" />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Projects Section Component
  const ProjectsSection = () => {
    const projectsSection = cvData.sections?.find((s) => s.name === "Project");
    if (!projectsSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Projects</h3>
        {projectsSection.data.map((proj, i) => (
          <div key={i} className="cv1-project-item">
            <h4 className="cv1-project-name">{proj.name}</h4>
            <div className="cv1-project-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "10px",
                  lineHeight: 1.3,
                  fontFamily: "'Arial', 'Helvetica', sans-serif",
                }}
                source={proj.description || ""}
              />
            </div>
            {proj.technologies && (
              <div className="cv1-technologies-container">
                <span className="cv1-tech-label">Technologies:</span>
                {proj.technologies.map((tech, idx) => (
                  <span key={idx} className="cv1-technology-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {i < projectsSection.data.length - 1 && (
              <hr className="cv1-divider" />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Certifications Section Component
  const CertificationsSection = () => {
    const certificationsSection = cvData.sections?.find(
      (s) => s.name === "Certification"
    );
    if (!certificationsSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Certifications</h3>
        {certificationsSection.data.map((cert, i) => (
          <div key={i} className="cv1-certification-item">
            <h4 className="cv1-certification-name">{cert.name}</h4>
            <p className="cv1-certification-institute">{cert.institute}</p>
            <p className="cv1-certification-date">{cert.issueDate}</p>
          </div>
        ))}
      </div>
    );
  };

  // Award Section Component
  const AwardSection = () => {
    const awardSection = cvData.sections?.find((s) => s.name === "Award");
    if (!awardSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Awards</h3>
        {awardSection.data.map((award, i) => (
          <div key={i} className="cv1-award-item">
            <h4 className="cv1-award-title">{award.title}</h4>
            <p className="cv1-award-issuer">{award.issuer}</p>
            <p className="cv1-award-date">{award.date}</p>
            {award.description && (
              <p className="cv1-award-description">{award.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Interest Section Component
  const InterestSection = () => {
    const interestSection = cvData.sections?.find((s) => s.name === "Interest");
    if (!interestSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Interests</h3>
        <ul className="cv1-interests-list">
          {interestSection.data.map((interest, i) => (
            <li key={i} className="cv1-interest-item">
              {interest}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Achievement Section Component
  const AchievementSection = () => {
    const achievementSection = cvData.sections?.find(
      (s) => s.name === "Achievement"
    );
    if (!achievementSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Achievements</h3>
        <ul className="cv1-achievements-list">
          {achievementSection.data.map((achievement, i) => (
            <li key={i} className="cv1-achievement-item">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Language Section Component
  const LanguageSection = () => {
    const languageSection = cvData.sections?.find((s) => s.name === "Language");
    if (!languageSection?.data?.length) return null;

    return (
      <div className="cv1-section">
        <h3 className="cv1-section-title">Languages</h3>
        <ul className="cv1-languages-list">
          {languageSection.data.map((language, i) => (
            <li key={i} className="cv1-language-item">
              {language.language}{" "}
              {language.proficiency && (
                <span className="cv1-language-level">
                  ({language.proficiency})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const PrintButton = () => (
    <div className="cv1-print-button-container">
      <button className="cv1-print-button" onClick={handlePrint}>
        Print CV
      </button>
    </div>
  );

  if (showLoading || !cvData) {
    const letters = [
      "P",
      "o",
      "r",
      "t",
      "f",
      "o",
      "l",
      "i",
      "o",
      ".",
      "D",
      "r",
      "i",
      "v",
      "e",
      "O",
      "S",
      "x",
    ];

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          p: 2,
        }}
      >
        {/* Animated Portfolio.DriveOSx Logo */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            {letters.map((letter, index) => (
              <Typography
                key={index}
                variant="h2"
                component="span"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "2.5rem" },
                  fontWeight: 400,
                  display: "inline-block",
                  animation: `fadeInOut 2s ease-in-out infinite`,
                  animationDelay: `${index * 0.12}s`,
                  color:
                    index === 0
                      ? "#4285F4" // P - blue
                      : index === 1
                        ? "#EA4335" // o - red
                        : index === 2
                          ? "#FBBC05" // r - yellow
                          : index === 3
                            ? "#4285F4" // t - blue
                            : index === 4
                              ? "#34A853" // f - green
                              : index === 5
                                ? "#EA4335" // o - red
                                : index === 6
                                  ? "#FBBC05" // l - yellow
                                  : index === 7
                                    ? "#4285F4" // i - blue
                                    : index === 8
                                      ? "#34A853" // o - green
                                      : index === 9
                                        ? "#5f6368" // . - gray
                                        : index === 10
                                          ? "#4285F4" // D - blue
                                          : index === 11
                                            ? "#EA4335" // r - red
                                            : index === 12
                                              ? "#FBBC05" // i - yellow
                                              : index === 13
                                                ? "#34A853" // v - green
                                                : index === 14
                                                  ? "#EA4335" // e - red
                                                  : index === 15
                                                    ? "#4285F4" // O - blue
                                                    : index === 16
                                                      ? "#FBBC05" // S - yellow
                                                      : "#34A853", // x - green
                }}
              >
                {letter}
              </Typography>
            ))}
          </Box>
        </Box>
        {/* 🔁 CSS animations */}
        <style>
          {`
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(10px); }
              20% { opacity: 1; transform: translateY(0); }
              80% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-10px); }
            }
          `}
        </style>
      </Box>
    );
  }

  if (!cvData) {
    return (
      <div className="cv1-error-container">
        <p className="cv1-error-text">No CV data available for this user.</p>
      </div>
    );
  }

  // Map backend sections in order
  const renderSection = (section) => {
    switch (section.name) {
      case "Summary":
        return <SummarySection data={section.data} />;
      case "Skill":
        return <SkillsSection data={section.data} />;
      case "Experience":
        return <ExperienceSection data={section.data} />;
      case "Education":
        return <EducationSection data={section.data} />;
      case "Project":
        return <ProjectsSection data={section.data} />;
      case "Certification":
        return <CertificationsSection data={section.data} />;
      case "Award":
        return <AwardSection data={section.data} />;
      case "Interest":
        return <InterestSection data={section.data} />;
      case "Achievement":
        return <AchievementSection data={section.data} />;
      case "Language":
        return <LanguageSection data={section.data} />;
      default:
        return null;
    }
  };

  return (
    <>
      <PrintButton />
      <div className="cv1-container" ref={cvContentRef}>
        {/* ============ SINGLE CONTINUOUS LAYOUT ============ */}
        <div className="cv1-content">
          <HeaderSection />
          {/* Render all sections */}
          {cvData.sections?.map((section, idx) => (
            <React.Fragment key={idx}>
              {renderSection(section)}
            </React.Fragment>
          ))}
        </div>

        <style jsx>{`
          /* Global Styles */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html,
          body {
            font-family: "Arial", "Helvetica", sans-serif;
            line-height: 1.3;
            background: #ffffff;
          }

          .cv1-container {
            max-width: 210mm;
            margin: 0 auto;
            color: #000000;
            background: white;
          }

          /* Single continuous layout - NO FIXED PAGES */
          .cv1-content {
            width: 210mm;
            background: white;
            margin: 0 auto;
            padding: 25mm;
            position: relative;
          }

          /* Print Button */
          .cv1-print-button-container {
            text-align: center;
            margin-bottom: 16px;
          }

          .cv1-print-button {
            background-color: #2e538aff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 0;
            cursor: pointer;
            font-size: 14px;
            font-family: "Arial", sans-serif;
            transition: background-color 0.3s ease;
          }

          .cv1-print-button:hover {
            background-color: #1b3fc1ff;
          }

          /* Header Section */
          .cv1-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000000;
            text-align: left;
          }

          .cv1-header-content {
            width: 100%;
          }

          .cv1-name {
            font-size: 26px;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 4px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .cv1-designation {
            font-size: 16px;
            color: #000000;
            margin-bottom: 15px;
            font-weight: normal;
          }

          .cv1-contact-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .cv1-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 10px;
            line-height: 1.3;
          }

          .cv1-contact-label {
            font-weight: bold;
            min-width: 55px;
            color: #000000;
          }

          .cv1-contact-text {
            font-weight: normal;
            color: #000000;
            word-break: break-word;
          }

          /* CV Content Layout */
          .cv1-section {
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #cccccc;
          }

          .cv1-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .cv1-section-title {
            font-size: 13px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-bottom: 4px;
            border-bottom: 1px solid #000000;
            display: inline-block;
          }

          /* Summary */
          .cv1-summary-text {
            line-height: 1.3;
            font-size: 10px;
            text-align: justify;
            color: #000000;
            margin: 0;
            hyphens: auto;
            word-break: break-word;
          }

          /* Skills */
          .cv1-skills-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }

          .cv1-skill-item {
            font-size: 10px;
            margin-bottom: 4px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-skill-rating {
            font-weight: normal;
            color: #666666;
          }

          /* Education */
          .cv1-education-item {
            margin-bottom: 12px;
          }

          .cv1-education-course {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-education-college {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
            line-height: 1.3;
          }

          .cv1-education-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
            margin: 0;
            line-height: 1.3;
          }

          /* Awards */
          .cv1-award-item {
            margin-bottom: 12px;
          }

          .cv1-award-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-award-issuer,
          .cv1-award-date {
            font-size: 10px;
            color: #666666;
            margin-bottom: 2px;
            line-height: 1.3;
          }

          .cv1-award-description {
            font-size: 10px;
            color: #000000;
            margin: 0;
            line-height: 1.3;
          }

          /* Interests */
          .cv1-interests-list {
            list-style-type: disc;
            padding-left: 18px;
            margin: 0;
          }

          .cv1-interest-item {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
            line-height: 1.3;
          }

          /* Achievements */
          .cv1-achievements-list {
            list-style-type: disc;
            padding-left: 18px;
            margin: 0;
          }

          .cv1-achievement-item {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
            line-height: 1.3;
          }

          /* Certifications */
          .cv1-certification-item {
            margin-bottom: 12px;
          }

          .cv1-certification-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-certification-institute {
            font-size: 10px;
            color: #666666;
            margin-bottom: 2px;
            line-height: 1.3;
          }

          .cv1-certification-date {
            font-size: 10px;
            color: #666666;
            margin: 0;
            font-weight: normal;
            line-height: 1.3;
          }

          /* Languages */
          .cv1-languages-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }

          .cv1-language-item {
            font-size: 10px;
            margin-bottom: 4px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-language-level {
            font-weight: normal;
            color: #666666;
          }

          /* Links */
          .cv1-link-url {
            font-size: 10px;
            color: #000000;
            text-decoration: underline;
            line-height: 1.3;
          }

          .cv1-link-url:hover {
            color: #000000;
          }

          /* Experience */
          .cv1-experience-item {
            margin-bottom: 16px;
          }

          .cv1-experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }

          .cv1-experience-title {
            font-size: 11px;
            font-weight: bold;
            color: #000000;
            margin: 0;
            line-height: 1.3;
          }

          .cv1-experience-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
            margin: 0;
            line-height: 1.3;
          }

          .cv1-experience-company {
            font-size: 10px;
            color: #000000;
            margin-bottom: 6px;
            font-weight: bold;
            line-height: 1.3;
          }

          .cv1-experience-description {
            line-height: 1.3;
            font-size: 10px;
            color: #000000;
            margin: 0;
            hyphens: auto;
            word-break: break-word;
          }

          /* Projects */
          .cv1-project-item {
            margin-bottom: 16px;
          }

          .cv1-project-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #000000;
            line-height: 1.3;
          }

          .cv1-project-description {
            line-height: 1.3;
            font-size: 10px;
            margin-bottom: 6px;
            color: #000000;
            hyphens: auto;
            word-break: break-word;
          }

          .cv1-technologies-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 0;
          }

          .cv1-tech-label {
            font-size: 10px;
            font-weight: bold;
            color: #000000;
            margin-right: 4px;
            line-height: 1.3;
          }

          .cv1-technology-tag {
            border: 1px solid #cccccc;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 9px;
            background: #f9f9f9;
            color: #000000;
            font-weight: normal;
            line-height: 1.3;
          }

          /* Divider */
          .cv1-divider {
            border: none;
            border-top: 1px solid #cccccc;
            margin: 12px 0;
          }

          /* Responsive Design for Screen */
          @media (max-width: 768px) {
            .cv1-container {
              padding: 8px;
              width: 100%;
            }

            .cv1-content {
              width: 100%;
              min-height: auto;
              padding: 15mm;
            }

            .cv1-contact-info {
              flex-direction: column;
            }

            .cv1-contact-item {
              justify-content: flex-start;
            }

            .cv1-name {
              font-size: 22px;
            }

            .cv1-designation {
              font-size: 14px;
            }

            .cv1-experience-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 2px;
            }
          }

          @media (min-width: 1200px) {
            .cv1-container {
              padding: 16px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Cv1;
