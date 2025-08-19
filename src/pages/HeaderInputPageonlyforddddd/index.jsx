// // src/pages/HeaderInputPage/index.jsx
// // This page allows the user to input their personal header details for the resume.
// import React, { useState, useMemo } from 'react';
// import { Box, Typography, TextField, Button, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for completed fields
// import CircleIcon from '@mui/icons-material/Circle'; // Icon for uncompleted steps

// import ChangeTemplateModal from '../../Components/Common/ChangeTemplateModal';
// import { initialTemplates, getColorHex } from '../../utils'; // Import static templates and color helper

// // Redux Toolkit imports to interact with the store
// import { useSelector, useDispatch } from 'react-redux';
// import { updateHeaderData, setSelectedTemplate } from '../../store/features/resume/resumeSlice';

// // `onNavigate` and `isSidebarOpen` props are passed down from AppRoutes, which comes from AppProvider.
// const HeaderInputPage = ({ onNavigate, isSidebarOpen }) => {
//   const theme = useTheme(); // Access the MUI theme for consistent colors.
//   const dispatch = useDispatch(); // Get the dispatch function to send actions to Redux.

//   // --- Redux State Access ---
//   // `formData` for the header is now read directly from the Redux store.
//   const formData = useSelector((state) => state.resume.headerData);
//   // `selectedTemplateId` is also read from the Redux store for the live preview.
//   const selectedTemplateId = useSelector((state) => state.resume.selectedTemplateId);

//   // Local state for controlling the Change Template Modal's visibility.
//   const [showChangeTemplateModal, setShowChangeTemplateModal] = useState(false);

//   // Find the selected template object from `initialTemplates` to get its `colorScheme` for preview.
//   const currentTemplate = useMemo(() => {
//     return initialTemplates.find(t => t.id === selectedTemplateId);
//   }, [selectedTemplateId]);

//   // Handler for input changes. It dispatches an `updateHeaderData` action to the Redux store.
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(updateHeaderData({ [name]: value })); // Dispatch action with the specific field being updated.
//   };

//   // Callback to handle template selection from the modal.
//   // This dispatches `setSelectedTemplate` to Redux and navigates back to this page.
//   const handleTemplateSelectedFromModal = (templateId) => {
//     dispatch(setSelectedTemplate(templateId)); // Update selected template in Redux.
//     // Navigate back to the current path ('/header-input') to trigger re-render with new template,
//     // ensuring the `selectedTemplateId` prop updates. Also maintain sidebar state.
//     onNavigate('/header-input', { templateId: templateId, toggleSidebar: isSidebarOpen });
//     setShowChangeTemplateModal(false); // Close the modal after selection.
//   };

//   // Static data for sidebar navigation steps.
//   const steps = [
//     { name: 'Header', completed: true }, // Current step is marked as completed/active
//     { name: 'Experience', completed: false },
//     { name: 'Education', completed: false },
//     { name: 'Skills', completed: false },
//     { name: 'Summary', completed: false },
//     { name: 'Additional Details', completed: false },
//     { name: 'Finalize', completed: false },
//   ];

//   return (
//     <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 'calc(100vh - 128px)', bgcolor: 'customColors.grayBg' }}>
//       {/* Left Sidebar - Navigation Steps */}
//       <Box
//         sx={{
//           width: { xs: '100%', md: '250px' },
//           bgcolor: 'customColors.black',
//           color: 'white',
//           p: { xs: 3, md: 4 },
//           position: { xs: 'fixed', md: 'relative' },
//           top: { xs: 0, md: 'auto' },
//           bottom: { xs: 0, md: 'auto' },
//           left: 0,
//           zIndex: 40,
//           transform: { xs: isSidebarOpen ? 'translateX(0%)' : 'translateX(-100%)', md: 'translateX(0%)' },
//           transition: 'transform 0.3s ease-in-out',
//           overflowY: 'auto',
//           boxShadow: { xs: 3, md: 0 },
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: { xs: 'flex-start', md: 'flex-start' },
//           pt: { xs: 8, md: 4 }
//         }}
//       >
//         <List sx={{ width: '100%' }}>
//           {steps.map((step, index) => (
//             <ListItem key={step.name} disablePadding sx={{ mb: 2 }}>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 {step.completed ? (
//                   <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: '2rem' }} />
//                 ) : (
//                   <Box
//                     sx={{
//                       width: 32,
//                       height: 32,
//                       borderRadius: '50%',
//                       border: '2px solid',
//                       borderColor: 'grey.500',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: 'grey.400',
//                       fontSize: '1.1rem',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     {index + 1}
//                   </Box>
//                 )}
//               </ListItemIcon>
//               <ListItemText
//                 primary={
//                   <Typography variant="h6" sx={{ fontWeight: step.completed ? 'bold' : 'normal', color: step.completed ? 'success.light' : 'grey.400' }}>
//                     {step.name}
//                   </Typography>
//                 }
//               />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Overlay for small screens when sidebar is open */}
//       {isSidebarOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             inset: 0,
//             bgcolor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 30,
//             display: { xs: 'block', md: 'none' },
//           }}
//           onClick={() => onNavigate('/header-input', { toggleSidebar: false })} // Close sidebar on overlay click
//         />
//       )}

//       {/* Right Content Area - Form and Live Preview */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           bgcolor: 'white',
//           p: { xs: 3, md: 4 },
//           display: 'flex',
//           flexDirection: { xs: 'column', lg: 'row' },
//           gap: 4,
//           transition: 'margin-left 0.3s ease-in-out',
//           ml: { xs: 0, md: isSidebarOpen ? '250px' : '0px' }
//         }}
//       >
//         {/* Form Section */}
//         <Box sx={{ width: { xs: '100%', lg: '66.66%' } }}>
//           <Typography variant="h4" component="h1" sx={{ fontWeight: 'extrabold', color: 'text.primary', mb: 1 }}>
//             Let's start with your header
//           </Typography>
//           <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
//             Include your full name and multiple ways for employers to reach you.
//           </Typography>

//           {/* Form fields using MUI TextField and Grid for layout */}
//           <Grid container spacing={3} mb={4}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="FIRST NAME"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//                 InputProps={{
//                   endAdornment: formData.firstName && <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="SURNAME"
//                 name="surname"
//                 value={formData.surname}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//                 InputProps={{
//                   endAdornment: formData.surname && <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="CITY"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="COUNTRY"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="PIN CODE"
//                 name="pinCode"
//                 value={formData.pinCode}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="PHONE"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//                 InputProps={{
//                   endAdornment: formData.phone && <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="EMAIL*"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 size="medium"
//                 InputProps={{
//                   endAdornment: formData.email && <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />,
//                 }}
//               />
//             </Grid>
//           </Grid>

//           {/* Bottom Navigation for Form */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: 1, borderColor: 'grey.200', pt: 3, mt: 4 }}>
//             <Button
//               onClick={() => onNavigate('/build-resume')} // Navigates back using path
//               variant="outlined"
//               sx={{ px: 3, py: 1.5, borderColor: 'grey.300', color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'semibold' }}
//             >
//               Back
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ px: 3, py: 1.5, fontWeight: 'semibold' }}
//             >
//               Continue
//             </Button>
//           </Box>
//         </Box>

//         {/* Live Resume Preview Section */}
//         <Box
//           sx={{
//             width: { xs: '100%', lg: '33.33%' },
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             p: 2,
//             bgcolor: 'grey.50',
//             borderRadius: '8px',
//             boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
//           }}
//         >
//           <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
//             Live Preview ({formData.firstName} {formData.surname})
//           </Typography>
//           {currentTemplate ? (
//             <Paper elevation={1} sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%', maxWidth: 280, overflow: 'hidden' }}>
//               <Box sx={{
//                 p: 2,
//                 color: 'white',
//                 bgcolor: getColorHex(currentTemplate.colorScheme, theme) // Dynamically set background from theme
//               }}>
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                   {formData.firstName.charAt(0).toUpperCase()}{formData.surname.charAt(0).toUpperCase()}
//                 </Typography>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
//                   {formData.firstName} {formData.surname}
//                 </Typography>
//                 <Typography variant="body2">{formData.email}</Typography>
//               </Box>
//               <Box sx={{ p: 1.5, typography: 'body2', color: 'text.secondary' }}>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 0.5 }}>SUMMARY</Typography>
//                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 0.5 }}>CONTACT</Typography>
//                 <Typography variant="caption" sx={{ mb: 0.5 }}>Phone: {formData.phone}</Typography>
//                 <Typography variant="caption" sx={{ mb: 0.5 }}>City: {formData.city}</Typography>
//                 <Typography variant="caption" sx={{ mb: 0.5 }}>Country: {formData.country}</Typography>
//                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block' }}>Pin Code: {formData.pinCode}</Typography>
//                 {/* Add other sections here with dummy data or prop-drilled data */}
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 0.5 }}>SKILLS</Typography>
//                 <List dense disablePadding sx={{ mb: 1.5 }}>
//                   <ListItem disableGutters disablePadding><ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '0.5rem' }} /></ListItemIcon><ListItemText primary={<Typography variant="caption">Skill 1</Typography>} /></ListItem>
//                   <ListItem disableGutters disablePadding><ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '0.5rem' }} /></ListItemIcon><ListItemText primary={<Typography variant="caption">Skill 2</Typography>} /></ListItem>
//                   <ListItem disableGutters disablePadding><ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '0.5rem' }} /></ListItemIcon><ListItemText primary={<Typography variant="caption">Skill 3</Typography>} /></ListItem>
//                 </List>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 0.5 }}>EXPERIENCE</Typography>
//                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block' }}>Job Title, Company Name (Dates)</Typography>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 0.5 }}>EDUCATION AND TRAINING</Typography>
//                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block' }}>Degree, University (Dates)</Typography>
//               </Box>
//             </Paper>
//           ) : (
//             <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>Select a template to see preview.</Typography>
//           )}
//           <Button
//             onClick={() => setShowChangeTemplateModal(true)} // Open the change template modal
//             sx={{ color: 'primary.main', textTransform: 'none', mt: 2, '&:hover': { textDecoration: 'underline' } }}
//           >
//             Change template
//           </Button>
//         </Box>
//       </Box>

//       {/* Change Template Modal component */}
//       <ChangeTemplateModal
//         show={showChangeTemplateModal}
//         onClose={() => setShowChangeTemplateModal(false)}
//         onSelectTemplate={handleTemplateSelectedFromModal}
//         selectedTemplateId={selectedTemplateId}
//       />
//     </Box>
//   );
// };

// export default HeaderInputPage;