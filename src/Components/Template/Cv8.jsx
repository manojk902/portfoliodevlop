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
            <span className="cv8-contact-icon">✉️</span>
            <span className="cv8-contact-text">{cvData.email}</span>
          </div>

          {/* Phone */}
          <div className="cv8-contact-item">
            <span className="cv8-contact-icon">📞</span>
            <span className="cv8-contact-text">{cvData.phoneNo}</span>
          </div>

          {/* Address */}
          <div className="cv8-contact-item">
            <span className="cv8-contact-icon">📍</span>
            <span className="cv8-contact-text">
              {cvData.address?.city}, {cvData.address?.state}
            </span>
          </div>

          {/* Social Links — now on the same line */}
          {cvData.socialLinks.map((link, i) => (
            <div key={i} className="cv8-contact-item">
              <span className="cv8-contact-icon">🔗</span>
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
        <h3 className="cv8-section-title">SUMMARY</h3>
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
        <h3 className="cv8-section-title">SKILLS</h3>
        <div className="cv8-skills-container">
          {skillsSection.data.map((skill, i) => (
            <div key={i} className="cv8-skill-item">
              <div className="cv8-skill-header">
                <span className="cv8-skill-name">{skill.skill}</span>
                <span className="cv8-skill-rating">{skill.rating}/5</span>
              </div>
              <div className="cv8-skill-bar">
                <div
                  className="cv8-skill-progress"
                  style={{ width: `${(skill.rating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">EDUCATION</h3>
        {educationSection.data.map((edu, i) => (
          <div key={i} className="cv8-education-item">
            <h4 className="cv8-education-course">{edu.course}</h4>
            <p className="cv8-education-college">{edu.college}</p>
            <p className="cv8-education-dates">
              {edu.startDate} - {edu.endDate}
            </p>
            <p className="cv8-education-grade">Grade: {edu.grade}</p>
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
        <h3 className="cv8-section-title">WORK EXPERIENCE</h3>
        {experienceSection.data.map((exp, i) => (
          <div key={i} className="cv8-experience-item">
            <div className="cv8-experience-header">
              <h4 className="cv8-experience-title">{exp.jobTitle}</h4>
              <span className="cv8-experience-dates">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
            <p className="cv8-experience-company">
              {exp.company} | {exp.location}
            </p>
            <div className="cv8-experience-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "0.75rem",
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
        <h3 className="cv8-section-title">PROJECTS</h3>
        {projectsSection.data.map((proj, i) => (
          <div key={i} className="cv8-project-item">
            <h4 className="cv8-project-name">{proj.name}</h4>
            <div className="cv8-project-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "0.75rem",
                }}
                source={proj.description || ""}
              />
            </div>
            {proj.technologies && (
              <div className="cv8-technologies-container">
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
        <h3 className="cv8-section-title">CERTIFICATIONS</h3>
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
        <h3 className="cv8-section-title">AWARDS</h3>
        {awardSection.data.map((award, i) => (
          <div key={i} className="cv8-award-item">
            <h4 className="cv8-award-title">{award.title}</h4>
            <div className="cv8-award-issuer">{award.issuer}</div>
            <div className="cv8-award-date">{award.date}</div>
            {award.description && (
              <div className="cv8-award-description">{award.description}</div>
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
        <h3 className="cv8-section-title">INTERESTS</h3>
        <div className="cv8-interests-container">
          {interestSection.data.map((interest, i) => (
            <div key={i} className="cv8-interest-item">
              <span className="cv8-interest-icon">🎯</span>
              <span className="cv8-interest-text">{interest}</span>
            </div>
          ))}
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
      <div className="cv8-section">
        <h3 className="cv8-section-title">ACHIEVEMENTS</h3>
        <div className="cv8-achievements-container">
          {achievementSection.data.map((achievement, i) => (
            <div key={i} className="cv8-achievement-item">
              <span className="cv8-achievement-icon">🏆</span>
              <span className="cv8-achievement-text">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PrintButton = () => (
    <div className="cv8-print-button-container">
      <button className="cv8-print-button" onClick={handlePrint}>
        <span className="cv8-print-icon">🖨️</span>
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
    <div className="cv8-container">
      <PrintButton />

      {/* ============ PAGE 1 ============ */}
      <div className="cv8-page cv8-page-1">
        <HeaderSection />

        <div className="cv8-content">
          {/* Left Column - 40% */}
          <div className="cv8-left-column">
            <SummarySection />
            <EducationSection />
            <ExperienceSection />
          </div>

          {/* Right Column - 60% */}
          <div className="cv8-right-column">
            <SkillsSection />
          </div>
        </div>
      </div>

      {/* ============ PAGE 2 ============ */}
      <div className="cv8-page cv8-page-2">
        <div className="cv8-content">
          {/* Left Column - 40% */}
          <div className="cv8-left-column">
            <ProjectsSection />
            <InterestSection />
            <CertificationsSection />
          </div>

          {/* Right Column - 60% */}
          <div className="cv8-right-column">
            <AwardSection />
            <AchievementSection />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Global Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .cv8-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 16px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.4;
          background: #f5f5f5;
        }

        /* Page Styles */
        .cv8-page {
 width: 210mm;
  min-height: 297mm;
  background: white;
  margin: 0 auto 10px;
  padding: 15mm;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  position: relative;
  page-break-after: always;
  overflow: hidden;
}
        .cv8-page:last-child {
          page-break-after: auto;
          margin-bottom: 0;
        }

        /* Page number indicator */
        .cv8-page::after {
          content: "Page " attr(class);
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 12px;
          color: #666;
          font-style: italic;
        }

        .cv8-page-1::after {
          content: "Page 1";
        }

        .cv8-page-2::after {
          content: "Page 2";
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
          border-top: 2px solid #3498db;
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
          color: #e74c3c;
        }

        /* Print Button */
        .cv8-print-button-container {
          text-align: center;
          margin-bottom: 16px;
        }

        .cv8-print-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
        }

        .cv8-print-button:hover {
          background-color: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }

        .cv8-print-icon {
          font-size: 18px;
        }

        /* Header Section */
        .cv8-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #3498db;
          text-align: center;
        }

        .cv8-header-content {
          width: 100%;
        }

        .cv8-name {
          font-size: 2.2rem;
          font-weight: bold;
          line-height: 1.2;
          margin-bottom: 12px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cv8-designation {
          font-size: 1.5rem;
          color: #3498db;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .cv8-contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
        }

        .cv8-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8f9fa;
          padding: 2px 4px;
          border-radius: 25px;
          border: 1px solid #e9ecef;
        }

        .cv8-contact-icon {
          font-size: 16px;
        }

        .cv8-contact-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* CV Content Layout */
        .cv8-content {
          display: flex;
          gap: 24px;
          flex-direction: column;
        }

        .cv8-left-column .cv8-right-column {
          flex: 1;
          width: 100%;
        }

        .cv8-section {
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }

        .cv8-section-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #3498db;
          border-bottom: 2px solid #3498db;
          padding-bottom: 8px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Summary */
        .cv8-summary-text {
          line-height: 1.6;
          font-size: 0.85rem;
          text-align: justify;
          color: #555;
        }

        /* Skills */
        .cv8-skill-item {
          margin-bottom: 12px;
        }

        .cv8-skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .cv8-skill-name {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .cv8-skill-rating {
          font-size: 0.8rem;
          color: #666;
        }

        .cv8-skill-bar {
          width: 100%;
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .cv8-skill-progress {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2980b9);
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        /* Education */
        .cv8-education-item {
          margin-bottom: 20px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .cv8-education-course {
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 6px;
          color: #2c3e50;
        }

        .cv8-education-college {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 6px;
        }

        .cv8-education-dates {
          font-size: 0.8rem;
          font-style: italic;
          color: #666;
          margin-bottom: 6px;
        }

        .cv8-education-grade {
          font-size: 0.8rem;
          color: #555;
          font-weight: 500;
        }

        /* Awards */
        .cv8-award-item {
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #e74c3c;
        }

        .cv8-award-title {
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 6px;
          color: #2c3e50;
        }

        .cv8-award-issuer {
          font-size: 0.85rem;
          color: #3498db;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .cv8-award-date {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 6px;
        }

        .cv8-award-description {
          font-size: 0.8rem;
          color: #555;
          line-height: 1.5;
        }

        /* Interests */
        .cv8-interests-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cv8-interest-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e8f4fd;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid #bde0fe;
        }

        .cv8-interest-icon {
          font-size: 16px;
        }

        .cv8-interest-text {
          font-weight: 500;
          color: #2c3e50;
        }

        /* Achievements */
        .cv8-achievements-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cv8-achievement-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
        }

        .cv8-achievement-icon {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .cv8-achievement-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #555;
        }

        /* Certifications */
        .cv8-certification-item {
          margin-bottom: 14px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #27ae60;
        }

        .cv8-certification-name {
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: #2c3e50;
        }

        .cv8-certification-institute {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 6px;
        }

        .cv8-certification-date {
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
        }

        /* Links */
        .cv8-link-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          padding: 6px 0;
          flex-direction: column;
        }

        .cv8-link-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .cv8-link-url {
          font-size: 0.85rem;
          word-break: break-all;
          color: #3498db;
          text-decoration: none;
        }

        .cv8-link-url:hover {
          text-decoration: underline;
          cursor: pointer;
        }

        /* Experience */
        .cv8-experience-item {
          margin-bottom: 20px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .cv8-experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .cv8-experience-title {
          font-size: 0.9rem;
          font-weight: bold;
          color: #2c3e50;
        }
          
        .cv8-experience-dates {
          font-size: 0.8rem;
          color: #666;
          font-style: italic;
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .cv8-experience-company {
          font-size: 0.85rem;
          color: #3498db;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .cv8-experience-description {
          line-height: 1.5;
          font-size: 0.85rem;
          color: #555;
        }

        /* Projects */
        .cv8-project-item {
          margin-bottom: 20px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #9b59b6;
        }

        .cv8-project-name {
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .cv8-project-description {
          line-height: 1.5;
          font-size: 0.85rem;
          margin-bottom: 10px;
          color: #555;
        }

        .cv8-technologies-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }

        .cv8-technology-tag {
          border: 1px solid #ddd;
          border-radius: 15px;
          padding: 4px 12px;
          font-size: 0.75rem;
          background: white;
          color: #555;
          font-weight: 500;
        }

        /* Divider */
        .cv8-divider {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 16px 0;
        }

        /* Additional Info */
        .cv8-additional-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #666;
          margin-top: 30px;
          padding-top: 16px;
          border-top: 2px solid #ddd;
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 8px;
        }
      @media print {
        @page {
          size: A4;
          margin: 0;
        }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Hide everything except the CV */
        body * {
          visibility: hidden !important;
        }

        .cv8-container, .cv8-container * {
          visibility: visible !important;
        }

        .cv8-container {
          position: static !important;
    max-width: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: white !important;
    box-shadow: none !important;
        }

        .cv8-page {
        width: 210mm !important;
    min-height: 297mm !important;
    height: auto !important;
    background: white !important;
    margin: 0 auto 0 !important;
    padding: 15mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    overflow: hidden !important;
        }

        .cv8-page:last-child {
          page-break-after: auto !important;
        }

        /* Hide print buttons and page indicators */
        .cv8-print-button-container,
        .cv8-page::after {
          display: none !important;
          visibility: hidden !important;
        }

        /* Prevent unwanted element splits */
        .cv8-section,
        .cv8-experience-item,
        .cv8-education-item,
        .cv8-project-item,
        .cv8-certification-item {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }


          /* --- Page Layout --- */
          .cv8-content {
            display: flex !important;
            gap: 20px !important;
          }


          /* --- Page Setup --- */
          @page {
            size: A4;
            margin: 0;
          }

          @page :first {
            margin-top: 0;
          }

          @page :last {
            margin-bottom: 0;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cv8-container {
            padding: 8px;
          }
          @page {
            size: A4;
            margin: 0;
          }

          .cv8-page {
            width: 100%;
            min-height: auto;
            padding: 15px;
            margin-bottom: 15px;
          }

          .cv8-content {
            flex-direction: column;
            gap: 20px;
          }

          .cv8-left-column,
          .cv8-right-column {
            flex: 1;
          }

          .cv8-contact-info {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .cv8-contact-item {
            justify-content: center;
            width: 100%;
            max-width: 300px;
          }

          .cv8-name {
            font-size: 1.8rem;
          }

          .cv8-designation {
            font-size: 1.3rem;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .cv8-container {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Cv8;
