
import React, { useState, useEffect } from 'react';
import CvForm from '../../Components/CvForm';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiUrl } from '../../utils/common';

const CreateCvPage = () => {
  const userProfile = useSelector(state => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const userId = userProfile?.fetchedUsed?.userId; // Get userId for API call
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const isEditMode = searchParams.get('edit') === 'true';

  const [formData, setFormData] = useState({
    userId: userId,
    userName: username || '',
    summary: '',
    socialLinks: [{ platform: 'LinkedIn', url: '' }],
    experience: [{
      jobTitle: '',
      company: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      description: ''
    }],
    education: [{
      collage: '',
      course: '',
      fieldOfStudy: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      grade: '',
      location: ''
    }],
    skills: [],
    certifications: [{
      name: '',
      institute: '',
      issueDate: new Date().toISOString().split('T')[0]
    }],
    languages: [{
      language: '',
      proficiency: 'normal'
    }],
    interests: [],
    achievements: [],
    awards: [{
      title: '',
      issuer: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    }],
    projects: [{
      name: '',
      description: '',
      url: '',
      technologies: [],
      projectImages: []
    }],
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    country: ''
  });

  // Fetch and prefill data in edit mode
  useEffect(() => {
    if (isEditMode && username) {
      const fetchCvData = async () => {
        try {
          console.log('📡 Fetching CV data for userId:', username);
          // https://portfoliobackend-tpdr.onrender.com/api/v1/portfolio/cv-details/manoj_804%20
          const response = await axios.get(`${apiUrl}/cv-details/${username}`);
          const cvData = response.data.fetchedCv; // Adjust based on your API response structure
          console.log('✅ Fetched CV data:', cvData);
          
          // Merge fetched data with formData, ensuring all fields are covered
          setFormData(prev => ({
            ...prev,
            ...cvData,
            userId: userId, // Ensure userId is retained
            userName: username || cvData.userName || '',
            socialLinks: cvData?.socialLinks?.length ? cvData.socialLinks : [{ platform: 'LinkedIn', url: '' }],
            experience: cvData.experience?.length ? cvData.experience : [{
              jobTitle: '',
              company: '',
              location: '',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              description: ''
            }],
            education: cvData.education?.length ? cvData.education : [{
              collage: '',
              course: '',
              fieldOfStudy: '',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              grade: '',
              location: ''
            }],
            skills: cvData.skills || [],
            certifications: cvData.certifications?.length ? cvData.certifications : [{
              name: '',
              institute: '',
              issueDate: new Date().toISOString().split('T')[0]
            }],
            languages: cvData.languages?.length ? cvData.languages : [{
              language: '',
              proficiency: 'normal'
            }],
            interests: cvData.interests || [],
            achievements: cvData.achievements || [],
            awards: cvData.awards?.length ? cvData.awards : [{
              title: '',
              issuer: '',
              date: new Date().toISOString().split('T')[0],
              description: ''
            }],
            projects: cvData.projects?.length ? cvData.projects : [{
              name: '',
              description: '',
              url: '',
              technologies: [],
              projectImages: []
            }],
            fullName: cvData.fullName || '',
            phone: cvData.phone || '',
            email: cvData.email || '',
            city: cvData.city || '',
            state: cvData.state || '',
            country: cvData.country || ''
          }));
        } catch (error) {
          console.error('❌ Error fetching CV data:', error);
          handleOpenDialog('Error', 'Failed to load CV data. Please try again.');
        }
      };
      fetchCvData();
    }
  }, [isEditMode, userId, username]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const handleOpenDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateFormData = (data) => {
    const errors = [];

    if (!data.userName) errors.push('Username is required');
    if (!data.summary) errors.push('Summary is required');

    data.experience?.forEach((exp, i) => {
      if (!exp.jobTitle) errors.push(`Experience ${i + 1}: Job title is required`);
    });

    data.education?.forEach((edu, i) => {
      if (!edu.collage) errors.push(`Education ${i + 1}: College is required`);
    });

    data.projects?.forEach((proj, i) => {
      if (!proj.name) errors.push(`Project ${i + 1}: Name is required`);
    });

    data.languages?.forEach((lang, i) => {
      if (!lang.language) errors.push(`Language ${i + 1}: Language is required`);
    });

    return errors;
  };

  const handleSubmitCv = async (data) => {
    const cleanedData = {
      ...data,
      userId: userProfile?.fetchedUsed?.userId,
      skills: data.skills || [],
      interests: data.interests || [],
      achievements: data.achievements || [],
    };

    const validationErrors = validateFormData(cleanedData);
    if (validationErrors.length > 0) {
      handleOpenDialog("Validation Error", validationErrors.join('\n'));
      return;
    }

    try {
      const url = isEditMode
        ? `${apiUrl}/update-cv`
        : `${apiUrl}/create-cv`;

      const method = isEditMode ? 'put' : 'post';

      console.log(`📡 Sending ${method.toUpperCase()} request to: ${url}`);
      console.log("📦 Payload:", cleanedData);

      const response = await axios[method](url, cleanedData);

      handleOpenDialog("Success", isEditMode ? "CV updated successfully!" : "CV created successfully!");
      console.log('✅ API Response:', response.data);
    } catch (error) {
      console.error('❌ API Error:', error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      handleOpenDialog("Error", errorMessage);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
      >
        {isEditMode ? '📝 Update Your CV' : '🆕 Create New CV'}
      </Typography>

      <CvForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitCv}
        isEditMode={isEditMode}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography style={{ whiteSpace: 'pre-line' }}>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateCvPage;
