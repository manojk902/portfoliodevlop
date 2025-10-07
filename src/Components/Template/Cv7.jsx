/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";

const Cv7 = ({ UserDataFromDesignPage }) => {
  const componentRef = useRef();

  // --- 1. Identify Context (URL & Redux) ---
  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");

  const userProfile = useSelector(
    (state) => state.userProfile?.data?.fetchedUsed
  );
  const userNameRedux = userProfile?.userName;

  // --- 2. State Management ---
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  // SIMPLE PRINT FUNCTION - NO RELOAD
  const handlePrint = () => {
    window.print();
  };

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
      } else if (userNameRedux) {
        usernameToFetch = userNameRedux;
      }

      if (usernameToFetch) {
        try {
          const res = await axios.get(`${apiUrl}/defaultCv/${usernameToFetch}`);
          setCvData(res?.data?.fetchedCvInfo?.defaultCvInfo);
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

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Loading CV...
        </Typography>
      </Box>
    );
  }

  if (!cvData) {
    return (
      <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <Typography color="error">
          No CV data available for this user.
        </Typography>
      </Box>
    );
  }

  // Function to determine icon for social links
  const getSocialIcon = (url) => {
    if (url.includes("linkedin")) return "🔗";
    if (url.includes("github")) return "🐱";
    return "🌐";
  };

  // Individual Section Components
  const SkillsSection = () => {
    const skillsSection = cvData.sections?.find((s) => s.name === "Skill");
    if (!skillsSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">SKILLS</h2>
        <div className="skills-container">
          {skillsSection.data.map((skill, i) => (
            <div key={i} className="skill-item">
              <div className="skill-name">{skill.skill}</div>
              <div className="skill-rating">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={index < skill.rating ? "star filled" : "star"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProfessionalSummary = () => {
    const summarySection = cvData.sections?.find((s) => s.name === "Summary");
    if (!summarySection?.data) return null;

    return (
      <div className="section">
        <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
        <div className="summary-text">{summarySection.data}</div>
      </div>
    );
  };

  const ExperienceSection = () => {
    const experienceSection = cvData.sections?.find(
      (s) => s.name === "Experience"
    );
    if (!experienceSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">WORK EXPERIENCE</h2>
        {experienceSection.data.map((exp, i) => (
          <div key={i} className="experience-item">
            <div className="job-header">
              <h3 className="job-title">{exp.jobTitle}</h3>
              <div className="job-company">
                {exp.company} | {exp.location}
              </div>
              <div className="job-dates">
                {exp.startDate} - {exp.endDate}
              </div>
            </div>
            <div className="job-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontFamily: "Arial, sans-serif",
                }}
                source={exp.description || ""}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const EducationSection = () => {
    const educationSection = cvData.sections?.find(
      (s) => s.name === "Education"
    );
    if (!educationSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">EDUCATION</h2>
        {educationSection.data.map((edu, i) => (
          <div key={i} className="education-item">
            <h3 className="education-course">{edu.course}</h3>
            <div className="education-college">{edu.college}</div>
            <div className="education-dates">
              {edu.startDate} - {edu.endDate}
            </div>
            <div className="education-details">
              <div>
                <strong>Field:</strong> {edu.fieldOfStudy}
              </div>
              <div>
                <strong>Grade:</strong> {edu.grade}
              </div>
              <div>
                <strong>Location:</strong> {edu.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ProjectsSection = () => {
    const projectsSection = cvData.sections?.find((s) => s.name === "Project");
    if (!projectsSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">PROJECTS</h2>
        {projectsSection.data.map((proj, i) => (
          <div key={i} className="project-item">
            <h3 className="project-name">{proj.name}</h3>
            <div className="project-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontFamily: "Arial, sans-serif",
                }}
                source={proj.description || ""}
              />
            </div>
            {proj.technologies?.length > 0 && (
              <div className="project-technologies">
                <strong>Technologies:</strong> {proj.technologies.join(", ")}
              </div>
            )}
            {proj.url && (
              <div className="project-url">
                <strong>URL:</strong> {proj.url}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const CertificationsSection = () => {
    const certificationsSection = cvData.sections?.find(
      (s) => s.name === "Certification"
    );
    if (!certificationsSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">CERTIFICATIONS</h2>
        {certificationsSection.data.map((cert, i) => (
          <div key={i} className="certification-item">
            <h3 className="certification-name">{cert.name}</h3>
            <div className="certification-institute">{cert.institute}</div>
            <div className="certification-date">Issued: {cert.issueDate}</div>
          </div>
        ))}
      </div>
    );
  };

  // NEW SECTIONS - Language, Achievement, Interest, Award
  const LanguageSection = () => {
    const languageSection = cvData.sections?.find((s) => s.name === "Language");
    if (!languageSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">LANGUAGES</h2>
        <div className="languages-container">
          {languageSection.data.map((lang, i) => (
            <div key={i} className="language-item">
              <div className="language-name">{lang.language}</div>
              <div className="language-proficiency">
                {lang.proficiency === "excellent" && "★★★★★"}
                {lang.proficiency === "good" && "★★★★☆"}
                {lang.proficiency === "normal" && "★★★☆☆"}
                {lang.proficiency === "basic" && "★★☆☆☆"}
                {lang.proficiency === "beginner" && "★☆☆☆☆"}
                {!["excellent", "good", "normal", "basic", "beginner"].includes(
                  lang.proficiency
                ) && lang.proficiency}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AchievementSection = () => {
    const achievementSection = cvData.sections?.find(
      (s) => s.name === "Achievement"
    );
    if (!achievementSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">ACHIEVEMENTS</h2>
        <div className="achievements-container">
          {achievementSection.data.map((achievement, i) => (
            <div key={i} className="achievement-item">
              <span className="achievement-icon">🏆</span>
              <span className="achievement-text">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const InterestSection = () => {
    const interestSection = cvData.sections?.find((s) => s.name === "Interest");
    if (!interestSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">INTERESTS</h2>
        <div className="interests-container">
          {interestSection.data.map((interest, i) => (
            <div key={i} className="interest-item">
              <span className="interest-icon">🎯</span>
              <span className="interest-text">{interest}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AwardSection = () => {
    const awardSection = cvData.sections?.find((s) => s.name === "Award");
    if (!awardSection?.data?.length) return null;

    return (
      <div className="section">
        <h2 className="section-title">AWARDS</h2>
        {awardSection.data.map((award, i) => (
          <div key={i} className="award-item">
            <h3 className="award-title">{award.title}</h3>
            <div className="award-issuer">{award.issuer}</div>
            <div className="award-date">{award.date}</div>
            {award.description && (
              <div className="award-description">{award.description}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // CV Content - Single source for both screen and print
  const CVContent = () => (
    <div className="cv-container" ref={componentRef}>
      {/* Page 1 */}
      <div className="cv-page page-1">
        <div className="page-label no-print">Page 1</div>

        {/* Personal Info Header */}
        <div className="personal-info">
          <h1 className="name">
            {cvData.firstName} {cvData.lastName}
          </h1>
          <div className="designation">{cvData.designation}</div>
          <div className="contact-info">
            <span>📧 {cvData.email}</span>
            <span>📱 {cvData.phoneNo}</span>
            <span>
              📍 {cvData.address?.city}, {cvData.address?.state}
            </span>
          </div>
          {cvData.socialLinks?.length > 0 && (
            <div className="social-links">
              {cvData.socialLinks.map((link, i) => (
                <span key={i} className="social-link">
                  {getSocialIcon(link)} {link}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="page-content">
          <div className="left-column">
            <SkillsSection />
            <LanguageSection />
            <InterestSection />
          </div>

          <div className="right-column">
            <ProfessionalSummary />
            <ExperienceSection />
          </div>
        </div>
      </div>

      {/* Page 2 - Only show if there's content for it */}
      {(cvData.sections?.find((s) => s.name === "Education")?.data?.length >
        0 ||
        cvData.sections?.find((s) => s.name === "Project")?.data?.length > 0 ||
        cvData.sections?.find((s) => s.name === "Certification")?.data?.length >
          0 ||
        cvData.sections?.find((s) => s.name === "Achievement")?.data?.length >
          0 ||
        cvData.sections?.find((s) => s.name === "Award")?.data?.length > 0) && (
        <div className="cv-page page-2">
          <div className="page-label no-print">Page 2</div>
          <div className="page-content">
            <div className="left-column">
              <EducationSection />
              <AchievementSection />
            </div>
            <div className="right-column">
              <ProjectsSection />
              <CertificationsSection />
              <AwardSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Box>
      {/* Simple Print Button Only */}
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
        className="no-print"
      >
        <button onClick={handlePrint} className="print-button">
          🖨️ Print CV
        </button>
      </Box>

      {/* CV Content - Same for both screen and print */}
      <CVContent />

      {/* CSS Styles */}
      <style jsx>{`
        /* === SCREEN STYLES === */
        .cv-container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          position: relative;
        }

        .cv-page {
          width: 100%;
          min-height: 297mm;
          padding: 15mm;
          background: white;
          box-sizing: border-box;
          font-family: "Arial", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
          position: relative;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          /* Ensure pages stack vertically on screen */
          display: block;
        }

        .cv-container {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        /* Page Label */
        .page-label {
          position: absolute;
          top: 10px;
          right: 15mm;
          font-size: 12px;
          color: #666;
          font-weight: bold;
        }

        /* Personal Info */
        .personal-info {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #2c3e50;
        }

        .name {
          font-size: 28px;
          font-weight: bold;
          margin: 0 0 5px 0;
          color: #2c3e50;
        }

        .designation {
          font-size: 18px;
          color: #666;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .contact-info span {
          white-space: nowrap;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          font-size: 12px;
        }

        .social-link {
          word-break: break-all;
        }

        .page-content {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }

        .left-column {
          flex: 1;
          max-width: 35%;
        }

        .right-column {
          flex: 2;
          max-width: 65%;
        }

        /* Sections */
        .section {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          border-bottom: 1px solid #2c3e50;
          padding-bottom: 3px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        /* Languages */
        .languages-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .language-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .language-name {
          font-weight: bold;
          font-size: 13px;
        }

        .language-proficiency {
          font-size: 12px;
          color: #2c3e50;
        }

        /* Achievements */
        .achievements-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .achievement-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .achievement-text {
          font-size: 13px;
          line-height: 1.4;
        }

        /* Interests */
        .interests-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .interest-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .interest-text {
          font-size: 13px;
          line-height: 1.4;
        }

        /* Awards */
        .award-item {
          margin-bottom: 15px;
        }

        .award-title {
          font-size: 15px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 5px 0;
        }

        .award-issuer {
          font-size: 13px;
          color: #666;
          font-weight: 500;
          margin-bottom: 3px;
        }

        .award-date {
          font-size: 12px;
          color: #888;
          font-style: italic;
          margin-bottom: 6px;
        }

        .award-description {
          font-size: 13px;
          line-height: 1.5;
        }

        /* Skills */
        .skills-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name {
          font-weight: bold;
          font-size: 13px;
        }

        .skill-rating {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #ddd;
          font-size: 12px;
        }

        .star.filled {
          color: #2c3e50;
        }

        /* Experience & Education */
        .experience-item,
        .education-item,
        .project-item,
        .certification-item {
          margin-bottom: 15px;
        }

        .job-title,
        .education-course,
        .project-name,
        .certification-name {
          font-size: 15px;
          font-weight: bold;
          color: #2c3e50;
        }

        .job-company,
        .education-college,
        .certification-institute {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .job-dates,
        .education-dates,
        .certification-date {
          font-size: 12px;
          color: #888;
          font-style: italic;
          margin-bottom: 6px;
        }

        .summary-text {
          font-size: 13px;
          line-height: 1.5;
          text-align: justify;
        }

        /* Print Button */
        .print-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background-color 0.3s;
          background-color: #2c3e50;
          color: white;
        }

        .print-button:hover {
          background-color: #1a252f;
        }

        /* === PRINT STYLES === */
        @media print {
          header,
          footer,
          .site-header,
          .site-footer,
          .footer,
          .no-print {
            display: none !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .cv-container {
            width: 210mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            background: white !important;
          }

          .cv-page {
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            padding: 15mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
            /* Reset display for print */
            display: block !important;
            /* Prevent extra pages */
            overflow: hidden !important;
          }

          .cv-page:last-child {
            page-break-after: auto !important;
          }

          /* Prevent empty pages */
          .cv-page:empty {
            display: none !important;
          }

          /* Prevent content from breaking */
          .section {
            page-break-inside: avoid;
          }

          .experience-item,
          .education-item,
          .project-item {
            page-break-inside: avoid;
          }

          @page {
            margin: 0;
            size: A4;
          }
        }

        /* === SCREEN MEDIA QUERY for proper page display === */
        @media screen {
          .cv-page {
            /* Ensure proper A4 aspect ratio on screen */
            height: auto;
            min-height: 297mm;
            /* Add visual separation between pages */
            border: 1px solid #e0e0e0;
          }
        }
      `}</style>
    </Box>
  );
};

export default Cv7;
