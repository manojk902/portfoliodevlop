import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";
import printJS from "print-js";

const Cv2 = ({ UserDataFromDesignPage }) => {
  const componentRef = useRef();

  const [searchParams] = useSearchParams({ UserDataFromDesignPage });
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const userProfile = useSelector(
    (state) => state.userProfile?.data?.fetchedUsed
  );
  const userNameRedux = userProfile?.userName;

  // --- 2. State Management ---
  const [cvData, setCvData] = useState(null);
  const [, setLoading] = useState(true);

  // PRINT-JS PRINT FUNCTION - Single continuous layout
  const handlePrint = () => {
    if (!componentRef.current) {
      console.error("CV content not found");
      return;
    }

    // Get the HTML content
    const printContent = componentRef.current.innerHTML;

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
          margin: 15mm;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
          line-height: 1.5;
          color: #333;
        }
        .cv2-container {
          width: 210mm !important;
          margin: 0 auto !important;
          background: white !important;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important;
          line-height: 1.5 !important;
          color: #333 !important;
          padding: 0 !important;
        }
        .cv2-content {
          width: 210mm !important;
          background: white !important;
          margin: 0 auto !important;
          padding: 0 !important;
          min-height: 297mm !important;
        }
        .cv2-print-button-container {
          display: none !important;
        }
        .cv2-personal-info {
          text-align: center !important;
          margin-bottom: 25px !important;
          padding-bottom: 20px !important;
          border-bottom: 2px solid #2c3e50 !important;
        }
        .cv2-name {
          font-size: 32px !important;
          font-weight: bold !important;
          margin: 0 0 8px 0 !important;
          color: #2c3e50 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
        }
        .cv2-designation {
          font-size: 18px !important;
          color: #666 !important;
          margin-bottom: 15px !important;
          font-weight: 500 !important;
        }
        .cv2-contact-info {
          display: flex !important;
          justify-content: center !important;
          gap: 25px !important;
          flex-wrap: wrap !important;
          margin-bottom: 12px !important;
          font-size: 14px !important;
        }
        .cv2-social-links {
          display: flex !important;
          justify-content: center !important;
          gap: 20px !important;
          flex-wrap: wrap !important;
          font-size: 13px !important;
        }
        .cv2-social-link {
          word-break: break-all !important;
        }
        .cv2-section {
          margin-bottom: 25px !important;
          page-break-inside: avoid !important;
        }
        .cv2-section-title {
          font-size: 18px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          border-bottom: 2px solid #2c3e50 !important;
          padding-bottom: 6px !important;
          margin-bottom: 15px !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
        }
        .cv2-summary-text {
          text-align: justify !important;
          color: #444 !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        .cv2-experience-item {
          margin-bottom: 20px !important;
          page-break-inside: avoid !important;
        }
        .cv2-job-header {
          margin-bottom: 10px !important;
        }
        .cv2-job-title-row {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 5px !important;
        }
        .cv2-job-title {
          font-size: 16px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          margin: 0 !important;
        }
        .cv2-job-dates {
          font-size: 13px !important;
          color: #666 !important;
          font-style: italic !important;
          white-space: nowrap !important;
        }
        .cv2-job-company {
          font-size: 14px !important;
          color: #666 !important;
          font-weight: 500 !important;
        }
        .cv2-job-description {
          font-size: 13px !important;
          line-height: 1.5 !important;
        }
        .cv2-education-item {
          margin-bottom: 18px !important;
          page-break-inside: avoid !important;
        }
        .cv2-education-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 5px !important;
        }
        .cv2-education-course {
          font-size: 16px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          margin: 0 !important;
        }
        .cv2-education-dates {
          font-size: 13px !important;
          color: #666 !important;
          font-style: italic !important;
          white-space: nowrap !important;
        }
        .cv2-education-college {
          font-size: 14px !important;
          color: #666 !important;
          font-weight: 500 !important;
          margin-bottom: 8px !important;
        }
        .cv2-education-details {
          font-size: 13px !important;
          color: #555 !important;
        }
        .cv2-education-details div {
          margin-bottom: 3px !important;
        }
        .cv2-project-item {
          margin-bottom: 18px !important;
          page-break-inside: avoid !important;
        }
        .cv2-project-header {
          margin-bottom: 8px !important;
        }
        .cv2-project-name {
          font-size: 16px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          margin: 0 0 5px 0 !important;
        }
        .cv2-project-technologies {
          font-size: 13px !important;
          color: #666 !important;
          margin-bottom: 8px !important;
        }
        .cv2-project-description {
          font-size: 13px !important;
          line-height: 1.5 !important;
          margin-bottom: 8px !important;
        }
        .cv2-project-url {
          font-size: 13px !important;
          color: #666 !important;
        }
        .cv2-certification-item {
          margin-bottom: 15px !important;
          page-break-inside: avoid !important;
        }
        .cv2-certification-name {
          font-size: 16px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          margin: 0 0 5px 0 !important;
        }
        .cv2-certification-institute {
          font-size: 14px !important;
          color: #666 !important;
          font-weight: 500 !important;
          margin-bottom: 3px !important;
        }
        .cv2-certification-date {
          font-size: 13px !important;
          color: #888 !important;
          font-style: italic !important;
        }
        .cv2-skills-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .cv2-skill-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }
        .cv2-skill-name {
          font-weight: bold !important;
          font-size: 14px !important;
          color: #333 !important;
        }
        .cv2-skill-rating {
          display: flex !important;
          gap: 3px !important;
        }
        .cv2-star {
          color: #ddd !important;
          font-size: 14px !important;
        }
        .cv2-star.cv2-filled {
          color: #2c3e50 !important;
        }
        .cv2-languages-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .cv2-language-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }
        .cv2-language-name {
          font-weight: bold !important;
          font-size: 14px !important;
          color: #333 !important;
        }
        .cv2-language-proficiency {
          font-size: 13px !important;
          color: #2c3e50 !important;
        }
        .cv2-achievements-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .cv2-achievement-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
        }
        .cv2-achievement-icon {
          font-size: 14px !important;
          flex-shrink: 0 !important;
        }
        .cv2-achievement-text {
          font-size: 14px !important;
          line-height: 1.4 !important;
          color: #333 !important;
        }
        .cv2-interests-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .cv2-interest-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
        }
        .cv2-interest-icon {
          font-size: 14px !important;
          flex-shrink: 0 !important;
        }
        .cv2-interest-text {
          font-size: 14px !important;
          line-height: 1.4 !important;
          color: #333 !important;
        }
        .cv2-award-item {
          margin-bottom: 18px !important;
          page-break-inside: avoid !important;
        }
        .cv2-award-title {
          font-size: 16px !important;
          font-weight: bold !important;
          color: #2c3e50 !important;
          margin: 0 0 5px 0 !important;
        }
        .cv2-award-issuer {
          font-size: 14px !important;
          color: #666 !important;
          font-weight: 500 !important;
          margin-bottom: 3px !important;
        }
        .cv2-award-date {
          font-size: 13px !important;
          color: #888 !important;
          font-style: italic !important;
          margin-bottom: 8px !important;
        }
        .cv2-award-description {
          font-size: 13px !important;
          line-height: 1.5 !important;
          color: #555 !important;
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
                variant="p"
                sx={{
                  fontSize: { xs: "0.1rem", sm: "2.5rem" },
                  fontWeight: 400,
                  display: "inline-block",
                  animation: `fadeInOut 2s ease-in-out infinite`,
                  animationDelay: `${index * 0.12}s`,
                  color: "#1a237e",
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">SKILLS</h2>
        <div className="cv2-skills-container">
          {skillsSection.data.map((skill, i) => (
            <div key={i} className="cv2-skill-item">
              <div className="cv2-skill-name">{skill.skill}</div>
              <div className="cv2-skill-rating">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < skill.rating ? "cv2-star cv2-filled" : "cv2-star"
                    }
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">PROFESSIONAL SUMMARY</h2>
        <div className="cv2-summary-text">{summarySection.data}</div>
      </div>
    );
  };

  const ExperienceSection = () => {
    const experienceSection = cvData.sections?.find(
      (s) => s.name === "Experience"
    );
    if (!experienceSection?.data?.length) return null;

    return (
      <div className="cv2-section">
        <h2 className="cv2-section-title">WORK EXPERIENCE</h2>
        {experienceSection.data.map((exp, i) => (
          <div key={i} className="cv2-experience-item">
            <div className="cv2-job-header">
              <div className="cv2-job-title-row">
                <h3 className="cv2-job-title">{exp.jobTitle}</h3>
                <span className="cv2-job-dates">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div className="cv2-job-company">
                {exp.company} | {exp.location}
              </div>
            </div>
            <div className="cv2-job-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "13px",
                  lineHeight: "1.5",
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">EDUCATION</h2>
        {educationSection.data.map((edu, i) => (
          <div key={i} className="cv2-education-item">
            <div className="cv2-education-header">
              <h3 className="cv2-education-course">{edu.course}</h3>
              <span className="cv2-education-dates">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <div className="cv2-education-college">{edu.college}</div>
            <div className="cv2-education-details">
              {edu.fieldOfStudy && (
                <div>
                  <strong>Field:</strong> {edu.fieldOfStudy}
                </div>
              )}
              {edu.grade && (
                <div>
                  <strong>Grade:</strong> {edu.grade}
                </div>
              )}
              {edu.location && (
                <div>
                  <strong>Location:</strong> {edu.location}
                </div>
              )}
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">PROJECTS</h2>
        {projectsSection.data.map((proj, i) => (
          <div key={i} className="cv2-project-item">
            <div className="cv2-project-header">
              <h3 className="cv2-project-name">{proj.name}</h3>
              {proj.technologies?.length > 0 && (
                <div className="cv2-project-technologies">
                  <strong>Technologies:</strong> {proj.technologies.join(", ")}
                </div>
              )}
            </div>
            <div className="cv2-project-description">
              <MarkdownPreview
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
                source={proj.description || ""}
              />
            </div>
            {proj.url && (
              <div className="cv2-project-url">
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">CERTIFICATIONS</h2>
        {certificationsSection.data.map((cert, i) => (
          <div key={i} className="cv2-certification-item">
            <h3 className="cv2-certification-name">{cert.name}</h3>
            <div className="cv2-certification-institute">{cert.institute}</div>
            <div className="cv2-certification-date">
              Issued: {cert.issueDate}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const LanguageSection = () => {
    const languageSection = cvData.sections?.find((s) => s.name === "Language");
    if (!languageSection?.data?.length) return null;

    return (
      <div className="cv2-section">
        <h2 className="cv2-section-title">LANGUAGES</h2>
        <div className="cv2-languages-container">
          {languageSection.data.map((lang, i) => (
            <div key={i} className="cv2-language-item">
              <div className="cv2-language-name">{lang.language}</div>
              <div className="cv2-language-proficiency">
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">ACHIEVEMENTS</h2>
        <div className="cv2-achievements-container">
          {achievementSection.data.map((achievement, i) => (
            <div key={i} className="cv2-achievement-item">
              <span className="cv2-achievement-icon">🏆</span>
              <span className="cv2-achievement-text">{achievement}</span>
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">INTERESTS</h2>
        <div className="cv2-interests-container">
          {interestSection.data.map((interest, i) => (
            <div key={i} className="cv2-interest-item">
              <span className="cv2-interest-icon">🎯</span>
              <span className="cv2-interest-text">{interest}</span>
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
      <div className="cv2-section">
        <h2 className="cv2-section-title">AWARDS</h2>
        {awardSection.data.map((award, i) => (
          <div key={i} className="cv2-award-item">
            <h3 className="cv2-award-title">{award.title}</h3>
            <div className="cv2-award-issuer">{award.issuer}</div>
            <div className="cv2-award-date">{award.date}</div>
            {award.description && (
              <div className="cv2-award-description">{award.description}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Print Button Component
  const PrintButton = () => (
    <div className="cv2-print-button-container">
      <button className="cv2-print-button" onClick={handlePrint}>
        🖨️ Print CV
      </button>
    </div>
  );

  // SINGLE CONTINUOUS CV CONTENT - No page division in browser
  const CVContent = () => {
    return (
      <div className="cv2-container" ref={componentRef}>
        <div className="cv2-content">
          {/* Personal Info Header */}
          <div className="cv2-personal-info">
            <h1 className="cv2-name">
              {cvData.firstName} {cvData.lastName}
            </h1>
            <div className="cv2-designation">{cvData.designation}</div>
            <div className="cv2-contact-info">
              <span>📧 {cvData.email}</span>
              <span>📱 {cvData.phoneNo}</span>
              <span>
                📍 {cvData.address?.city}, {cvData.address?.state}
              </span>
            </div>
            {cvData.socialLinks?.length > 0 && (
              <div className="cv2-social-links">
                {cvData.socialLinks.map((link, i) => (
                  <span key={i} className="cv2-social-link">
                    {getSocialIcon(link)} {link}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ProfessionalSummary />
          <ExperienceSection />
          <EducationSection />
          <ProjectsSection />
          <CertificationsSection />
          <SkillsSection />
          <LanguageSection />
          <AwardSection />
          <AchievementSection />
          <InterestSection />
        </div>
      </div>
    );
  };

  return (
    <Box>
      {/* Print Button */}
      <PrintButton />

      {/* CV Content - Single continuous layout */}
      <CVContent />

      {/* CSS Styles */}
      <style jsx>{`
        /* === GLOBAL STYLES === */
        .cv2-container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
          line-height: 1.5;
          color: #333;
        }

        /* Single continuous content - no page division */
        .cv2-content {
          width: 210mm;
          background: white;
          margin: 0 auto;
          padding: 20mm;
          position: relative;
        }

        /* Print Button */
        .cv2-print-button-container {
          text-align: center;
          padding: 20px;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }

        .cv2-print-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
          background-color: #2563eb;
          color: white;
          font-family: inherit;
        }

        .cv2-print-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Personal Info */
        .cv2-personal-info {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2c3e50;
        }

        .cv2-name {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cv2-designation {
          font-size: 18px;
          color: #666;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .cv2-contact-info {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .cv2-social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
        }

        .cv2-social-link {
          word-break: break-all;
        }

        /* Section Styles */
        .cv2-section {
          margin-bottom: 25px;
        }

        .cv2-section-title {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 6px;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Summary */
        .cv2-summary-text {
          text-align: justify;
          color: #444;
          font-size: 14px;
          line-height: 1.6;
        }

        /* Experience */
        .cv2-experience-item {
          margin-bottom: 20px;
        }

        .cv2-job-header {
          margin-bottom: 10px;
        }

        .cv2-job-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }

        .cv2-job-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .cv2-job-dates {
          font-size: 13px;
          color: #666;
          font-style: italic;
          white-space: nowrap;
        }

        .cv2-job-company {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .cv2-job-description {
          font-size: 13px;
          line-height: 1.5;
        }

        /* Education */
        .cv2-education-item {
          margin-bottom: 18px;
        }

        .cv2-education-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }

        .cv2-education-course {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .cv2-education-dates {
          font-size: 13px;
          color: #666;
          font-style: italic;
          white-space: nowrap;
        }

        .cv2-education-college {
          font-size: 14px;
          color: #666;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .cv2-education-details {
          font-size: 13px;
          color: #555;
        }

        .cv2-education-details div {
          margin-bottom: 3px;
        }

        /* Projects */
        .cv2-project-item {
          margin-bottom: 18px;
        }

        .cv2-project-header {
          margin-bottom: 8px;
        }

        .cv2-project-name {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 5px 0;
        }

        .cv2-project-technologies {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .cv2-project-description {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .cv2-project-url {
          font-size: 13px;
          color: #666;
        }

        /* Certifications */
        .cv2-certification-item {
          margin-bottom: 15px;
        }

        .cv2-certification-name {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 5px 0;
        }

        .cv2-certification-institute {
          font-size: 14px;
          color: #666;
          font-weight: 500;
          margin-bottom: 3px;
        }

        .cv2-certification-date {
          font-size: 13px;
          color: #888;
          font-style: italic;
        }

        /* Skills */
        .cv2-skills-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cv2-skill-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cv2-skill-name {
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }

        .cv2-skill-rating {
          display: flex;
          gap: 3px;
        }

        .cv2-star {
          color: #ddd;
          font-size: 14px;
        }

        .cv2-star.cv2-filled {
          color: #2c3e50;
        }

        /* Languages */
        .cv2-languages-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cv2-language-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cv2-language-name {
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }

        .cv2-language-proficiency {
          font-size: 13px;
          color: #2c3e50;
        }

        /* Achievements */
        .cv2-achievements-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cv2-achievement-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cv2-achievement-icon {
          font-size: 14px;
          flex-shrink: 0;
        }

        .cv2-achievement-text {
          font-size: 14px;
          line-height: 1.4;
          color: #333;
        }

        /* Interests */
        .cv2-interests-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cv2-interest-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cv2-interest-icon {
          font-size: 14px;
          flex-shrink: 0;
        }

        .cv2-interest-text {
          font-size: 14px;
          line-height: 1.4;
          color: #333;
        }

        /* Awards */
        .cv2-award-item {
          margin-bottom: 18px;
        }

        .cv2-award-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 5px 0;
        }

        .cv2-award-issuer {
          font-size: 14px;
          color: #666;
          font-weight: 500;
          margin-bottom: 3px;
        }

        .cv2-award-date {
          font-size: 13px;
          color: #888;
          font-style: italic;
          margin-bottom: 8px;
        }

        .cv2-award-description {
          font-size: 13px;
          line-height: 1.5;
          color: #555;
        }

        /* === SCREEN STYLES === */
        @media screen {
          .cv2-container {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
        }

        /* === RESPONSIVE DESIGN === */
        @media (max-width: 768px) {
          .cv2-content {
            width: 100%;
            padding: 15px;
          }

          .cv2-contact-info {
            flex-direction: column;
            gap: 8px;
          }

          .cv2-social-links {
            flex-direction: column;
            gap: 8px;
          }

          .cv2-job-title-row {
            flex-direction: column;
            gap: 5px;
          }

          .cv2-education-header {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </Box>
  );
};

export default Cv2;
