// // src/pages/HomePage/CvTemplate.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Box, Typography, Avatar, Divider } from "@mui/material";

// const CvTemplate = () => {
//   const { username } = useParams();
//   const [cvData, setCvData] = useState(null);

//   useEffect(() => {
//     const fetchCvData = async () => {
//       try {
//         const res = await axios.get(
//           `http://192.168.0.3:9000/api/v1/portfolio/defaultCv/${username}`
//         );
//         setCvData(res.data.fetchedCvInfo.defaultCvInfo);
//       } catch (err) {
//         console.error("❌ Error fetching CV data:", err);
//       }
//     };

//     if (username) fetchCvData();
//   }, [username]);

//   if (!cvData) return <h2>Loading CV...</h2>;

//   return (
//     <Box sx={{ maxWidth: "900px", mx: "auto", p: 4, bgcolor: "white", boxShadow: 3 }}>
//       {/* ✅ Profile Header */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <Avatar
//           src={cvData.profilePhoto || "https://via.placeholder.com/120"}
//           alt="Profile"
//           sx={{ width: 100, height: 100, mr: 2 }}
//         />
//         <Box>
//           <Typography variant="h4" fontWeight="bold">
//             {cvData.firstName || "Not Provided"} {cvData.lastName || ""}
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             {cvData.designation || "Not Provided"}
//           </Typography>
//         </Box>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       {/* ✅ Contact Info */}
//       <Typography variant="h6" gutterBottom>
//         Contact
//       </Typography>
//       <Typography>Email: {cvData.email || "Not Provided"}</Typography>
//       <Typography>Phone: {cvData.phoneNo || "Not Provided"}</Typography>
//       <Typography>
//         Location:{" "}
//         {cvData?.address
//           ? `${cvData.address.city || ""}, ${cvData.address.state || ""}, ${cvData.address.country || ""}`
//           : "Not Provided"}
//       </Typography>

//       <Divider sx={{ my: 3 }} />

//       {/* ✅ Dynamic Sections */}
//       {cvData.sections?.map((section, idx) => (
//         <Box key={idx} sx={{ mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             {section.name || "Untitled Section"}
//           </Typography>

//           {/* Case 1: Summary / Plain text */}
//           {typeof section.data === "string" && <Typography>{section.data}</Typography>}

//           {/* Case 2: Array */}
//           {Array.isArray(section.data) &&
//             section.data.map((item, i) => (
//               <Box key={i} sx={{ mb: 1, pl: 1 }}>
//                 {/* String items (like achievements, interests) */}
//                 {typeof item === "string" && <Typography>• {item}</Typography>}

//                 {/* Object items (skills, education, etc.) */}
//                 {typeof item === "object" && (
//                   <Box>
//                     {/* Skills */}
//                     {item.skill && (
//                       <Typography>
//                         {item.skill} ⭐ {item.rating}
//                       </Typography>
//                     )}

//                     {/* Experience */}
//                     {item.jobTitle && (
//                       <Typography fontWeight="bold">{item.jobTitle}</Typography>
//                     )}
//                     {item.company && (
//                       <Typography color="text.secondary">
//                         {item.company} ({item.location})
//                       </Typography>
//                     )}
//                     {item.startDate && item.endDate && (
//                       <Typography variant="caption">
//                         {item.startDate} - {item.endDate}
//                       </Typography>
//                     )}
//                     {item.description && <Typography>{item.description}</Typography>}

//                     {/* Education */}
//                     {item.degree && (
//                       <Typography fontWeight="bold">{item.degree}</Typography>
//                     )}
//                     {item.institution && <Typography>{item.institution}</Typography>}
//                     {item.year && <Typography>Year: {item.year}</Typography>}

//                     {/* Project */}
//                     {item.projectName && (
//                       <Typography fontWeight="bold">{item.projectName}</Typography>
//                     )}
//                     {item.projectDescription && (
//                       <Typography>{item.projectDescription}</Typography>
//                     )}

//                     {/* Certification */}
//                     {item.name && <Typography>{item.name}</Typography>}

//                     {/* Language */}
//                     {item.lang && (
//                       <Typography>
//                         {item.lang} ({item.level})
//                       </Typography>
//                     )}

//                     {/* Award */}
//                     {item.award && <Typography>{item.award}</Typography>}
//                   </Box>
//                 )}
//               </Box>
//             ))}
//         </Box>
//       ))}

//       <Divider sx={{ my: 3 }} />

//       {/* ✅ Social Links */}
//       <Typography variant="h6" gutterBottom>
//         Social Links
//       </Typography>
//       {cvData.socialLinks?.length > 0 ? (
//         cvData.socialLinks.map((link, i) => (
//           <Typography key={i} color="primary">
//             {link}
//           </Typography>
//         ))
//       ) : (
//         <Typography>No links added</Typography>
//       )}
//     </Box>
//   );
// };

// export default CvTemplate;
