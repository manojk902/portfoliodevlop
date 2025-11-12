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

const Cv3 = ({ UserDataFromDesignPage }) => {
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

  // PRINT-JS PRINT FUNCTION - Single continuous layout
  const handlePrint = () => {
    if (!cvContentRef.current) {
      console.error("CV content not found");
      return;
    }

    // Get the HTML content
    const printContent = cvContentRef.current.innerHTML;

    // Use print-js with raw HTML - print.js will handle page breaks automatically
    printJS({
      printable: printContent,
      type: "raw-html",
      documentTitle: `${cvData?.firstName || "CV"} ${
        cvData?.lastName || ""
      } - Resume`,
      style: `
        @page {
          size: A4;
          margin: 12mm 15mm;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
          line-height: 1.4;
          color: #000000;
        }
        .cv3-container {
          max-width: 210mm !important;
          margin: 0 auto !important;
          background: white !important;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important;
          line-height: 1.4 !important;
          color: #000000 !important;
          padding: 0 !important;
        }
        .cv3-content {
          width: 210mm !important;
          background: white !important;
          margin: 0 auto !important;
          padding: 0 !important;
        }
        .cv3-print-button-container {
          display: none !important;
        }
        .cv3-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 12px !important;
          padding-bottom: 10px !important;
          border-bottom: 2px solid #000000 !important;
        }
        .cv3-name-section {
          flex: 1 !important;
        }
        .cv3-name {
          font-size: 28px !important;
          font-weight: 300 !important;
          line-height: 1.1 !important;
          margin-bottom: 5px !important;
          color: #000000 !important;
          text-transform: uppercase !important;
          letter-spacing: 1.5px !important;
        }
        .cv3-last-name {
          font-weight: 600 !important;
        }
        .cv3-designation {
          font-size: 14px !important;
          color: #000000 !important;
          font-weight: 400 !important;
          margin: 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.8px !important;
        }
        .cv3-contact-section {
          text-align: right !important;
        }
        .cv3-contact-item {
          font-size: 10px !important;
          color: #000000 !important;
          margin-bottom: 2px !important;
        }
        .cv3-link-url {
          color: #000000 !important;
          text-decoration: none !important;
        }
        .cv3-section {
          margin-bottom: 14px !important;
          page-break-inside: avoid !important;
        }
        .cv3-section:last-child {
          margin-bottom: 0 !important;
        }
        .cv3-section-title {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          margin-bottom: 8px !important;
          text-transform: uppercase !important;
          letter-spacing: 1.5px !important;
          border-bottom: 1px solid #000000 !important;
          padding-bottom: 3px !important;
        }
        .cv3-section-content {
          padding-left: 0 !important;
        }
        .cv3-summary-text {
          line-height: 1.4 !important;
          font-size: 12px !important;
          text-align: justify !important;
          color: #000000 !important;
          margin: 0 0 12px 0 !important;
          hyphens: auto !important;
        }
        .cv3-experience-item {
          margin-bottom: 12px !important;
          page-break-inside: avoid !important;
        }
        .cv3-experience-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 4px !important;
        }
        .cv3-experience-title {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          margin: 0 0 2px 0 !important;
          text-transform: uppercase !important;
        }
        .cv3-experience-company {
          font-size: 11px !important;
          color: #000000 !important;
          display: block !important;
        }
        .cv3-experience-dates {
          font-size: 10px !important;
          color: #666666 !important;
          font-style: italic !important;
          white-space: nowrap !important;
        }
        .cv3-experience-description {
          line-height: 1.4 !important;
          font-size: 11px !important;
          color: #000000 !important;
          margin: 0 !important;
        }
        .cv3-project-item {
          margin-bottom: 10px !important;
          page-break-inside: avoid !important;
        }
        .cv3-project-name {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          margin: 0 0 3px 0 !important;
        }
        .cv3-project-description {
          line-height: 1.4 !important;
          font-size: 11px !important;
          color: #000000 !important;
          margin: 0 0 4px 0 !important;
        }
        .cv3-education-item {
          margin-bottom: 10px !important;
          page-break-inside: avoid !important;
        }
        .cv3-education-course {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          margin: 0 0 2px 0 !important;
          text-transform: uppercase !important;
        }
        .cv3-education-college {
          font-size: 11px !important;
          color: #000000 !important;
          display: block !important;
        }
        .cv3-education-location {
          font-size: 10px !important;
          color: #666666 !important;
          display: block !important;
        }
        .cv3-education-dates {
          font-size: 10px !important;
          color: #666666 !important;
          font-style: italic !important;
        }
        .cv3-skills-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px !important;
        }
        .cv3-skill-item {
          font-size: 11px !important;
          color: #000000 !important;
          line-height: 1.3 !important;
        }
        .cv3-certification-item,
        .cv3-award-item {
          margin-bottom: 8px !important;
        }
        .cv3-certification-name,
        .cv3-award-title {
          font-size: 12px !important;
          font-weight: 600 !important;
          margin-bottom: 2px !important;
          color: #000000 !important;
        }
        .cv3-certification-institute,
        .cv3-certification-date,
        .cv3-award-issuer,
        .cv3-award-date {
          font-size: 10px !important;
          color: #666666 !important;
          display: block !important;
        }
        .cv3-achievements-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 3px !important;
        }
        .cv3-achievement-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 5px !important;
        }
        .cv3-achievement-text {
          font-size: 11px !important;
          color: #000000 !important;
          line-height: 1.3 !important;
        }
        .cv3-languages-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 3px !important;
        }
        .cv3-language-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          font-size: 11px !important;
        }
        .cv3-interests-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
        }
        .cv3-interest-tag {
          background: #f0f0f0 !important;
          color: #000000 !important;
          padding: 2px 6px !important;
          border-radius: 2px !important;
          font-size: 10px !important;
          border: 1px solid #ddd !important;
        }
        /* Markdown Preview Styles - Consistent throughout */
        .wmde-markdown {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important;
        }
        .wmde-markdown p {
          margin: 0 0 4px 0 !important;
          line-height: 1.4 !important;
        }
        .wmde-markdown ul, .wmde-markdown ol {
          margin: 0 0 4px 0 !important;
          padding-left: 14px !important;
        }
        .wmde-markdown li {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        .wmde-markdown strong {
          font-weight: 600 !important;
        }
        .wmde-markdown em {
          font-style: italic !important;
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
    <div className="cv3-header">
      <div className="cv3-name-section">
        <h1 className="cv3-name">
          {cvData.firstName}{" "}
          <span className="cv3-last-name">{cvData.lastName}</span>
        </h1>
        <h2 className="cv3-designation">{cvData.designation}</h2>
      </div>
      <div className="cv3-contact-section">
        <div className="cv3-contact-row">
          {cvData.phoneNo && (
            <div className="cv3-contact-item">
              <span className="cv3-contact-text">{cvData.phoneNo}</span>
            </div>
          )}
          {cvData.email && (
            <div className="cv3-contact-item">
              <span className="cv3-contact-text">{cvData.email}</span>
            </div>
          )}
        </div>
        <div className="cv3-contact-row">
          {cvData.address?.city && (
            <div className="cv3-contact-item">
              <span className="cv3-contact-text">
                {cvData.address.city}
                {cvData.address.state ? `, ${cvData.address.state}` : ""}
              </span>
            </div>
          )}
          {cvData.socialLinks?.map((link, i) => (
            <div key={i} className="cv3-contact-item">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="cv3-link-url"
              >
                {link.replace(/^https?:\/\//, "").split("/")[0]}
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
      <div className="cv3-section">
        <div className="cv3-section-content">
          <p className="cv3-summary-text">{summarySection.data}</p>
        </div>
      </div>
    );
  };

  // Skills Section Component
  const SkillsSection = () => {
    const skillsSection = cvData.sections?.find((s) => s.name === "Skill");
    if (!skillsSection?.data?.length) return null;

    const professionalSkills = skillsSection.data.filter(
      (skill) =>
        !skill.skill.toLowerCase().includes("technical") &&
        !skill.skill.toLowerCase().includes("programming") &&
        !skill.skill.toLowerCase().includes("software")
    );

    const technicalSkills = skillsSection.data.filter(
      (skill) =>
        skill.skill.toLowerCase().includes("technical") ||
        skill.skill.toLowerCase().includes("programming") ||
        skill.skill.toLowerCase().includes("software") ||
        skill.skill.toLowerCase().includes("microsoft") ||
        skill.skill.toLowerCase().includes("adobe")
    );

    return (
      <div className="cv3-section">
        <h3 className="cv3-section-title">C O R E &nbsp;&nbsp; S K I L L S</h3>
        <div className="cv3-section-content">
          {professionalSkills.length > 0 && (
            <div className="cv3-skills-category">
              <div className="cv3-skills-list">
                {professionalSkills.map((skill, i) => (
                  <span key={i} className="cv3-skill-item">
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {technicalSkills.length > 0 && (
            <div className="cv3-skills-category">
              <span className="cv3-category-tag">#TECHNICAL</span>
              <div className="cv3-skills-list">
                {technicalSkills.map((skill, i) => (
                  <span key={i} className="cv3-skill-item">
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
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
      <div className="cv3-section">
        <h3 className="cv3-section-title">E D U C A T I O N</h3>
        <div className="cv3-section-content">
          {educationSection.data.map((edu, i) => (
            <div key={i} className="cv3-education-item">
              <div className="cv3-education-main">
                <h4 className="cv3-education-course">{edu.course}</h4>
                <span className="cv3-education-college">{edu.college}</span>
                {cvData.address?.city && (
                  <span className="cv3-education-location">
                    {cvData.address.city}
                    {cvData.address.state ? `, ${cvData.address.state}` : ""}
                  </span>
                )}
              </div>
              <span className="cv3-education-dates">
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
          ))}
        </div>
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
      <div className="cv3-section">
        <h3 className="cv3-section-title">
          W O R K &nbsp;&nbsp; E X P E R I E N C E
        </h3>
        <div className="cv3-section-content">
          {experienceSection.data.map((exp, i) => (
            <div key={i} className="cv3-experience-item">
              <div className="cv3-experience-header">
                <div className="cv3-experience-title-container">
                  <h4 className="cv3-experience-title">{exp.jobTitle}</h4>
                  <span className="cv3-experience-company">
                    {exp.company} - {exp.location}
                  </span>
                </div>
                <span className="cv3-experience-dates">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="cv3-experience-description">
                <MarkdownPreview
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    padding: 0,
                    fontSize: "11px",
                    lineHeight: 1.4,
                    fontFamily:
                      "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                  }}
                  source={exp.description || ""}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Projects Section Component
  const ProjectsSection = () => {
    const projectsSection = cvData.sections?.find((s) => s.name === "Project");
    if (!projectsSection?.data?.length) return null;

    return (
      <div className="cv3-section">
        <h3 className="cv3-section-title">P R O J E C T S</h3>
        <div className="cv3-section-content">
          {projectsSection.data.map((proj, i) => (
            <div key={i} className="cv3-project-item">
              <div className="cv3-project-header">
                <h4 className="cv3-project-name">{proj.name}</h4>
                {proj.technologies && (
                  <div className="cv3-technologies-container">
                    {proj.technologies.map((tech, idx) => (
                      <span key={idx} className="cv3-technology-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="cv3-project-description">
                <MarkdownPreview
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    padding: 0,
                    fontSize: "11px",
                    lineHeight: 1.4,
                    fontFamily:
                      "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                  }}
                  source={proj.description || ""}
                />
              </div>
            </div>
          ))}
        </div>
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
      <div className="cv3-section">
        <h3 className="cv3-section-title">C E R T I F I C A T I O N S</h3>
        <div className="cv3-section-content">
          {certificationsSection.data.map((cert, i) => (
            <div key={i} className="cv3-certification-item">
              <h4 className="cv3-certification-name">{cert.name}</h4>
              <span className="cv3-certification-institute">
                {cert.institute}
              </span>
              <span className="cv3-certification-date">{cert.issueDate}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Award Section Component
  const AwardSection = () => {
    const awardSection = cvData.sections?.find((s) => s.name === "Award");
    if (!awardSection?.data?.length) return null;

    return (
      <div className="cv3-section">
        <h3 className="cv3-section-title">A W A R D S</h3>
        <div className="cv3-section-content">
          {awardSection.data.map((award, i) => (
            <div key={i} className="cv3-award-item">
              <h4 className="cv3-award-title">{award.title}</h4>
              <span className="cv3-award-issuer">{award.issuer}</span>
              <span className="cv3-award-date">{award.date}</span>
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "11px",
                  lineHeight: 1.4,
                  fontFamily:
                    "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                }}
                source={award.description || ""}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Interest Section Component
  const InterestSection = () => {
    const interestSection = cvData.sections?.find((s) => s.name === "Interest");
    if (!interestSection?.data?.length) return null;

    return (
      <div className="cv3-section">
        <h3 className="cv3-section-title">I N T E R E S T S</h3>
        <div className="cv3-section-content">
          <div className="cv3-interests-container">
            {interestSection.data.map((interest, i) => (
              <span key={i} className="cv3-interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
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
      <div className="cv3-section">
        <h3 className="cv3-section-title">A C H I E V E M E N T S</h3>
        <div className="cv3-section-content">
          <div className="cv3-achievements-list">
            {achievementSection.data.map((achievement, i) => (
              <div key={i} className="cv3-achievement-item">
                <span className="cv3-achievement-text">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Language Section Component
  const LanguageSection = () => {
    const languageSection = cvData.sections?.find((s) => s.name === "Language");
    if (!languageSection?.data?.length) return null;

    return (
      <div className="cv3-section">
        <h3 className="cv3-section-title">L A N G U A G E S</h3>
        <div className="cv3-section-content">
          <div className="cv3-languages-container">
            {languageSection.data.map((language, i) => (
              <div key={i} className="cv3-language-item">
                <span className="cv3-language-name">{language.language}</span>
                <span className="cv3-language-proficiency">
                  ({language.proficiency})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PrintButton = () => (
    <div className="cv3-print-button-container">
      <button className="cv3-print-button" onClick={handlePrint}>
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
                      ? "#4285F4"
                      : index === 1
                      ? "#EA4335"
                      : index === 2
                      ? "#FBBC05"
                      : index === 3
                      ? "#4285F4"
                      : index === 4
                      ? "#34A853"
                      : index === 5
                      ? "#EA4335"
                      : index === 6
                      ? "#FBBC05"
                      : index === 7
                      ? "#4285F4"
                      : index === 8
                      ? "#34A853"
                      : index === 9
                      ? "#5f6368"
                      : index === 10
                      ? "#4285F4"
                      : index === 11
                      ? "#EA4335"
                      : index === 12
                      ? "#FBBC05"
                      : index === 13
                      ? "#34A853"
                      : index === 14
                      ? "#EA4335"
                      : index === 15
                      ? "#4285F4"
                      : index === 16
                      ? "#FBBC05"
                      : "#34A853",
                }}
              >
                {letter}
              </Typography>
            ))}
          </Box>
        </Box>
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
      <div className="cv3-error-container">
        <p className="cv3-error-text">No CV data available for this user.</p>
      </div>
    );
  }

  return (
    <>
      <PrintButton />
      {/* SINGLE CONTINUOUS LAYOUT - No page division in browser */}
      <div className="cv3-container" ref={cvContentRef}>
        <div className="cv3-content">
          <HeaderSection />
          <SummarySection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
          <SkillsSection />
          <CertificationsSection />
          <AwardSection />
          <AchievementSection />
          <LanguageSection />
          <InterestSection />
        </div>

        <style jsx>{`
          /* ===== GLOBAL STYLES ===== */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html,
          body {
            font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial,
              sans-serif;
            line-height: 1.4;
            background: #ffffff;
            color: #000000;
          }

          .cv3-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
          }

          /* ===== SINGLE CONTINUOUS CONTENT ===== */
          .cv3-content {
            width: 210mm;
            background: white;
            margin: 0 auto;
            padding: 12mm 15mm;
            position: relative;
          }

          /* ===== HEADER SECTION ===== */
          .cv3-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000000;
          }

          .cv3-name-section {
            flex: 1;
          }

          .cv3-name {
            font-size: 28px;
            font-weight: 300;
            line-height: 1.1;
            margin-bottom: 5px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          .cv3-last-name {
            font-weight: 600;
          }

          .cv3-designation {
            font-size: 14px;
            color: #000000;
            font-weight: 400;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }

          .cv3-contact-section {
            text-align: right;
          }

          .cv3-contact-item {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
          }

          .cv3-link-url {
            color: #000000;
            text-decoration: none;
          }

          /* ===== SECTION STYLES ===== */
          .cv3-section {
            margin-bottom: 14px;
          }

          .cv3-section:last-child {
            margin-bottom: 0;
          }

          .cv3-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          }

          .cv3-section-content {
            padding-left: 0;
          }

          /* ===== SUMMARY ===== */
          .cv3-summary-text {
            line-height: 1.4;
            font-size: 12px;
            text-align: justify;
            color: #000000;
            margin: 0 0 12px 0;
            hyphens: auto;
          }

          /* ===== EXPERIENCE ===== */
          .cv3-experience-item {
            margin-bottom: 12px;
          }

          .cv3-experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }

          .cv3-experience-title {
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            margin: 0 0 2px 0;
            text-transform: uppercase;
          }

          .cv3-experience-company {
            font-size: 11px;
            color: #000000;
            display: block;
          }

          .cv3-experience-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
            white-space: nowrap;
          }

          .cv3-experience-description {
            line-height: 1.4;
            font-size: 11px;
            color: #000000;
            margin: 0;
          }

          /* ===== PROJECTS ===== */
          .cv3-project-item {
            margin-bottom: 10px;
          }

          .cv3-project-name {
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            margin: 0 0 3px 0;
          }

          .cv3-project-description {
            line-height: 1.4;
            font-size: 11px;
            color: #000000;
            margin: 0 0 4px 0;
          }

          /* ===== EDUCATION ===== */
          .cv3-education-item {
            margin-bottom: 10px;
          }

          .cv3-education-course {
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            margin: 0 0 2px 0;
            text-transform: uppercase;
          }

          .cv3-education-college {
            font-size: 11px;
            color: #000000;
            display: block;
          }

          .cv3-education-location {
            font-size: 10px;
            color: #666666;
            display: block;
          }

          .cv3-education-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
          }

          /* ===== SKILLS ===== */
          .cv3-skills-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .cv3-skill-item {
            font-size: 11px;
            color: #000000;
            line-height: 1.3;
          }

          /* ===== CERTIFICATIONS & AWARDS ===== */
          .cv3-certification-item,
          .cv3-award-item {
            margin-bottom: 8px;
          }

          .cv3-certification-name,
          .cv3-award-title {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 2px;
            color: #000000;
          }

          .cv3-certification-institute,
          .cv3-certification-date,
          .cv3-award-issuer,
          .cv3-award-date {
            font-size: 10px;
            color: #666666;
            display: block;
          }

          /* ===== ACHIEVEMENTS ===== */
          .cv3-achievements-list {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .cv3-achievement-item {
            display: flex;
            align-items: flex-start;
            gap: 5px;
          }

          .cv3-achievement-text {
            font-size: 11px;
            color: #000000;
            line-height: 1.3;
          }

          /* ===== LANGUAGES & INTERESTS ===== */
          .cv3-languages-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .cv3-language-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
          }

          .cv3-interests-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .cv3-interest-tag {
            background: #f0f0f0;
            color: #000000;
            padding: 2px 6px;
            border-radius: 2px;
            font-size: 10px;
            border: 1px solid #ddd;
          }

          /* ===== PRINT BUTTON ===== */
          .cv3-print-button-container {
            text-align: center;
            margin-bottom: 16px;
          }

          .cv3-print-button {
            background-color: #2e538aff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 0;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
          }

          .cv3-print-button:hover {
            background-color: #1b3fc1ff;
          }

          /* ===== RESPONSIVE DESIGN ===== */
          @media (max-width: 768px) {
            .cv3-container {
              padding: 8px;
            }

            .cv3-content {
              width: 100%;
              padding: 15px;
            }

            .cv3-header {
              flex-direction: column;
              gap: 10px;
            }

            .cv3-contact-section {
              text-align: left;
            }
          }

          /* Browser-specific A4 size styling */
          @media screen {
            .cv3-container {
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Cv3;
