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

const Cv6 = ({ UserDataFromDesignPage }) => {
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
          margin: 15mm;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif !important;
          line-height: 1.5 !important;
          color: #2c3e50 !important;
        }
        .cv6-container {
          max-width: 210mm !important;
          margin: 0 auto !important;
          background: white !important;
          font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif !important;
          line-height: 1.5 !important;
          color: #2c3e50 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .cv6-content {
          width: 210mm !important;
          background: white !important;
          margin: 0 auto !important;
          padding: 0 !important;
        }
        .cv6-print-button-container {
          display: none !important;
        }
        .cv6-header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
          color: white !important;
          padding: 15px 40px !important;
          margin-bottom: 0 !important;
          text-align: center !important;
        }
        .cv6-name-section {
          text-align: center !important;
        }
        .cv6-name {
          font-size: 42px !important;
          font-weight: 700 !important;
          line-height: 1.1 !important;
          margin-bottom: 10px !important;
          color: white !important;
          text-transform: uppercase !important;
          letter-spacing: 3px !important;
        }
        .cv6-last-name {
          font-weight: 300 !important;
          color: #ecf0f1 !important;
        }
        .cv6-designation {
          font-size: 20px !important;
          color: #bdc3c7 !important;
          font-weight: 400 !important;
          margin: 0 0 25px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 2px !important;
        }
        .cv6-contact-section {
          display: flex !important;
          padding-top: 0px !important;
          padding-bottom: 0px !important;
          margin-bottom: 15px !important;
          justify-content: center !important;
          gap: 46px !important;
          flex-wrap: wrap !important;
        }
        .cv6-contact-item {
          font-size: 14px !important;
          color: #ecf0f1 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .cv6-link-url {
          color: #ecf0f1 !important;
          text-decoration: none !important;
        }
        .cv6-main-content {
          padding: 40px !important;
        }
        .cv6-section {
          margin-bottom: 35px !important;
          page-break-inside: avoid !important;
        }
        .cv6-section:last-child {
          margin-bottom: 0 !important;
        }
        .cv6-section-title {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #2c3e50 !important;
          margin-bottom: 20px !important;
          text-transform: uppercase !important;
          letter-spacing: 2px !important;
          border-bottom: 3px solid #e74c3c !important;
          padding-bottom: 10px !important;
          position: relative !important;
        }
        .cv6-section-title::after {
          content: '' !important;
          position: absolute !important;
          bottom: -3px !important;
          left: 0 !important;
          width: 80px !important;
          height: 3px !important;
          background: #3498db !important;
        }
        .cv6-section-content {
          padding-left: 0 !important;
        }
        .cv6-summary-text {
          line-height: 1.7 !important;
          font-size: 16px !important;
          text-align: left !important;
          color: #34495e !important;
          margin: 0 !important;
          hyphens: auto !important;
        }
        .cv6-experience-item {
          margin-bottom: 25px !important;
          page-break-inside: avoid !important;
          padding: 25px !important;
          background: #f8f9fa !important;
          border-radius: 10px !important;
          border-left: 5px solid #e74c3c !important;
        }
        .cv6-experience-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 15px !important;
        }
        .cv6-experience-title-container {
          flex: 1 !important;
        }
        .cv6-experience-title {
          font-size: 20px !important;
          font-weight: 600 !important;
          color: #2c3e50 !important;
          margin: 0 0 8px 0 !important;
        }
        .cv6-experience-company {
          font-size: 16px !important;
          color: #e74c3c !important;
          display: block !important;
          font-weight: 500 !important;
        }
        .cv6-experience-dates {
          font-size: 14px !important;
          color: #7f8c8d !important;
          font-style: italic !important;
          white-space: nowrap !important;
          margin-left: 20px !important;
          background: white !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          border: 1px solid #e9ecef !important;
        }
        .cv6-experience-description {
          line-height: 1.7 !important;
          font-size: 15px !important;
          color: #34495e !important;
          margin: 0 !important;
        }
        .cv6-project-item {
          margin-bottom: 20px !important;
          page-break-inside: avoid !important;
          padding: 20px !important;
          background: #f8f9fa !important;
          border-radius: 10px !important;
          border: 2px solid #e9ecef !important;
        }
        .cv6-project-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 12px !important;
        }
        .cv6-project-name {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #2c3e50 !important;
          margin: 0 0 8px 0 !important;
          flex: 1 !important;
        }
        .cv6-technologies-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          justify-content: flex-start !important;
          margin-top: 12px !important;
        }
        .cv6-technology-tag {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
          color: #ffffff !important;
          padding: 6px 12px !important;
          border-radius: 20px !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          font-weight: 500 !important;
        }
        .cv6-project-description {
          line-height: 1.7 !important;
          font-size: 15px !important;
          color: #34495e !important;
          margin: 0 !important;
        }
        .cv6-education-item {
          margin-bottom: 20px !important;
          page-break-inside: avoid !important;
          padding: 20px !important;
          background: #f8f9fa !important;
          border-radius: 10px !important;
          border-left: 5px solid #3498db !important;
        }
        .cv6-education-main {
          flex: 1 !important;
        }
        .cv6-education-course {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #2c3e50 !important;
          margin: 0 0 8px 0 !important;
        }
        .cv6-education-college {
          font-size: 16px !important;
          color: #3498db !important;
          display: block !important;
          font-weight: 500 !important;
        }
        .cv6-education-location {
          font-size: 14px !important;
          color: #7f8c8d !important;
          display: block !important;
        }
        .cv6-education-dates {
          font-size: 14px !important;
          color: #7f8c8d !important;
          font-style: italic !important;
          white-space: nowrap !important;
          background: white !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          display: inline-block !important;
          margin-top: 8px !important;
          border: 1px solid #e9ecef !important;
        }
        .cv6-skills-category {
          margin-bottom: 20px !important;
        }
        .cv6-category-tag {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #2c3e50 !important;
          display: block !important;
          margin-bottom: 12px !important;
          padding-left: 20px !important;
          position: relative !important;
        }
        .cv6-category-tag::before {
          content: '' !important;
          position: absolute !important;
          left: 0 !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 8px !important;
          height: 8px !important;
          background: #e74c3c !important;
          border-radius: 50% !important;
        }
        .cv6-skills-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        .cv6-skill-item {
          font-size: 15px !important;
          color: #34495e !important;
          line-height: 1.5 !important;
          padding: 10px 16px !important;
          background: white !important;
          border-radius: 8px !important;
          border-left: 4px solid #3498db !important;
          border: 1px solid #e9ecef !important;
        }
        .cv6-certification-item,
        .cv6-award-item {
          margin-bottom: 15px !important;
          padding: 15px !important;
          background: #f8f9fa !important;
          border-radius: 8px !important;
          border-left: 4px solid #e74c3c !important;
        }
        .cv6-certification-name,
        .cv6-award-title {
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 6px !important;
          color: #2c3e50 !important;
        }
        .cv6-certification-institute,
        .cv6-certification-date,
        .cv6-award-issuer,
        .cv6-award-date {
          font-size: 14px !important;
          color: #3498db !important;
          display: block !important;
        }
        .cv6-award-description {
          font-size: 14px !important;
          color: #34495e !important;
          margin-top: 8px !important;
          line-height: 1.6 !important;
        }
        .cv6-achievements-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .cv6-achievement-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          padding: 12px 16px !important;
          background: #f8f9fa !important;
          border-radius: 8px !important;
          border-left: 4px solid #3498db !important;
        }
        .cv6-achievement-text {
          font-size: 15px !important;
          color: #34495e !important;
          line-height: 1.6 !important;
        }
        .cv6-languages-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .cv6-language-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          font-size: 15px !important;
          color: #34495e !important;
          padding: 12px 16px !important;
          background: #f8f9fa !important;
          border-radius: 8px !important;
          border-left: 4px solid #e74c3c !important;
        }
        .cv6-language-proficiency {
          color: #3498db !important;
          font-weight: 600 !important;
        }
        .cv6-interests-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
        }
        .cv6-interest-tag {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
          color: #ffffff !important;
          padding: 8px 16px !important;
          border-radius: 25px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        /* Markdown Preview Styles - Consistent throughout */
        .wmde-markdown {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
          font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif !important;
        }
        .wmde-markdown p {
          margin: 0 0 10px 0 !important;
          line-height: 1.7 !important;
        }
        .wmde-markdown ul, .wmde-markdown ol {
          margin: 0 0 10px 0 !important;
          padding-left: 24px !important;
        }
        .wmde-markdown li {
          margin: 6px 0 !important;
          line-height: 1.6 !important;
        }
        .wmde-markdown strong {
          font-weight: 600 !important;
          color: #2c3e50 !important;
        }
        .wmde-markdown em {
          font-style: italic !important;
        }
        .cv6-contact-icon {
          font-size: 16px !important;
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
    <div className="cv6-header">
      <div className="cv6-contact-section">
        {cvData.phoneNo && (
          <div className="cv6-contact-item">
            <span className="cv6-contact-icon">📱</span>
            <span className="cv6-contact-text">{cvData.phoneNo}</span>
          </div>
        )}
        {cvData.email && (
          <div className="cv6-contact-item">
            <span className="cv6-contact-icon">📧</span>
            <span className="cv6-contact-text">{cvData.email}</span>
          </div>
        )}
        {cvData.address?.city && (
          <div className="cv6-contact-item">
            <span className="cv6-contact-icon">📍</span>
            <span className="cv6-contact-text">
              {cvData.address.city}
              {cvData.address.state ? `, ${cvData.address.state}` : ""}
            </span>
          </div>
        )}
        {cvData.socialLinks?.map((link, i) => (
          <div key={i} className="cv6-contact-item">
            <span className="cv6-contact-icon">🔗</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="cv6-link-url"
            >
              {link.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          </div>
        ))}
      </div>
      <div className="cv6-name-section">
        <h1 className="cv6-name">
          {cvData.firstName}{" "}
          <span className="cv6-last-name">{cvData.lastName}</span>
        </h1>
        <h2 className="cv6-designation">{cvData.designation}</h2>
      </div>
    </div>
  );

  // Summary Section Component
  const SummarySection = () => {
    const summarySection = cvData.sections?.find((s) => s.name === "Summary");
    if (!summarySection?.data) return null;

    return (
      <div className="cv6-section">
        <h3 className="cv6-section-title">Professional Summary</h3>
        <div className="cv6-section-content">
          <p className="cv6-summary-text">{summarySection.data}</p>
        </div>
      </div>
    );
  };

  // Skills Section Component
  const SkillsSection = () => {
    const skillsSection = cvData.sections?.find((s) => s.name === "Skill");
    if (!skillsSection?.data?.length) return null;

    return (
      <div className="cv6-section">
        <h3 className="cv6-section-title">Skills</h3>
        <div className="cv6-section-content">
          <div className="cv6-skills-category">
            <div className="cv6-skills-list">
              {skillsSection.data.map((skill, i) => (
                <span key={i} className="cv6-skill-item">
                  {skill.skill} {skill.rating && `(${skill.rating}/5)`}
                </span>
              ))}
            </div>
          </div>
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Education</h3>
        <div className="cv6-section-content">
          {educationSection.data.map((edu, i) => (
            <div key={i} className="cv6-education-item">
              <div className="cv6-education-main">
                <h4 className="cv6-education-course">{edu.course}</h4>
                <span className="cv6-education-college">{edu.college}</span>
                {edu.grade && (
                  <span className="cv6-education-location">
                    Grade: {edu.grade}
                  </span>
                )}
                <span className="cv6-education-dates">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Work Experience</h3>
        <div className="cv6-section-content">
          {experienceSection.data.map((exp, i) => (
            <div key={i} className="cv6-experience-item">
              <div className="cv6-experience-header">
                <div className="cv6-experience-title-container">
                  <h4 className="cv6-experience-title">{exp.jobTitle}</h4>
                  <span className="cv6-experience-company">
                    {exp.company} - {exp.location}
                  </span>
                </div>
                <span className="cv6-experience-dates">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="cv6-experience-description">
                <MarkdownPreview
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    padding: 0,
                    fontSize: "15px",
                    lineHeight: 1.7,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Projects</h3>
        <div className="cv6-section-content">
          {projectsSection.data.map((proj, i) => (
            <div key={i} className="cv6-project-item">
              <div className="cv6-project-header">
                <h4 className="cv6-project-name">{proj.name}</h4>
              </div>
              <div className="cv6-project-description">
                <MarkdownPreview
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    padding: 0,
                    fontSize: "15px",
                    lineHeight: 1.7,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                  source={proj.description || ""}
                />
              </div>
              {proj.technologies && (
                <div className="cv6-technologies-container">
                  {proj.technologies.map((tech, idx) => (
                    <span key={idx} className="cv6-technology-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Certifications</h3>
        <div className="cv6-section-content">
          {certificationsSection.data.map((cert, i) => (
            <div key={i} className="cv6-certification-item">
              <h4 className="cv6-certification-name">{cert.name}</h4>
              <span className="cv6-certification-institute">
                {cert.institute}
              </span>
              <span className="cv6-certification-date">
                Issued: {cert.issueDate}
              </span>
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Awards</h3>
        <div className="cv6-section-content">
          {awardSection.data.map((award, i) => (
            <div key={i} className="cv6-award-item">
              <h4 className="cv6-award-title">{award.title}</h4>
              <span className="cv6-award-issuer">{award.issuer}</span>
              <span className="cv6-award-date">{award.date}</span>
              {award.description && (
                <p className="cv6-award-description">{award.description}</p>
              )}
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Interests</h3>
        <div className="cv6-section-content">
          <div className="cv6-interests-container">
            {interestSection.data.map((interest, i) => (
              <span key={i} className="cv6-interest-tag">
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Achievements</h3>
        <div className="cv6-section-content">
          <div className="cv6-achievements-list">
            {achievementSection.data.map((achievement, i) => (
              <div key={i} className="cv6-achievement-item">
                <span className="cv6-achievement-icon">🏆</span>
                <span className="cv6-achievement-text">{achievement}</span>
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
      <div className="cv6-section">
        <h3 className="cv6-section-title">Languages</h3>
        <div className="cv6-section-content">
          <div className="cv6-languages-container">
            {languageSection.data.map((language, i) => (
              <div key={i} className="cv6-language-item">
                <span className="cv6-language-name">{language.language}</span>
                <span className="cv6-language-proficiency">
                  {language.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PrintButton = () => (
    <div className="cv6-print-button-container">
      <button className="cv6-print-button" onClick={handlePrint}>
        🖨️ Print CV
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
      <div className="cv6-error-container">
        <p className="cv6-error-text">No CV data available for this user.</p>
      </div>
    );
  }

  return (
    <>
      <PrintButton />
      {/* SINGLE COLUMN LAYOUT - Modern Professional Design */}
      <div className="cv6-container" ref={cvContentRef}>
        <div className="cv6-content">
          <HeaderSection />
          <div className="cv6-main-content">
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
        </div>

        <style jsx global>{`
          /* ===== GLOBAL STYLES ===== */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html,
          body {
            font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
            line-height: 1.5;
            background: #ecf0f1;
          }

          /* ===== SINGLE COLUMN CONTENT ===== */
          .cv6-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          }

          .cv6-content {
            width: 210mm;
            background: white;
            margin: 0 auto;
          }

          /* ===== HEADER SECTION ===== */
          .cv6-header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 15px 40px;
            margin-bottom: 0;
            text-align: center;
          }

          .cv6-name-section {
            text-align: center;
          }

          .cv6-name {
            font-size: 42px;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 10px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 3px;
          }

          .cv6-last-name {
            font-weight: 300;
            color: #ecf0f1;
          }

          .cv6-designation {
            font-size: 20px;
            color: #bdc3c7;
            font-weight: 400;
            margin: 0 0 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .cv6-contact-section {
            display: flex;
            padding-top: 0px;
            padding-bottom: 0px;
            margin-bottom: 15px;
            justify-content: center;
            gap: 46px;
            flex-wrap: wrap;
          }

          .cv6-contact-item {
            font-size: 14px;
            color: #ecf0f1;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .cv6-contact-icon {
            font-size: 16px;
          }

          .cv6-link-url {
            color: #ecf0f1;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .cv6-link-url:hover {
            color: white;
          }

          /* ===== MAIN CONTENT LAYOUT ===== */
          .cv6-main-content {
            padding: 50px 40px;
          }

          /* ===== SECTION STYLES ===== */
          .cv6-section {
            margin-bottom: 35px;
          }

          .cv6-section:last-child {
            margin-bottom: 0;
          }

          .cv6-section-title {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 10px;
            position: relative;
          }

          .cv6-section-title::after {
            content: "";
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 80px;
            height: 3px;
            background: #3498db;
          }

          .cv6-section-content {
            padding-left: 0;
          }

          /* ===== SUMMARY ===== */
          .cv6-summary-text {
            line-height: 1.7;
            font-size: 16px;
            text-align: left;
            color: #34495e;
            margin: 0;
            hyphens: auto;
          }

          /* ===== EXPERIENCE ===== */
          .cv6-experience-item {
            margin-bottom: 25px;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #e74c3c;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .cv6-experience-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          .cv6-experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .cv6-experience-title-container {
            flex: 1;
          }

          .cv6-experience-title {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 8px 0;
          }

          .cv6-experience-company {
            font-size: 16px;
            color: #e74c3c;
            display: block;
            font-weight: 500;
          }

          .cv6-experience-dates {
            font-size: 14px;
            color: #7f8c8d;
            font-style: italic;
            white-space: nowrap;
            margin-left: 20px;
            background: white;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #e9ecef;
          }

          .cv6-experience-description {
            line-height: 1.7;
            font-size: 15px;
            color: #34495e;
            margin: 0;
          }

          /* ===== PROJECTS ===== */
          .cv6-project-item {
            margin-bottom: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            transition: transform 0.3s ease;
          }

          .cv6-project-item:hover {
            transform: translateY(-2px);
          }

          .cv6-project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .cv6-project-name {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 8px 0;
            flex: 1;
          }

          .cv6-technologies-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-start;
            margin-top: 12px;
          }

          .cv6-technology-tag {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            white-space: nowrap;
            font-weight: 500;
            transition: transform 0.3s ease;
          }

          .cv6-technology-tag:hover {
            transform: scale(1.05);
          }

          .cv6-project-description {
            line-height: 1.7;
            font-size: 15px;
            color: #34495e;
            margin: 0;
          }

          /* ===== EDUCATION ===== */
          .cv6-education-item {
            margin-bottom: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #3498db;
            transition: transform 0.3s ease;
          }

          .cv6-education-item:hover {
            transform: translateY(-2px);
          }

          .cv6-education-main {
            flex: 1;
          }

          .cv6-education-course {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 8px 0;
          }

          .cv6-education-college {
            font-size: 16px;
            color: #3498db;
            display: block;
            font-weight: 500;
          }

          .cv6-education-location {
            font-size: 14px;
            color: #7f8c8d;
            display: block;
          }

          .cv6-education-dates {
            font-size: 14px;
            color: #7f8c8d;
            font-style: italic;
            white-space: nowrap;
            background: white;
            padding: 6px 12px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 8px;
            border: 1px solid #e9ecef;
          }

          /* ===== SKILLS ===== */
          .cv6-skills-category {
            margin-bottom: 20px;
          }

          .cv6-category-tag {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            display: block;
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
          }

          .cv6-category-tag::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            background: #e74c3c;
            border-radius: 50%;
          }

          .cv6-skills-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .cv6-skill-item {
            font-size: 15px;
            color: #34495e;
            line-height: 1.5;
            padding: 10px 16px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            border: 1px solid #e9ecef;
            transition: background 0.3s ease;
          }

          .cv6-skill-item:hover {
            background: #e9ecef;
          }

          /* ===== CERTIFICATIONS & AWARDS ===== */
          .cv6-certification-item,
          .cv6-award-item {
            margin-bottom: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
            transition: transform 0.3s ease;
          }

          .cv6-certification-item:hover,
          .cv6-award-item:hover {
            transform: translateY(-2px);
          }

          .cv6-certification-name,
          .cv6-award-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #2c3e50;
          }

          .cv6-certification-institute,
          .cv6-certification-date,
          .cv6-award-issuer,
          .cv6-award-date {
            font-size: 14px;
            color: #3498db;
            display: block;
          }

          .cv6-award-description {
            font-size: 14px;
            color: #34495e;
            margin-top: 8px;
            line-height: 1.6;
          }

          /* ===== ACHIEVEMENTS ===== */
          .cv6-achievements-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .cv6-achievement-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            transition: transform 0.3s ease;
          }

          .cv6-achievement-item:hover {
            transform: translateX(5px);
          }

          .cv6-achievement-icon {
            font-size: 16px;
            margin-top: 2px;
          }

          .cv6-achievement-text {
            font-size: 15px;
            color: #34495e;
            line-height: 1.6;
          }

          /* ===== LANGUAGES & INTERESTS ===== */
          .cv6-languages-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .cv6-language-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            color: #34495e;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
            transition: background 0.3s ease;
          }

          .cv6-language-item:hover {
            background: #e9ecef;
          }

          .cv6-language-proficiency {
            color: #3498db;
            font-weight: 600;
          }

          .cv6-interests-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .cv6-interest-tag {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.3s ease;
          }

          .cv6-interest-tag:hover {
            transform: scale(1.05);
          }

          /* ===== PRINT BUTTON ===== */
          .cv6-print-button-container {
            text-align: center;
            padding: 25px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
          }

          .cv6-print-button {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
          }

          .cv6-print-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
          }

          /* ===== RESPONSIVE DESIGN ===== */
          @media (max-width: 768px) {
            .cv6-container {
              margin: 10px;
            }

            .cv6-content {
              width: 100%;
            }

            .cv6-main-content {
              padding: 30px 20px;
            }

            .cv6-header {
              padding: 30px 20px;
            }

            .cv6-contact-section {
              gap: 15px;
              flex-direction: column;
              align-items: center;
            }

            .cv6-name {
              font-size: 32px;
            }

            .cv6-designation {
              font-size: 16px;
            }

            .cv6-section-title {
              font-size: 20px;
            }
          }

          /* Browser-specific styling */
          @media screen {
            .cv6-container {
              margin: 20px auto;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Cv6;
