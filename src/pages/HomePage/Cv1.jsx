// src/pages/HomePage/Cv1.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Avatar } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../utils/common";



const Cv1 = () => {
  const [cvData, setCvData] = useState(null);
  const { username } = useParams(); // 👉 URL से username लेना



  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/defaultCv/${username}`
        );
        console.log("📌 API Response:", res.data.fetchedCvInfo.defaultCvInfo);
        setCvData(res.data.fetchedCvInfo.defaultCvInfo);
      } catch (err) {
        console.error("❌ Error fetching CV data:", err);
      }
    };

    if (username) fetchCvData();
  }, [username]);

  if (!cvData) return <h2>No User Cv Found</h2>;

  return (
    <Box
      sx={{
        maxWidth: "900px",
        mx: "auto",
        p: 4,
        bgcolor: "white",
        boxShadow: 3,
      }}
    >
      {/* ✅ Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={cvData.profilePhoto || "https://via.placeholder.com/120"}
          alt={cvData.firstName}
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {cvData.firstName} {cvData.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {cvData.designation || "Profession not set"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ✅ Contact Info */}
      <Typography variant="h6" gutterBottom>
        Contact
      </Typography>
      <Typography>Email: {cvData.email}</Typography>
      <Typography>Phone: {cvData.phoneNo}</Typography>
      <Typography>
        Location:{" "}
        {`${cvData?.address?.city || ""}, ${cvData?.address?.state || ""}, ${cvData?.address?.country || ""
          }`}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* ✅ Dynamic Sections */}
      {cvData.sections?.map((section, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {section.name}
          </Typography>

          {/* 1. Agar summary ya simple text hai */}
          {typeof section.data === "string" && (
            <Typography>{section.data}</Typography>
          )}

          {/* 2. Agar array hai */}
          {Array.isArray(section.data) &&
            section.data.map((item, i) => (
              <Box key={i} sx={{ mb: 1, pl: 1 }}>
                {/* 2a. Agar string item hai (Achievement, Interest) */}
                {typeof item === "string" && (
                  <Typography variant="body1">• {item}</Typography>
                )}

                {/* 2b. Agar object hai (Skills, Experience, Education, Project, etc.) */}
                {typeof item === "object" && (
                  <Box sx={{ mb: 1 }}>
                    {/* Skills */}
                    {item.skill && (
                      <Typography>
                        {item.skill} ⭐ {item.rating}
                      </Typography>
                    )}

                    {/* Experience */}
                    {item.jobTitle && (
                      <Typography fontWeight="bold">{item.jobTitle}</Typography>
                    )}
                    {item.company && (
                      <Typography color="text.secondary">
                        {item.company} ({item.location})
                      </Typography>
                    )}
                    {item.startDate && item.endDate && (
                      <Typography variant="caption">
                        {item.startDate} - {item.endDate}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography>{item.description}</Typography>
                    )}

                    {/* Education */}
                    {item.degree && (
                      <Typography fontWeight="bold">{item.degree}</Typography>
                    )}
                    {item.institution && (
                      <Typography>{item.institution}</Typography>
                    )}
                    {item.year && <Typography>Year: {item.year}</Typography>}

                    {/* Project */}
                    {item.projectName && (
                      <Typography fontWeight="bold">
                        {item.projectName}
                      </Typography>
                    )}
                    {item.projectDescription && (
                      <Typography>{item.projectDescription}</Typography>
                    )}

                    {/* Certification */}
                    {item.name && <Typography>{item.name}</Typography>}

                    {/* Language */}
                    {item.lang && (
                      <Typography>
                        {item.lang} ({item.level})
                      </Typography>
                    )}

                    {/* Award */}
                    {item.award && <Typography>{item.award}</Typography>}
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ✅ Social Links */}
      <Typography variant="h6" gutterBottom>
        Social Links
      </Typography>
      {cvData.socialLinks?.length > 0 ? (
        cvData.socialLinks.map((link, i) => (
          <Typography key={i} color="primary">
            {link}
          </Typography>
        ))
      ) : (
        <Typography>No links added</Typography>
      )}
    </Box>
  );
};

export default Cv1;
