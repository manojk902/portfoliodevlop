/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

const Cv8 = ({ UserDataFromDesignPage }) => {
  // --- 1. Identify Context (URL & Redux) ---
  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");
  const [showLoading, setShowLoading] = useState(true);
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

  const handlePrint = () => {
    window.print();
  };

  // ============ SECTION COMPONENTS ============

  // Header Section Component
  const HeaderSection = () => (
    <div className="cv8-header">
      <div className="cv8-header-content">
        <h1 className="cv8-name">
          {cvData.firstName} {cvData.lastName}
        </h1>
        <h2 className="cv8-designation">{cvData.designation}</h2>

        <div className="cv8-contact-info">
          {/* Email */}
          <div className="cv8-contact-item">
            <span className="cv8-contact-label">Email:</span>
            <span className="cv8-contact-text">{cvData.email}</span>
          </div>

          {/* Phone */}
          <div className="cv8-contact-item">
            <span className="cv8-contact-label">Phone:</span>
            <span className="cv8-contact-text">{cvData.phoneNo}</span>
          </div>

          {/* Address */}
          <div className="cv8-contact-item">
            <span className="cv8-contact-label">Address:</span>
            <span className="cv8-contact-text">
              {cvData.address?.city}, {cvData.address?.state}
            </span>
          </div>

          {/* Social Links */}
          {cvData.socialLinks.map((link, i) => (
            <div key={i} className="cv8-contact-item">
              <span className="cv8-contact-label">Link:</span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="cv8-link-url"
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Professional Summary</h3>
        <p className="cv8-summary-text">{summarySection.data}</p>
      </div>
    );
  };

  // Skills Section Component
  const SkillsSection = () => {
    const skillsSection = cvData.sections?.find((s) => s.name === "Skill");
    if (!skillsSection?.data?.length) return null;

    return (
      <div className="cv8-section">
        <h3 className="cv8-section-title">Skills</h3>
        <ul className="cv8-skills-list">
          {skillsSection.data.map((skill, i) => (
            <li key={i} className="cv8-skill-item">
              {skill.skill}{" "}
              <span className="cv8-skill-rating">({skill.rating}/5)</span>
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Education</h3>
        {educationSection.data.map((edu, i) => (
          <div key={i} className="cv8-education-item">
            <h4 className="cv8-education-course">{edu.course}</h4>
            <p className="cv8-education-college">{edu.college}</p>
            <p className="cv8-education-dates">
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Professional Experience</h3>
        {experienceSection.data.map((exp, i) => (
          <div key={i} className="cv8-experience-item">
            <div className="cv8-experience-header">
              <h4 className="cv8-experience-title">{exp.jobTitle}</h4>
              <span className="cv8-experience-dates">
                {exp.startDate} – {exp.endDate}
              </span>
            </div>
            <p className="cv8-experience-company">
              {exp.company}, {exp.location}
            </p>
            <div className="cv8-experience-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
                source={exp.description || ""}
              />
            </div>
            {i < experienceSection.data.length - 1 && (
              <hr className="cv8-divider" />
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Projects</h3>
        {projectsSection.data.map((proj, i) => (
          <div key={i} className="cv8-project-item">
            <h4 className="cv8-project-name">{proj.name}</h4>
            <div className="cv8-project-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
                source={proj.description || ""}
              />
            </div>
            {proj.technologies && (
              <div className="cv8-technologies-container">
                <span className="cv8-tech-label">Technologies:</span>
                {proj.technologies.map((tech, idx) => (
                  <span key={idx} className="cv8-technology-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {i < projectsSection.data.length - 1 && (
              <hr className="cv8-divider" />
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Certifications</h3>
        {certificationsSection.data.map((cert, i) => (
          <div key={i} className="cv8-certification-item">
            <h4 className="cv8-certification-name">{cert.name}</h4>
            <p className="cv8-certification-institute">{cert.institute}</p>
            <p className="cv8-certification-date">{cert.issueDate}</p>
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Awards</h3>
        {awardSection.data.map((award, i) => (
          <div key={i} className="cv8-award-item">
            <h4 className="cv8-award-title">{award.title}</h4>
            <p className="cv8-award-issuer">{award.issuer}</p>
            <p className="cv8-award-date">{award.date}</p>
            {award.description && (
              <p className="cv8-award-description">{award.description}</p>
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Interests</h3>
        <ul className="cv8-interests-list">
          {interestSection.data.map((interest, i) => (
            <li key={i} className="cv8-interest-item">
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">Achievements</h3>
        <ul className="cv8-achievements-list">
          {achievementSection.data.map((achievement, i) => (
            <li key={i} className="cv8-achievement-item">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const PrintButton = () => (
    <div className="cv8-print-button-container">
      <button className="cv8-print-button" onClick={handlePrint}>
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
      <div className="cv8-error-container">
        <p className="cv8-error-text">No CV data available for this user.</p>
      </div>
    );
  }

  return (
    <>
      <PrintButton />
      <div className="cv8-container">
        {/* ============ PAGE 1 ============ */}
        <div className="cv8-page cv8-page-1">
          <HeaderSection />
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
        </div>

        {/* ============ PAGE 2 ============ */}
        <div className="cv8-page cv8-page-2">
          <SkillsSection />
          <ProjectsSection />
          <AwardSection />
        </div>

        {/* ============ PAGE 3 ============ */}
        <div className="cv8-page cv8-page-3">
          <AchievementSection />
          <CertificationsSection />
          <InterestSection />
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
            line-height: 1.4;
            background: #ffffff;
          }

          .cv8-container {
            max-width: 210mm;
            margin: 0 auto;
            color: #000000;
          }

          /* Page Styles - SINGLE COLUMN LAYOUT */
          .cv8-page {
            width: 210mm;
            min-height: 280mm;
            background: white;
            margin: 0 auto 40px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 25mm;
            position: relative;
            page-break-after: always;
            overflow: hidden;
          }
          .cv8-page:last-child {
            page-break-after: auto;
            margin-bottom: 0;
          }

          /* Page number indicator - HIDE IN PRINT */
          .cv8-page::after {
            content: "Page " attr(class);
            position: absolute;
            bottom: 10px;
            right: 20px;
            font-size: 10px;
            color: #999;
            font-style: italic;
          }

          .cv8-page-1::after {
            content: "Page 1";
          }

          .cv8-page-2::after {
            content: "Page 2";
          }

          .cv8-page-3::after {
            content: "Page 3";
          }

          /* Loading State */
          .cv8-loading-container {
            padding: 16px;
            text-align: center;
          }

          .cv8-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #000;
            border-radius: 50%;
            animation: cv8-spin 1s linear infinite;
            margin: 0 auto 8px;
          }

          @keyframes cv8-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .cv8-loading-text {
            font-size: 14px;
            color: #666;
          }

          /* Error State */
          .cv8-error-container {
            padding: 32px;
            text-align: center;
            background-color: #f9f9f9;
          }

          .cv8-error-text {
            color: #cc0000;
          }

          /* Print Button */
          .cv8-print-button-container {
            text-align: center;
            margin-bottom: 16px;
          }

          .cv8-print-button {
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

          .cv8-print-button:hover {
            background-color: #1b3fc1ff;
          }

          /* Header Section */
          .cv8-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000000;
            text-align: left;
          }

          .cv8-header-content {
            width: 100%;
          }

          .cv8-name {
            font-size: 26px;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 4px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .cv8-designation {
            font-size: 16px;
            color: #000000;
            margin-bottom: 15px;
            font-weight: normal;
          }

          .cv8-contact-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .cv8-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 10px;
            line-height: 1.3;
          }

          .cv8-contact-label {
            font-weight: bold;
            min-width: 55px;
            color: #000000;
          }

          .cv8-contact-text {
            font-weight: normal;
            color: #000000;
            word-break: break-word;
          }

          /* CV Content Layout - SINGLE COLUMN */
          .cv8-section {
            // margin-bottom: 20px;
            // padding-bottom: 12px;
            border-bottom: 1px solid #cccccc;
            page-break-inside: avoid;
          }

          .cv8-section:last-child {
            border-bottom: none;
          }

          .cv8-section-title {
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
          .cv8-summary-text {
            line-height: 1.5;
            font-size: 10px;
            text-align: justify;
            color: #000000;
            margin: 0;
            hyphens: auto;
            word-break: break-word;
          }

          /* Skills */
          .cv8-skills-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }

          .cv8-skill-item {
            font-size: 10px;
            margin-bottom: 4px;
            color: #000000;
          }

          .cv8-skill-rating {
            font-weight: normal;
            color: #666666;
          }

          /* Education */
          .cv8-education-item {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }

          .cv8-education-course {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
          }

          .cv8-education-college {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
          }

          .cv8-education-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
            margin: 0;
          }

          /* Awards */
          .cv8-award-item {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }

          .cv8-award-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
          }

          .cv8-award-issuer,
          .cv8-award-date {
            font-size: 10px;
            color: #666666;
            margin-bottom: 2px;
          }

          .cv8-award-description {
            font-size: 10px;
            color: #000000;
            margin: 0;
            line-height: 1.4;
          }

          /* Interests */
          .cv8-interests-list {
            list-style-type: disc;
            padding-left: 18px;
            margin: 0;
          }

          .cv8-interest-item {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
          }

          /* Achievements */
          .cv8-achievements-list {
            list-style-type: disc;
            padding-left: 18px;
            margin: 0;
          }

          .cv8-achievement-item {
            font-size: 10px;
            color: #000000;
            margin-bottom: 2px;
            line-height: 1.4;
          }

          /* Certifications */
          .cv8-certification-item {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }

          .cv8-certification-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #000000;
          }

          .cv8-certification-institute {
            font-size: 10px;
            color: #666666;
            margin-bottom: 2px;
          }

          .cv8-certification-date {
            font-size: 10px;
            color: #666666;
            margin: 0;
            font-weight: normal;
          }

          /* Links */
          .cv8-link-url {
            font-size: 10px;
            color: #000000;
            text-decoration: underline;
          }

          .cv8-link-url:hover {
            color: #000000;
          }

          /* Experience */
          .cv8-experience-item {
            margin-bottom: 16px;
            page-break-inside: avoid;
          }

          .cv8-experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }

          .cv8-experience-title {
            font-size: 11px;
            font-weight: bold;
            color: #000000;
            margin: 0;
          }

          .cv8-experience-dates {
            font-size: 10px;
            color: #666666;
            font-style: italic;
            margin: 0;
          }

          .cv8-experience-company {
            font-size: 10px;
            color: #000000;
            margin-bottom: 6px;
            font-weight: bold;
          }

          .cv8-experience-description {
            line-height: 1.4;
            font-size: 10px;
            color: #000000;
            margin: 0;
            hyphens: auto;
            word-break: break-word;
          }

          /* Projects */
          .cv8-project-item {
            margin-bottom: 16px;
            page-break-inside: avoid;
          }

          .cv8-project-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #000000;
          }

          .cv8-project-description {
            line-height: 1.4;
            font-size: 10px;
            margin-bottom: 6px;
            color: #000000;
            hyphens: auto;
            word-break: break-word;
          }

          .cv8-technologies-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 0;
          }

          .cv8-tech-label {
            font-size: 10px;
            font-weight: bold;
            color: #000000;
            margin-right: 4px;
          }

          .cv8-technology-tag {
            border: 1px solid #cccccc;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 9px;
            background: #f9f9f9;
            color: #000000;
            font-weight: normal;
          }

          /* Divider */
          .cv8-divider {
            border: none;
            border-top: 1px solid #cccccc;
            margin: 12px 0;
          }

          @media print {
            /* --- A4 Page Setup --- */
            @page {
              size: A4;
              margin: 0; /* कोई extra outer margin नहीं */
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-size: 10px !important;
              line-height: 1.3 !important;
            }

            /* --- Hide site header/footer/navigation (✅ main fix) --- */
            header,
            footer,
            nav,
            .site-header,
            .site-footer,
            .no-print,
            .cv8-print-button-container,
            .cv8-page::after {
              display: none !important;
              visibility: hidden !important;
            }

            /* --- Container adjustments --- */
            .cv8-container {
              max-width: none !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: white !important;
              box-shadow: none !important;
            }

            /* --- Page styling --- */
            .cv8-page {
              width: 210mm !important;
              min-height: 280mm !important; /* reduce a little */
              margin: 0 auto !important;
              padding: 25mm !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: white !important;
              overflow: visible !important; /* allow content overflow */
              page-break-after: always !important;
            }

            /* ✅ Last page के बाद break हटाना (blank page fix) */
            .cv8-page:last-child {
              page-break-after: avoid !important;
            }

            /* --- Prevent breaking inside sections --- */
            .cv8-section,
            .cv8-experience-item,
            .cv8-education-item,
            .cv8-project-item,
            .cv8-certification-item,
            .cv8-award-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* --- Compact spacing adjustments --- */
            .cv8-header {
              margin-bottom: 15px !important;
              padding-bottom: 10px !important;
            }

            .cv8-section {
              margin-bottom: 15px !important;
              padding-bottom: 8px !important;
            }

            .cv8-name {
              font-size: 24px !important;
            }

            .cv8-designation {
              font-size: 14px !important;
              margin-bottom: 12px !important;
            }

            .cv8-contact-item {
              font-size: 9px !important;
              gap: 6px !important;
            }

            .cv8-section-title {
              font-size: 12px !important;
              margin-bottom: 6px !important;
              padding-bottom: 3px !important;
            }

            .cv8-summary-text,
            .cv8-experience-description,
            .cv8-project-description,
            .cv8-award-description {
              font-size: 9px !important;
              line-height: 1.3 !important;
            }

            .cv8-experience-item,
            .cv8-project-item {
              margin-bottom: 12px !important;
            }

            .cv8-divider {
              margin: 8px 0 !important;
            }
          }

          /* Responsive Design for Screen */
          @media (max-width: 768px) {
            .cv8-container {
              padding: 8px;
            }

            .cv8-page {
              width: 100%;
              min-height: auto;
              padding: 10mm;
              margin-bottom: 10px;
            }

            .cv8-contact-info {
              flex-direction: column;
            }

            .cv8-contact-item {
              justify-content: flex-start;
            }

            .cv8-name {
              font-size: 22px;
            }

            .cv8-designation {
              font-size: 14px;
            }

            .cv8-experience-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 2px;
            }
          }

          @media (min-width: 1200px) {
            .cv8-container {
              padding: 16px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Cv8;
