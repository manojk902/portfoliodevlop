// // src/pages/TemplateSelectionPage/index.jsx
// // This page allows users to browse and select resume templates.
// import React, { useState, useMemo } from 'react';
// import { Box, Typography, Grid } from '@mui/material'; // Import MUI Grid
// import Filters from '../../Components/Templates/Filters';
// import TemplateCard from '../../Components/Templates/TemplateCarddddd';
// // --- FIX: Ensure correct named import for initialTemplates ---
// // import { initialTemplates } from '../../utils'; // Import initialTemplates as a NAMED import
// // --- END FIX ---

// const TemplateSelectionPage = ({ onChooseTemplate }) => {
//   // Local state for filters, as filter logic is specific to this page.
//   const [filters, setFilters] = useState({
//     headshot: 'All',
//     graphics: 'All',
//     columns: 'All',
//     color: 'All',
//   });

//   // Memoized filtering logic to optimize performance.
//   // `filteredTemplates` updates only when `filters` change.
//   // This hook must be at the top level of the component.
//   const filteredTemplates = useMemo(() => {
//     // Ensure initialTemplates is defined before calling .filter()
//     if (!initialTemplates) {
//       // console.error("initialTemplates is undefined. Check src/utils/index.js export.");
//       return []; // Return an empty array to prevent crashing
//     }
//     return initialTemplates.filter(template => {
//       const matchesHeadshot = filters.headshot === 'All' || template.headshot === filters.headshot;
//       const matchesGraphics = filters.graphics === 'All' || template.graphics === filters.graphics;
//       const matchesColumns = filters.columns === 'All' || template.columns === filters.columns;
//       const matchesColor = filters.color === 'All' || template.colorScheme === filters.color;

//       return matchesHeadshot && matchesGraphics && matchesColumns && matchesColor;
//     });
//   }, [filters]);

//   // Handler for changing filter values.
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [filterName]: value,
//     }));
//   };

//   return (
//     <Box>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
//           py: 3,
//           bgcolor: 'white',
//           boxShadow: 1, // MUI shadow level
//         }}
//       >
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'extrabold', color: 'text.primary', mb: 1 }}>
//           Templates we recommend for you
//         </Typography>
//         <Typography variant="body1" sx={{ color: 'text.secondary' }}>
//           You can always change your template later.
//         </Typography>
//       </Box>
//       {/* Filters component */}
//       <Filters
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         templateCount={filteredTemplates.length}
//       />
//       {/* Main content area for template display */}
//       <Box component="main" sx={{ container: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
//         {/* Grid container for responsive template layout */}
//         <Grid container spacing={3} justifyContent="center">
//           {filteredTemplates.map(template => (
//             <Grid item xs={12} sm={6} lg={4} key={template.id}> {/* Responsive item sizing */}
//               <TemplateCard
//                 template={template}
//                 onChooseTemplate={onChooseTemplate} // Callback to handle template selection
//               />
//             </Grid>
//           ))}
//         </Grid>
//         {/* Message for no matching templates */}
//         {filteredTemplates.length === 0 && (
//           <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
//             No templates match your current filters. Try adjusting them!
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default TemplateSelectionPage;