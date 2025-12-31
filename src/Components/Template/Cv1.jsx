import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useParams, useSearchParams } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import printJS from "print-js";

const Cv1 = () => {
  const [searchParams] = useSearchParams();
  const { username } = useParams();
  const cvPublicView = searchParams.get("cv");
  const userProfile = useSelector((state) => state.userProfile?.data?.fetchedUsed);
  const userNameRedux = userProfile?.userName;

  const [cvData, setCvData] = useState(null);
  const [pages, setPages] = useState([]);
  const measureRef = useRef(null);

  const A4_HEIGHT = 1123;
  const USABLE_HEIGHT = A4_HEIGHT - 140; // safe margin

  useEffect(() => {
    const fetchData = async () => {
      let uname = username || userNameRedux;
      if (cvPublicView === "true" || !userNameRedux) uname = username;

      if (!uname) return;

      try {
        const res = await axios.get(`${apiUrl}/defaultCv/${uname}`);
        setCvData(res.data.fetchedCvInfo.defaultCvInfo);
      } catch (err) {
        console.error("CV fetch error:", err);
      }
    };
    fetchData();
  }, [username, userNameRedux, cvPublicView]);

  // Auto Pagination
  useEffect(() => {
    if (!cvData || !measureRef.current) return;

    const container = measureRef.current;
    const items = Array.from(container.children);
    const newPages = [];
    let currentPage = null;
    let currentHeight = 0;

    const newPageDiv = () => {
      const div = document.createElement("div");
      div.className = "cv-page";
      div.style.cssText = `
        width: 210mm;
        min-height: 297mm;
        padding: 35mm 25mm;
        background: white;
        margin: 0 auto 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        border-radius: 10px;
        box-sizing: border-box;
        page-break-after: always;
        font-family: Arial, sans-serif;
      `;
      newPages.push(div);
      return div;
    };

    items.forEach((item) => {
      const clone = item.cloneNode(true);
      document.body.appendChild(clone);
      clone.style.visibility = "hidden";
      clone.style.position = "absolute";
      const h = clone.offsetHeight + 30;
      document.body.removeChild(clone);

      if (!currentPage || currentHeight + h > USABLE_HEIGHT) {
        currentPage = newPageDiv();
        currentHeight = 0;
      }
      currentPage.appendChild(item.cloneNode(true));
      currentHeight += h;
    });

    setPages(newPages.map(p => p.outerHTML));
  }, [cvData,USABLE_HEIGHT]);

  const handlePrint = () => {
    printJS({
      printable: pages.join(""),
      type: "raw-html",
      documentTitle: `${cvData.firstName} ${cvData.lastName} - Resume`,
      style: `
        @page { size: A4; margin: 0; }
        html, body { margin:0; padding:0; background:white !important; }
        .cv-page {
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 35mm 25mm !important;
          page-break-after: always !important;
          box-shadow: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .cv-page:last-child { page-break-after: avoid !important; }
        .print-btn, nav, header, footer, aside { display: none !important; }
      `
    });
  };

  if (!cvData) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {"Portfolio.DriveOSx".split("").map((l, i) => (
            <Typography key={i} variant="h2" sx={{
              animation: `fade 2s infinite ${i * 0.1}s`,
              color: i === 0 ? "#4285F4" : i === 1 ? "#EA4335" : i === 2 ? "#FBBC05" : "#34A853"
            }}>{l}</Typography>
          ))}
        </Box>
        <style>{`@keyframes fade{0%,100%{opacity:0;transform:translateY(20px)}50%{opacity:1;transform:translateY(0)}}`}</style>
      </Box>
    );
  }

  return (
    <>
      {/* Print Button */}
      <div style={{ textAlign: "center", padding: "25px 0" }}>
        <button onClick={handlePrint} className="print-btn" style={{
          background: "white", color: "#0d47a1", fontSize: "20px", fontWeight: "bold",
          padding: "16px 50px", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}>
          Print / Download PDF ({pages.length || 1} Page{pages.length > 1 ? "s" : ""})
        </button>
      </div>

      {/* Hidden Measurement Container */}
      <div ref={measureRef} style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "3px solid #000" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {cvData.firstName} {cvData.lastName}
          </h1>
          <h2 style={{ fontSize: "20px", margin: "0 0 15px", color: "#333" }}>{cvData.designation}</h2>
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#000" }}>
            <div><strong>Email:</strong> {cvData.email}</div>
            <div><strong>Phone:</strong> {cvData.phoneNo}</div>
            <div><strong>Location:</strong> {cvData.address?.city}, {cvData.address?.state}</div>
            {cvData.socialLinks?.map((l, i) => <div key={i}><strong>Link:</strong> {l}</div>)}
          </div>
        </div>

        {/* All Sections */}
        {cvData.sections?.map((section, idx) => {
          const titleMap = {
            Summary: "Professional Summary",
            Skill: "Technical Skills",
            Experience: "Professional Experience",
            Project: "Projects",
            Education: "Education",
            Certification: "Certifications",
            Award: "Awards & Honors",
            Achievement: "Achievements",
            Interest: "Interests",
            Language: "Languages"
          };

          return (
            <div key={idx} style={{ marginBottom: "28px" }}>
              <h3 style={{
                fontSize: "15px", fontWeight: "bold", textTransform: "uppercase",
                borderBottom: "2px solid #000", display: "inline-block", paddingBottom: "5px", marginBottom: "12px"
              }}>
                {titleMap[section.name] || section.name}
              </h3>

              {/* Summary */}
              {section.name === "Summary" && <p style={{ fontSize: "12px", lineHeight: "1.6" }}>{section.data}</p>}

              {/* Skills */}
              {section.name === "Skill" && (
                <div style={{ columns: 2, columnGap: "20px" }}>
                  {section.data.map((s, i) => (
                    <div key={i} style={{
                      fontSize: "12px",
                      marginBottom: "6px",
                      pageBreakInside: "avoid",   // ← Sirf har skill pe lagao
                      breakInside: "avoid"
                    }}>
                      • {s.skill} <span style={{ color: "#555" }}>({s.rating}/5)</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience & Projects */}
              {(section.name === "Experience" || section.name === "Project") && section.data.map((item, i) => (
                <div key={i} style={{ marginBottom: "20px", pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "bold", margin: 0 }}>
                      {section.name === "Experience" ? item.jobTitle : item.name}
                    </h4>
                    <span style={{ fontSize: "11px", color: "#555" }}>{item.startDate} – {item.endDate || "Present"}</span>
                  </div>
                  {section.name === "Experience" && <p style={{ fontSize: "12px", margin: "3px 0", fontWeight: "bold" }}>{item.company}, {item.location}</p>}
                  <div style={{ pageBreakInside: "avoid", fontSize: "12.5px", lineHeight: "1.6", marginTop: "6px" }}>
                    <MarkdownPreview source={item.description || ""} style={{ background: "transparent", padding: 0 }} />
                  </div>
                  {item.technologies && (
                    <div style={{ marginTop: "8px" }}>
                      <strong style={{ fontSize: "11px" }}>Tech:</strong>
                      {item.technologies.map((t, k) => (
                        <span key={k} style={{ display: "inline-block", background: "#f0f0f0", padding: "3px 8px", margin: "3px 5px 3px 0", borderRadius: "4px", fontSize: "10px" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Education */}
              {section.name === "Education" && section.data.map((e, i) => (
                <div key={i} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 3px" }}>{e.course}</h4>
                  <p style={{ fontSize: "12px", margin: 0 }}>{e.college}</p>
                  <p style={{ fontSize: "11px", color: "#666" }}>{e.startDate} – {e.endDate} | Grade: {e.grade}</p>
                </div>
              ))}

              {/* Certifications, Awards, Achievements, Interests, Languages */}
              {["Certification", "Award", "Achievement", "Interest", "Language"].includes(section.name) && section.data.map((item, i) => (
                <div key={i} style={{ marginBottom: "10px", fontSize: "12px" }}>
                  {section.name === "Language" ? `${item.language} - ${item.proficiency || "Proficient"}`
                    : section.name === "Interest" ? `• ${item}`
                      : <strong>{item.name || item.title || item}</strong>}
                  {item.institute && <span> - {item.institute}</span>}
                  {item.issueDate && <span style={{ color: "#666", fontSize: "11px" }}> ({item.issueDate})</span>}
                  {item.description && <div style={{ marginTop: "3px", fontSize: "11px" }}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div style={{ padding: "40px 20px", background: "#f5f7fa", minHeight: "100vh" }}>
        {pages.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "22px", padding: "100px", color: "#555" }}>Generating Beautiful Pages...</div>
        ) : (
          pages.map((page, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: page }} />
          ))
        )}
      </div>
    </>
  );
};

export default Cv1;