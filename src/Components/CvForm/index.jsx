import React from 'react';
import {
  Container, Grid, Typography, TextField, Button, Paper, Box,
  Accordion, AccordionSummary, AccordionDetails, IconButton,
  MenuItem, Select, FormControl, InputLabel, Avatar,
  Chip, FormControlLabel, Switch
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  CardMembership as CardMembershipIcon,
  Star as StarIcon,
  Translate as TranslateIcon,
  Favorite as FavoriteIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const CvForm = ({ formData, setFormData, onSubmit, isEditMode }) => {
  // console.log("from cvform", formData);
  const userProfile = useSelector(state => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName

  // alert(isEditMode);
  const [photo, setPhoto] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(false);


  const handleChange = (fieldName) => (e) => {
    setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
  };

  const handleArrayChange = (field, index) => (e) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleObjectChange = (field, index, subfield) => (e) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [subfield]: e.target.value };
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field, template) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{
        p: 3,
        mb: 4,
        bgcolor: darkMode ? '#1e1e1e' : 'background.paper',
        color: darkMode ? '#e0e0e0' : 'text.primary'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {isEditMode ? "Edit CV" : "Create New CV"}
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          {/* Personal Info Section */}
          <Box sx={{ mb: 4, p: 3, bgcolor: darkMode ? '#252525' : '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Personal Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={photo}
                  sx={{ width: 120, height: 120, mb: 2, border: '3px solid', borderColor: 'secondary.main' }}
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Upload Photo
                  <input type="file" hidden onChange={handlePhotoUpload} />
                </Button>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="username"
                  value={username}
                  onChange={handleChange('userName')}
                  disabled
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                  InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Professional Summary"
                  value={formData.summary}
                  onChange={handleChange('summary')}
                  InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                  InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Experience Section */}
          <Accordion defaultExpanded sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <WorkIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Work Experience</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.experience.map((exp, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 3,
                  borderLeft: '3px solid',
                  borderColor: 'secondary.main',
                  bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={exp.jobTitle}
                        onChange={handleObjectChange('experience', index, 'jobTitle')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={exp.company}
                        onChange={handleObjectChange('experience', index, 'company')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={exp.location}
                        onChange={handleObjectChange('experience', index, 'location')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={handleObjectChange('experience', index, 'startDate')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={handleObjectChange('experience', index, 'endDate')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Description"
                        value={exp.description}
                        onChange={handleObjectChange('experience', index, 'description')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => removeItem('experience', index)}
                        disabled={formData.experience.length === 1}
                        sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('experience', {
                  jobTitle: '',
                  company: '',
                  location: '',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  description: ''
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Experience
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Education Section */}
          <Accordion defaultExpanded sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SchoolIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Education</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.education.map((edu, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 3,
                  borderLeft: '3px solid',
                  borderColor: 'secondary.main',
                  bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="College/University"
                        value={edu.collage}
                        onChange={handleObjectChange('education', index, 'collage')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Degree/Course"
                        value={edu.course}
                        onChange={handleObjectChange('education', index, 'course')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={handleObjectChange('education', index, 'fieldOfStudy')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Grade"
                        value={edu.grade}
                        onChange={handleObjectChange('education', index, 'grade')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={edu.location}
                        onChange={handleObjectChange('education', index, 'location')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={edu.startDate}
                        onChange={handleObjectChange('education', index, 'startDate')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={edu.endDate}
                        onChange={handleObjectChange('education', index, 'endDate')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => removeItem('education', index)}
                        disabled={formData.education.length === 1}
                        sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('education', {
                  collage: '',
                  course: '',
                  fieldOfStudy: '',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  grade: '',
                  location: ''
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Education
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Skills Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <StarIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Skills</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeItem('skills', index)}
                    sx={{
                      m: 0.5,
                      bgcolor: darkMode ? '#333' : 'secondary.light',
                      color: darkMode ? '#e0e0e0' : 'secondary.contrastText',
                      '& .MuiChip-deleteIcon': { color: darkMode ? '#e0e0e0' : 'secondary.contrastText' }
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Add Skill"
                  onClick={(e) => {
                    addItem('skills', e.target.value.trim());
                    e.target.value = '';
                  }}
                  InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                  InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                />
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const input = document.querySelector('input[label="Add Skill"]');
                    if (input && input.value.trim()) {
                      addItem('skills', input.value.trim());
                      input.value = '';
                    }
                  }}
                  variant="outlined"
                  sx={{
                    color: darkMode ? '#e0e0e0' : 'primary.main',
                    borderColor: darkMode ? '#555' : 'primary.main'
                  }}
                >
                  Add
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Certifications Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CardMembershipIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Certifications</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.certifications.map((cert, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: darkMode ? '#444' : 'divider',
                  borderRadius: 2
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Certificate Name"
                        value={cert.name}
                        onChange={handleObjectChange('certifications', index, 'name')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Issuing Institute"
                        value={cert.institute}
                        onChange={handleObjectChange('certifications', index, 'institute')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Issue Date"
                        type="date"
                        value={cert.issueDate}
                        onChange={handleObjectChange('certifications', index, 'issueDate')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => removeItem('certifications', index)}
                        disabled={formData.certifications.length === 1}
                        sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('certifications', {
                  name: '',
                  institute: '',
                  issueDate: new Date().toISOString().split('T')[0]
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Certification
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Languages Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TranslateIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Languages</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.languages.map((lang, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Language"
                      value={lang.language}
                      onChange={handleObjectChange('languages', index, 'language')}
                      InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: darkMode ? '#bbb' : 'inherit' }}>Proficiency</InputLabel>
                      <Select
                        value={lang.proficiency}
                        onChange={handleObjectChange('languages', index, 'proficiency')}
                        label="Proficiency"
                        sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}
                      >
                        <MenuItem value="basic">Basic</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="fluent">Fluent</MenuItem>
                        <MenuItem value="native">Native</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => removeItem('languages', index)}
                      disabled={formData.languages.length === 1}
                      sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('languages', {
                  language: '',
                  proficiency: 'normal'
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Language
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Projects Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CodeIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Projects</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.projects.map((project, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 3,
                  borderLeft: '3px solid',
                  borderColor: 'secondary.main',
                  bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project Name"
                        value={project.name}
                        onChange={handleObjectChange('projects', index, 'name')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Description"
                        value={project.description}
                        onChange={handleObjectChange('projects', index, 'description')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project URL"
                        value={project.url}
                        onChange={handleObjectChange('projects', index, 'url')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Technologies (comma separated)"
                        value={project.technologies.join(', ')}
                        onChange={(e) => {
                          const techs = e.target.value.split(',').map(t => t.trim());
                          handleObjectChange('projects', index, 'technologies')({ target: { value: techs } });
                        }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => removeItem('projects', index)}
                        disabled={formData.projects.length === 1}
                        sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('projects', {
                  name: '',
                  description: '',
                  url: '',
                  technologies: [],
                  projectImages: []
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Project
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Awards Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmojiEventsIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Awards</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.awards.map((award, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: darkMode ? '#444' : 'divider',
                  borderRadius: 2
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Award Title"
                        value={award.title}
                        onChange={handleObjectChange('awards', index, 'title')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Issuer"
                        value={award.issuer}
                        onChange={handleObjectChange('awards', index, 'issuer')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date Received"
                        type="date"
                        value={award.date}
                        onChange={handleObjectChange('awards', index, 'date')}
                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Description"
                        value={award.description}
                        onChange={handleObjectChange('awards', index, 'description')}
                        InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => removeItem('awards', index)}
                        disabled={formData.awards.length === 1}
                        sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('awards', {
                  title: '',
                  issuer: '',
                  date: new Date().toISOString().split('T')[0],
                  description: ''
                })}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Award
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Interests Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FavoriteIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Interests</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                {formData.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    onDelete={() => removeItem('interests', index)}
                    sx={{
                      m: 0.5,
                      bgcolor: darkMode ? '#333' : 'secondary.light',
                      color: darkMode ? '#e0e0e0' : 'secondary.contrastText',
                      '& .MuiChip-deleteIcon': { color: darkMode ? '#e0e0e0' : 'secondary.contrastText' }
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Add Interest"
                  onClick={(e) => {
                    addItem('interests', e.target.value.trim());
                    e.target.value = '';
                  }}
                  InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                  InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                />
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const input = document.querySelector('input[label="Add Interest"]');
                    if (input && input.value.trim()) {
                      addItem('interests', input.value.trim());
                      input.value = '';
                    }
                  }}
                  variant="outlined"
                  sx={{
                    color: darkMode ? '#e0e0e0' : 'primary.main',
                    borderColor: darkMode ? '#555' : 'primary.main'
                  }}
                >
                  Add
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Achievements Section */}
          <Accordion sx={{ mb: 2, bgcolor: darkMode ? '#252525' : '#fafafa' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmojiEventsIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">Achievements</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {formData.achievements.map((achievement, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      label={`Achievement ${index + 1}`}
                      value={achievement}
                      onChange={handleArrayChange('achievements', index)}
                      InputProps={{ style: { color: darkMode ? '#e0e0e0' : 'inherit' } }}
                      InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                    />
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => removeItem('achievements', index)}
                      disabled={formData.achievements.length === 1}
                      sx={{ color: darkMode ? '#f44336' : 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItem('achievements', '')}
                variant="outlined"
                sx={{
                  color: darkMode ? '#e0e0e0' : 'primary.main',
                  borderColor: darkMode ? '#555' : 'primary.main',
                  mt: 1
                }}
              >
                Add Achievement
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Submit Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              {isEditMode ? "Update CV" : "Save CV"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CvForm;