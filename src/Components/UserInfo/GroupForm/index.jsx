/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Collapse, IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
} from '@mui/material';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
import { ExpandMore, ExpandLess, DragIndicator } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { apiUrl } from '../../../utils/common';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

// Define section types with fields, required fields, and whether they allow multiple entries
const sectionTypes = {
  Education: { title: 'Education', fields: ['college', 'course', 'fieldOfStudy', 'startDate', 'endDate', 'grade', 'location'], required: ['college'], single: false },
  Experience: { title: 'Experience', fields: ['jobTitle', 'company', 'location', 'startDate', 'endDate', 'description'], required: ['jobTitle', 'company'], single: false },
  Skill: { title: 'Skill', fields: ['skill', 'rating'], required: ['skill', 'rating'], single: false },
  Certification: { title: 'Certification', fields: ['name', 'institute', 'issueDate'], required: ['name'], single: false },
  // Language: { title: 'Language', fields: ['language', 'proficiency'], required: ['language'], single: false },
  Language: {
    title: 'Language',
    fields: ['language', 'proficiency'],
    required: ['language', 'proficiency'],
    single: false
  },
  Project: { title: 'Project', fields: ['name', 'description', 'url', 'technologies', 'projectImages'], required: ['name'], single: false },
  Summary: { title: 'Summary', fields: ['summary'], required: ['summary'], single: true },
  Achievement: { title: 'Achievement', fields: ['title'], required: ['title'], single: false },
  Interest: { title: 'Interest', fields: ['interest'], required: ['interest'], single: false },
  Award: { title: 'Award', fields: ['title', 'issuer', 'date', 'description'], required: ['title'], single: false },
};

const ItemType = 'SECTION';

// Component for a draggable section (e.g., Education, Project)
const DraggableSection = ({ section, index, moveSection, toggleSection, expandedSections, handleSectionChange, removeSection, removeEntry, addSectionEntry }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <Card ref={node => drag(drop(node))} sx={{ mb: 1, borderRadius: 4, opacity: isDragging ? 0.5 : 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIndicator sx={{ color: '#666', fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>{sectionTypes[section.name].title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button sx={{ color: '#d32f2f', textTransform: 'none', fontSize: '0.875rem' }} onClick={() => removeSection(section.name)}>
            Remove
          </Button>
          <IconButton onClick={() => toggleSection(section.name)}>
            {expandedSections[section.name] ? <ExpandLess sx={{ color: '#666', fontSize: 20 }} /> : <ExpandMore sx={{ color: '#666', fontSize: 20 }} />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expandedSections[section.name]}>
        <CardContent sx={{ p: 2 }}>
          {sectionTypes[section.name].single ? (
            // Single-section UI (Summary as a string)
            <Box sx={{ mb: 1 }}>
              <TextField
                fullWidth
                label={sectionTypes[section.name].fields[0].charAt(0).toUpperCase() + sectionTypes[section.name].fields[0].slice(1)}
                multiline
                rows={4}
                value={section.data ?? ''}
                onChange={e => handleSectionChange(section.name, index, 0, sectionTypes[section.name].fields[0], e.target.value)}
                variant="outlined"
                error={sectionTypes[section.name].required.includes(sectionTypes[section.name].fields[0]) && !section.data}
                helperText={
                  sectionTypes[section.name].required.includes(sectionTypes[section.name].fields[0]) && !section.data
                    ? `${sectionTypes[section.name].fields[0].charAt(0).toUpperCase() + sectionTypes[section.name].fields[0].slice(1)} is required`
                    : ''
                }
              />
            </Box>
          ) : (
            // Existing multi-entry UI (unchanged)
            (section.data || []).map((entry, entryIndex) => (
              <Box key={entryIndex} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 2, mb: 1 }}>
                {sectionTypes[section.name].fields.map(field => (
                  <Box key={field} sx={{ mb: 1 }}>
                    {field === 'description' ? (
                      <>
                        <Typography variant="body2" sx={{ mb: 1 }}>Description</Typography>
                        <MDEditor
                          value={entry[field] || ""}
                          onChange={(val) =>
                            handleSectionChange(section.name, index, entryIndex, field, val || "")
                          }
                          preview="edit"
                          height={200}
                        />
                      </>
                    ) :
                      field === 'proficiency' && section.name === 'Language' ? (
                        <FormControl fullWidth margin="normal">
                          {/* <TextField> */}
                          <InputLabel>Proficiency</InputLabel>
                          {/* </TextField> */}

                          <Select
                            label="Proficiency"
                            value={entry[field] || ""}
                            onChange={(e) =>
                              handleSectionChange(section.name, index, entryIndex, field, e.target.value)
                            }
                          >
                            <MenuItem value="normal">normal</MenuItem>
                            <MenuItem value="good">good</MenuItem>
                            <MenuItem value="very-good">very-good</MenuItem>
                            <MenuItem value="excellent">excellent</MenuItem>
                          </Select>
                          {sectionTypes[section.name].required.includes(field) && !entry[field] && (
                            <Typography color="error" variant="caption">{`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}</Typography>
                          )}
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          type={/date$/i.test(field) ? 'date' : field === 'rating' ? 'number' : 'text'}
                          multiline={field === 'summary'}
                          rows={field === 'summary' ? 4 : 1}
                          value={
                            field === 'technologies' || field === 'projectImages'
                              ? Array.isArray(entry[field]) ? entry[field].join(',') : entry[field] || ''
                              : /date$/i.test(field) && entry[field] // only try formatting if it ends with "Date" and has a value
                                ? (() => {
                                  try {
                                    const parsed = parseISO(entry[field]);
                                    return isNaN(parsed) ? '' : format(parsed, 'yyyy-MM-dd');
                                  } catch {
                                    return '';
                                  }
                                })()
                                : entry[field] || ''
                          }
                          onChange={e => {
                            const value =
                              field === 'technologies' || field === 'projectImages'
                                ? e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                : e.target.value;
                            handleSectionChange(section.name, index, entryIndex, field, value);
                          }}
                          variant="outlined"
                          InputLabelProps={/date$/i.test(field) ? { shrink: true } : undefined}
                          error={sectionTypes[section.name].required.includes(field) && !entry[field]}
                          helperText={
                            sectionTypes[section.name].required.includes(field) && !entry[field]
                              ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
                              : (field === 'technologies' || field === 'projectImages') && entry[field] && !Array.isArray(entry[field])
                                ? 'Enter a comma-separated list'
                                : ''
                          }
                          inputProps={field === 'rating' ? { min: 1, max: 5 } : undefined}
                        />

                      )}
                  </Box>
                ))}

                {!sectionTypes[section.name].single && (
                  <Button sx={{ color: '#d32f2f', textTransform: 'none', fontSize: '0.875rem' }} onClick={() => removeEntry(section.name, entryIndex)}>
                    Remove Entry
                  </Button>
                )}
              </Box>
            ))

          )}

          {!sectionTypes[section.name].single && (
            <Button sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }} onClick={() => addSectionEntry(section.name)}>
              Add Entry
            </Button>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};


// Main form component
const GroupForm = () => {
  const userProfile = useSelector(state => state.userProfile.data);
  const theme = useTheme()
  const username = userProfile?.fetchedUsed?.userName
  const userId = userProfile?.fetchedUsed?.userId
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId",);
  const isEdit = searchParams.get("edit") === "true";
  const navigate = useNavigate();
  const [group, setGroup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    dob: "",
    gender: "",
    designation: "",
    socialLinks: [

    ],
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    sections: []
  });
  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [errors, setErrors] = useState({});

  // Load existing group data if editing
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getSingleCv/${username}/${groupId}`);
        const cvData = response.data.singleCv;
        // console.log();
        console.log('CV Data:', cvData);
        
        if (cvData) {
          const updatedSections = cvData.sections.map(section => {
            if (section.name.toLowerCase() === 'summary') {
              // return { name: 'Summary', data: '' };
              const data = Array.isArray(section.data) ? (section.data[0] || '') : (section.data || '');
              return { name: 'Summary', data };
            }
            if (section.name.toLowerCase() === 'achievement') {
              return { name: 'Achievement', data: section.data.map(entry => ({ title: entry })) };
            }
            if (section.name.toLowerCase() === 'interest') {
              return { name: 'Interest', data: section.data.map(entry => ({ interest: entry })) };
            }
            return section;
          });

          setGroup({
            userId: userId,
            cvInfoId: cvData?.cvInfoId,
            firstName: cvData?.firstName || "",
            lastName: cvData?.lastName || "",
            email: cvData?.email || "",
            phoneNo: cvData?.phoneNo || "",
            dob: cvData?.dob || "",
            gender: cvData?.gender || "",
            designation: cvData?.designation || "",
            socialLinks: cvData?.socialLinks && Array.isArray(cvData.socialLinks) ? cvData.socialLinks : [],
            street: cvData?.address?.street || "",
            city: cvData?.address?.city || "",
            state: cvData?.address?.state || "",
            zip: cvData?.address?.pinCode || "",
            country: cvData?.address?.country || "",
            sections: updatedSections,
          });

          setExpandedSections(
            updatedSections.reduce((acc, section) => ({ ...acc, [section.name]: false }), {})
          );
        }
      } catch (err) {
        console.error('Error fetching group:', err);
      }
    };
    fetchGroup();
  }
    , []);


  // Update personal info fields
  const handleInputChange = (field, value) => {
    setGroup(prev => ({ ...prev, [field]: value }));

    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Update section fields
  const handleSectionChange = (sectionName, sectionIndex, entryIndex, field, value) => {
    setGroup(prev => {
      const updatedSections = [...prev.sections];
      const targetSection = updatedSections[sectionIndex];
      if (!targetSection) return prev;

      if (sectionTypes[sectionName].single) {
        // store a string directly for single sections (e.g., Summary)
        updatedSections[sectionIndex] = { ...targetSection, data: value };
      } else {
        const updatedData = targetSection.data.map((item, i) =>
          i === entryIndex ? { ...item, [field]: field === 'rating' ? Number(value) : value } : item
        );
        updatedSections[sectionIndex] = { ...targetSection, data: updatedData };
      }
      return { ...prev, sections: updatedSections };
    });

    // keep same error key pattern (use entryIndex 0 for single sections)
    setErrors(prev => ({ ...prev, [`${sectionName}_${entryIndex}_${field}`]: '' }));
  };


  // Add a new section or entry
  const addSectionEntry = (sectionName) => {
    const fields = sectionTypes[sectionName].fields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: field === 'rating' ? 1 : field === 'technologies' || field === 'projectImages' ? [] : '',
      }),
      {}
    );
    setGroup(prev => {
      const existingSection = prev.sections.find(s => s.name === sectionName);
      if (sectionTypes[sectionName].single) {
        return {
          ...prev,
          sections: [
            ...prev.sections.filter(s => s.name !== sectionName),
            { name: sectionName, data: "" }],
        };
      }
      return {
        ...prev,
        sections: existingSection
          ? prev.sections.map(s => (s.name === sectionName ? { ...s, data: [...s.data, fields] } : s))
          : [...prev.sections, { name: sectionName, data: [fields] }],
      };
    });
    setExpandedSections(prev => ({ ...prev, [sectionName]: true }));
  };

  // Remove a section
  const removeSection = (sectionName) => {
    setGroup(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.name !== sectionName),
    }));
    setExpandedSections(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[sectionName];
      return newExpanded;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.startsWith(sectionName)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Remove an entry
  const removeEntry = (sectionName, entryIndex) => {
    setGroup(prev => {
      const updatedSections = [...prev.sections];
      const sectionIndex = updatedSections.findIndex(s => s.name === sectionName);
      if (sectionIndex !== -1 && !sectionTypes[sectionName].single) {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          data: updatedSections[sectionIndex].data.filter((_, i) => i !== entryIndex),
        };
        if (updatedSections[sectionIndex].data.length === 0) {
          updatedSections.splice(sectionIndex, 1);
          setExpandedSections(prev => {
            const newExpanded = { ...prev };
            delete newExpanded[sectionName];
            return newExpanded;
          });
        }
      }
      return { ...prev, sections: updatedSections };
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.startsWith(`${sectionName}_${entryIndex}`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Toggle section collapse
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Move section for drag-and-drop
  const moveSection = (fromIndex, toIndex) => {
    setGroup(prev => {
      const reorderedSections = [...prev.sections];
      const [moved] = reorderedSections.splice(fromIndex, 1);
      reorderedSections.splice(toIndex, 0, moved);
      return { ...prev, sections: reorderedSections };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    group.sections.forEach((section, sectionIndex) => {
      const sectionConfig = sectionTypes[section.name];

      if (sectionConfig.single) {
        // section.data is a string for single sections (e.g., Summary)
        sectionConfig.required.forEach(field => {
          const value = section.data;
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[`${section.name}_0_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
      } else {
        // existing multi-entry validation
        const data = section.data || [];
        data.forEach((entry, entryIndex) => {
          sectionConfig.required.forEach(field => {
            if (!entry[field] || (Array.isArray(entry[field]) && entry[field].length === 0)) {
              newErrors[`${section.name}_${entryIndex}_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
              isValid = false;
            }
          });
          if (section.name.toLowerCase() === 'skill' && entry.rating && (entry.rating < 1 || entry.rating > 5)) {
            newErrors[`${section.name}_${entryIndex}_rating`] = 'Rating must be between 1 and 5';
            isValid = false;
          }
          if (section.name.toLowerCase() === 'project' && entry.technologies && !Array.isArray(entry.technologies)) {
            newErrors[`${section.name}_${entryIndex}_technologies`] = 'Technologies must be a comma-separated list';
            isValid = false;
          }
          if (section.name.toLowerCase() === 'project' && entry.projectImages && !Array.isArray(entry.projectImages)) {
            newErrors[`${section.name}_${entryIndex}_projectImages`] = 'Project images must be a comma-separated list';
            isValid = false;
          }
        });
      }
    });

    setErrors(newErrors);
    return isValid;
  };


  // Simple validation for personal info
  const validatePersonalInfo = () => {
    const newErrors = {};
    // const lettersOnly = /^[A-Za-z]+$/;
    const lettersAndSpaces = /^[A-Za-z ]+$/;
    const numbersOnly = /^[0-9]+$/;

    if (!group.designation || !lettersAndSpaces.test(group.designation)) {
      newErrors.designation = "Only letters & spaces allowed";
    }

    if (!group.firstName || !lettersAndSpaces.test(group.firstName)) {
      newErrors.firstName = "Letters only";
    }

    if (!group.lastName || !lettersAndSpaces.test(group.lastName)) {
      newErrors.lastName = "Letters only";
    }

    if (!group.city || !lettersAndSpaces.test(group.city)) {
      newErrors.city = "Letters & spaces only";
    }
    if (!group.country || !lettersAndSpaces.test(group.country)) {
      newErrors.country = "Letters & spaces only";
    }

    if (!group.state || !lettersAndSpaces.test(group.state)) {
      newErrors.state = "Letters & spaces only";
    }
    if (!group.gender || !lettersAndSpaces.test(group.gender)) {
      newErrors.gender = "Letters & spaces only Ex:male,female,other";
    }

    if (!group.phoneNo || !numbersOnly.test(group.phoneNo)) {
      newErrors.phoneNo = "Numbers only";
    }

    if (!group.zip || !numbersOnly.test(group.zip)) {
      newErrors.zip = "Numbers only";
    }

    setErrors(prev => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };




  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePersonalInfo()) {
      alert('Please fill personal info correctly.');
      return;
    }
    if (!validateForm()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formattedSections = group.sections.map(section => {
      if (section.name === 'Summary') {
        return { name: section.name, data: section.data };
      }
      if (section.name === 'Achievement') {
        return { name: section.name, data: section.data.map(entry => entry.title) };
      }
      if (section.name === 'Interest') {
        return { name: section.name, data: section.data.map(entry => entry.interest) };
      }
      return section;
    });

    try {
      if (isEdit && groupId) {
        const payloadCvupdate = {
          userName: username,
          userId: userId,
          cvInfoId: groupId,
          updateCvInfoSet: {
            firstName: group.firstName,
            lastName: group.lastName,
            email: group.email,
            phoneNo: group.phoneNo,
            dob: group.dob,
            gender: group.gender,
            designation: group.designation,
            socialLinks: group.socialLinks,
            address: {
              street: group.street,
              city: group.city,
              state: group.state,
              pinCode: Number(group.zip),
              country: group.country
            },
            sections: formattedSections,
          },
        }
        let response;
        if (groupId) {
          response = await axios.put(`${apiUrl}/updateCvInfoSet`, payloadCvupdate);
          navigate('/edit');
          console.log("update");
        }
      } else {
        // for create 
        const payloadCreateCv = {
          userId: userId,
          userName: username,
          cvInfo: [
            {
              firstName: group.firstName,
              lastName: group.lastName,
              email: group.email,
              phoneNo: Number(group.phoneNo),
              dob: Date(group.dob),
              gender: group.gender,
              profilePhoto: group.profilePhoto || "",
              designation: group.designation,
              socialLinks: group.socialLinks,
              address: {
                city: group.city,
                pinCode: Number(group.zip),
                state: group.state,
                country: group.country
              },
              sections: formattedSections
            }
          ]
        }
        try {
          const response = await axios.post(`${apiUrl}/create-cv`, payloadCreateCv);
          console.log(response, "this from cv");
          navigate('/edit');
        }
        catch {
          alert('Failed to save CV. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save CV. Please try again.');
      return;
    }
  };

  // Cancel form
  const handleCancel = () => {
    navigate('/edit');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ fullWidth: true, mx: 'auto', p: 2, bgcolor: '#fff', borderRadius: 4 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
          {groupId ? `Update Info of ${groupId}` : 'Add New Info'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Personal Information */}
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: 1 }}>Personal Information</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'First Name', field: 'firstName', type: 'text', size: 6 },
                  { label: 'Last Name', field: 'lastName', type: 'text', size: 6 },
                  { label: 'Email', field: 'email', type: 'email', size: 6 },
                  { label: 'Phone', field: 'phoneNo', type: 'tel', size: 6 },
                  { label: 'designation', field: 'designation', type: 'text', size: 6 },
                  { label: 'street', field: 'street', type: 'text', size: 9 },
                  { label: 'City', field: 'city', type: 'text', size: 4 },
                  { label: 'PinCode', field: 'zip', type: 'number', size: 4 },
                  { label: 'State', field: 'state', type: 'text', size: 4 },
                  { label: 'Country', field: 'country', type: 'text', size: 6 },
                  { label: 'gender', field: 'gender', type: 'text', size: 6 },
                  { label: 'socialLinks', field: 'socialLinks', type: 'text', size: 6 },
                  { label: 'dob', field: 'dob', type: 'date', size: 3 }, // Use 'date' type for date picker
                ]
                  .map(({ label, field, type, size }) => {
                    let value = group[field] ?? '';

                    // format dob if it exists
                    if (field === 'dob' && value) {
                      try {
                        value = format(parseISO(value), 'yyyy-MM-dd'); // for input type="date"
                      } catch (err) {
                        console.warn('Invalid DOB format:', value);
                      }
                    }

                    return (

                      <Grid item xs={12} sm={size} md={6} lg={12} xl={10} key={field}>
                        {field === 'socialLinks' ? (
                          <TextField
                            fullWidth
                            label={label}
                            type="text"
                            value={Array.isArray(group.socialLinks) ? group.socialLinks.join(', ') : ''}
                            onChange={e => {
                              const linksArray = e.target.value
                                .split(',')
                                .map(link => link.trim())
                                .filter(link => link);
                              handleInputChange('socialLinks', linksArray);
                            }}
                            variant="outlined"
                            error={!!errors.socialLinks}
                            helperText={errors.socialLinks || ''}
                          />
                        ) :
                          <TextField
                            fullWidth
                            label={label}
                            type={type}
                            value={value}
                            onChange={e => handleInputChange(field, e.target.value)}
                            variant="outlined"
                            error={!!errors[field]}
                            helperText={errors[field] || ''}
                          />
                        }

                      </Grid>
                    );
                  })}
              </Grid>
            </CardContent>
          </Card>
          {/* Sections */}
          {(group.sections || []).map((section, index) => (
            <DraggableSection
              key={section.name}
              section={section}
              index={index}
              moveSection={moveSection}
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              handleSectionChange={handleSectionChange}
              removeSection={removeSection}
              removeEntry={removeEntry}
              addSectionEntry={addSectionEntry}
            />
          ))}
          {/* Add Section Button */}
          <Button sx={{ bgcolor:theme.palette.primary.main, color: '#fff', textTransform: 'none', fontSize: '0.875rem' }} onClick={() => setShowModal(true)}>
            Add Section
          </Button>
          {/* Modal for Adding Sections */}
          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle>Add Section</DialogTitle>
            <DialogContent>
              {Object.keys(sectionTypes).map(section => (
                <Button
                  key={section}
                  fullWidth
                  sx={{ textTransform: 'none', mb: 1 }}
                  onClick={() => {
                    addSectionEntry(section);
                    setShowModal(false);
                  }}
                  // disabled={group.sections.some(s => (s.name || '').toString().toLowerCase() === section.toLowerCase())}
                  disabled={group.sections.some(s => {
                    const sName = s?.name?.toString()?.toLowerCase() || '';
                    const sectionName = section?.toString()?.toLowerCase() || '';
                    return sName === sectionName;
                  })}
                >
                  {sectionTypes[section].title}
                </Button>
              ))}
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: '#666', textTransform: 'none' }} onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          {/* Form Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button sx={{ color: '#666', textTransform: 'none', fontSize: '0.875rem' }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button sx={{bgcolor:theme.palette.success.main, color: '#fff', textTransform: 'none', fontSize: '0.875rem' }} type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default GroupForm;