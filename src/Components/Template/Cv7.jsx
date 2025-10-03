import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const ClassicProfessionalCV = () => {
  const cvRef = useRef();

  const cvData = {
    personalInfo: {
      name: "Jatin Sharma",
      jobTitle: "Frontend Developer | React.js Specialist",
      email: "jatin200336@gmail.com",
      phone: "+91 8860133659",
      linkedin: "linkedin.com/in/jatin-developer",
      location: "Gurgaon, Haryana",
      portfolio: "jatinsharma.dev"
    },
    summary: "Results-driven Frontend Developer with 6 months of hands-on experience specializing in React.js and modern JavaScript ecosystems. Proven ability to develop responsive, user-friendly web applications using cutting-edge technologies. Strong collaborator with expertise in Material-UI, REST APIs, and version control systems. Committed to writing clean, maintainable code and continuously enhancing technical skills to deliver high-impact solutions.",
    skills: {
      "Frontend Technologies": ["JavaScript (ES6+)", "React.js", "HTML5", "CSS3", "Material-UI", "Bootstrap"],
      "Tools & Platforms": ["Git/GitHub", "REST APIs", "Webpack", "Jest", "VS Code", "Chrome DevTools"],
      "Professional Skills": ["Responsive Design", "Problem Solving", "Team Collaboration", "Agile Methodology", "Code Review"]
    },
    experience: [
      {
        company: "SainiCollection",
        role: "Frontend Developer",
        duration: "Feb 2025 - Present",
        location: "Remote",
        responsibilities: [
          "Engineered responsive web applications using React.js and Material-UI, improving user engagement by 25%",
          "Implemented modern UI/UX designs that enhanced user experience and reduced bounce rates by 15%",
          "Collaborated with development team using Git version control, ensuring code quality and efficient workflow",
          "Conducted thorough testing and debugging, reducing production bugs by 30%",
          "Integrated RESTful APIs to enable dynamic content rendering and improve application performance"
        ]
      }
    ],
    education: [
      {
        institution: "Maharaja Agresen Himalayan Garhwal University",
        degree: "Bachelor of Arts",
        duration: "2021 - 2024",
        location: "Uttarakhand"
      },
      {
        institution: "Subharti University",
        degree: "MBA in Information Technology (Ongoing)",
        duration: "2024 - Present",
        location: "Meerut, Uttar Pradesh"
      },
      {
        institution: "Govt Sr. Secondary School",
        degree: "Senior Secondary (11th - 12th)",
        duration: "2019 - 2021",
        location: "Gurgaon, Haryana"
      },
      {
        institution: "Santoshi High School",
        degree: "Secondary Education (10th)",
        duration: "2018 - 2019",
        location: "Gurgaon, Haryana"
      }
    ],
    certifications: [
      {
        name: "Responsive Web Design",
        issuer: "FreeCodeCamp",
        year: "2025",
        credential: "FCC-RWD-2025"
      },
      {
        name: "JavaScript Algorithms and Data Structures",
        issuer: "FreeCodeCamp",
        year: "2025",
        credential: "FCC-JS-2025"
      }
    ],
    languages: [
      { language: "Hindi", proficiency: "Native" },
      { language: "English", proficiency: "Professional Working Proficiency" }
    ],
    projects: [
      {
        name: "E-commerce Dashboard",
        description: "Built a comprehensive admin dashboard with React and Material-UI featuring real-time analytics",
        technologies: ["React", "Material-UI", "Chart.js", "REST APIs"]
      },
      {
        name: "Portfolio Website",
        description: "Developed a responsive portfolio website with modern animations and dark mode functionality",
        technologies: ["React", "CSS3", "Framer Motion"]
      }
    ]
  };

  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: `${cvData.personalInfo.name.replace(/\s+/g, '_')}_Professional_CV`,
    onAfterPrint: () => console.log("PDF generated successfully!"),
    removeAfterPrint: true
  });

  const handleDownloadPDF = () => handlePrint();
  const handlePrintDirectly = () => window.print();

  return (
    <div style={{
      maxWidth: '210mm',
      margin: '0 auto',
      padding: '20px',
      background: '#f8f9fa',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: '100vh'
    }} className="cv-app-container">
      {/* Global Styles */}
      <style>
        {`
          /* Print Styles - Critical for PDF/Print */
          @media print {
            @page {
              size: A4;
              margin: 15mm;
              marks: none;
            }
            
            /* Hide browser headers and footers */
            @page :header { display: none !important; }
            @page :footer { display: none !important; }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              width: 210mm !important;
              height: 297mm !important;
            }
            
            /* Hide all elements except CV content */
            body * {
              visibility: hidden;
            }
            
            .cv-print-container, 
            .cv-print-container * {
              visibility: visible !important;
            }
            
            .cv-print-container {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            /* Hide non-print elements */
            .no-print,
            .page-label,
            .action-buttons {
              display: none !important;
            }
            
            /* Page styling for print */
            .cv-page {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 15mm !important;
              box-shadow: none !important;
              background: white !important;
              page-break-after: always !important;
              position: relative !important;
              box-sizing: border-box !important;
            }
            
            .cv-page:last-child {
              page-break-after: auto !important;
            }
            
            /* Prevent content from breaking mid-section */
            .section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Ensure proper spacing in print */
            .experience-item,
            .education-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }

          /* Screen Styles - For Browser View */
          @media screen {
            .cv-page {
              width: 210mm;
              min-height: 297mm;
              margin: 10px auto;
              padding: 20mm;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              box-sizing: border-box;
              position: relative;
            }

            .page-label {
              position: absolute;
              top: 10px;
              right: 20px;
              font-size: 11px;
              color: #666;
              font-style: italic;
              background: rgba(255,255,255,0.9);
              padding: 2px 8px;
              border-radius: 3px;
            }
          }

          /* Common Styles for both screen and print */
          .section-title {
            color: #2c5530;
            border-bottom: 2px solid #2c5530;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .contact-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }

          .skill-category {
            margin-bottom: 15px;
          }

          .skill-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
          }

          .skill-tag {
            background: #e9ecef;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            border: 1px solid #dee2e6;
          }

          .experience-item, .education-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e9ecef;
          }

          .experience-item:last-child, .education-item:last-child {
            border-bottom: none;
          }

          .company-header, .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }

          .responsibilities {
            list-style: none;
            padding-left: 0;
            margin-top: 10px;
          }

          .responsibilities li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 6px;
            line-height: 1.5;
          }

          .responsibilities li:before {
            content: "•";
            position: absolute;
            left: 8px;
            color: #2c5530;
            font-weight: bold;
          }

          .project-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 12px;
            border-left: 3px solid #2c5530;
          }

          .print-button:hover {
            background: #1a472a !important;
            transform: translateY(-1px);
          }

          .download-button:hover {
            background: #0056b3 !important;
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .cv-page {
              margin: 5px;
              padding: 15px;
            }
            .company-header, .education-header {
              flex-direction: column;
              gap: 5px;
            }
          }
        `}
      </style>

      {/* Action Buttons - Visible only in browser */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }} className="no-print action-buttons">
        <button
          onClick={handleDownloadPDF}
          style={{
            background: '#2c5530',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          className="print-button"
        >
          📄 Download PDF
        </button>
        <button
          onClick={handlePrintDirectly}
          style={{
            background: '#0066cc',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          className="download-button"
        >
          🖨️ Print CV
        </button>
      </div>

      {/* CV Content - Special container for print/PDF */}
      <div ref={cvRef} className="cv-print-container">

        {/* Page 1: Personal Info, Summary, Skills */}
        <div className="cv-page">
          <span className="page-label">Page 1 of 3</span>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid #2c5530' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c5530',
              margin: '0 0 5px 0',
              letterSpacing: '1px'
            }}>
              {cvData.personalInfo.name}
            </h1>
            <h2 style={{
              fontSize: '18px',
              color: '#555',
              margin: '0 0 15px 0',
              fontWeight: 'normal',
              fontStyle: 'italic'
            }}>
              {cvData.personalInfo.jobTitle}
            </h2>
            <div className="contact-info">
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '14px' }}>
                <span>📧 {cvData.personalInfo.email}</span>
                <span>📱 {cvData.personalInfo.phone}</span>
                <span>💼 {cvData.personalInfo.linkedin}</span>
                <span>📍 {cvData.personalInfo.location}</span>
                {cvData.personalInfo.portfolio && <span>🌐 {cvData.personalInfo.portfolio}</span>}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <section className="section">
            <h3 className="section-title">Professional Summary</h3>
            <p style={{ lineHeight: '1.6', textAlign: 'justify', fontSize: '14px' }}>
              {cvData.summary}
            </p>
          </section>

          {/* Technical Skills */}
          <section className="section">
            <h3 className="section-title">Technical Skills</h3>
            {Object.entries(cvData.skills).map(([category, skills]) => (
              <div key={category} className="skill-category">
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555', fontWeight: '600' }}>
                  {category}
                </h4>
                <div className="skill-items">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="section">
            <h3 className="section-title">Key Projects</h3>
            {cvData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2c5530' }}>
                  {project.name}
                </h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.4' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} style={{
                      background: '#e9ecef',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      border: '1px solid #dee2e6'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Page 2: Experience & Education */}
        <div className="cv-page">
          <span className="page-label">Page 2 of 3</span>

          {/* Professional Experience */}
          <section className="section">
            <h3 className="section-title">Professional Experience</h3>
            {cvData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="company-header">
                  <div>
                    <h4 style={{ margin: '0', fontSize: '16px', color: '#2c5530', fontWeight: 'bold' }}>
                      {exp.company}
                    </h4>
                    <p style={{ margin: '2px 0', fontSize: '14px', color: '#555', fontStyle: 'italic' }}>
                      {exp.role}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#777' }}>
                      {exp.location}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '14px', color: '#2c5530', fontWeight: '600' }}>
                      {exp.duration}
                    </p>
                  </div>
                </div>
                <ul className="responsibilities">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} style={{ fontSize: '13px' }}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="section">
            <h3 className="section-title">Education</h3>
            {cvData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <div>
                    <h4 style={{ margin: '0', fontSize: '15px', color: '#2c5530', fontWeight: 'bold' }}>
                      {edu.institution}
                    </h4>
                    <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>
                      {edu.degree}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#777' }}>
                      {edu.location}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '14px', color: '#2c5530', fontWeight: '600' }}>
                      {edu.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Page 3: Certifications, Languages & Additional Info */}
        <div className="cv-page">
          <span className="page-label">Page 3 of 3</span>

          {/* Certifications */}
          <section className="section">
            <h3 className="section-title">Certifications</h3>
            {cvData.certifications.map((cert, index) => (
              <div key={index} style={{
                marginBottom: '12px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '5px',
                borderLeft: '3px solid #2c5530'
              }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#2c5530' }}>
                  {cert.name}
                </h4>
                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>
                  <strong>Issued by:</strong> {cert.issuer} • <strong>Year:</strong> {cert.year}
                </p>
                {cert.credential && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#777', fontStyle: 'italic' }}>
                    Credential ID: {cert.credential}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Languages */}
          <section className="section">
            <h3 className="section-title">Languages</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {cvData.languages.map((lang, index) => (
                <div key={index} style={{
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c5530' }}>
                    {lang.language}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {lang.proficiency}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Information */}
          <section className="section">
            <h3 className="section-title">Additional Information</h3>
            <div style={{
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '5px',
              border: '1px solid #e9ecef'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>Availability:</strong> Immediately available for full-time opportunities
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>Work Authorization:</strong> Eligible to work in India
              </p>
              <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>References:</strong> Available upon request
              </p>
            </div>
          </section>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            paddingTop: '15px',
            borderTop: '1px solid #e9ecef',
            fontSize: '11px',
            color: '#666'
          }}>
            <p>This CV was generated on {new Date().toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicProfessionalCV;