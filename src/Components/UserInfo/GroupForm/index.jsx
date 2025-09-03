/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getGroups, saveGroups } from '../DummyData';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess, DragIndicator } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { apiUrl } from '../../../utils/common';

// Define section types with fields, required fields, and whether they allow multiple entries
const sectionTypes = {
  Education: { title: 'Education', fields: ['college', 'course', 'fieldOfStudy', 'startDate', 'endDate', 'grade', 'location'], required: ['college', 'course'], single: false },
  Experience: { title: 'Experience', fields: ['jobTitle', 'company', 'location', 'startDate', 'endDate', 'description'], required: ['jobTitle', 'company'], single: false },
  Skill: { title: 'Skill', fields: ['skill', 'rating'], required: ['skill', 'rating'], single: false },
  Certification: { title: 'Certification', fields: ['name', 'institute', 'issueDate'], required: ['name'], single: false },
  Language: { title: 'Language', fields: ['language', 'proficiency'], required: ['language'], single: false },
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
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      type={field.includes('Date') ? 'date' : field === 'rating' ? 'number' : 'text'}
                      multiline={field === 'summary' || field === 'description'}
                      rows={field === 'summary' || field === 'description' ? 4 : 1}
                      value={
                        field === 'technologies' || field === 'projectImages'
                          ? Array.isArray(entry[field]) ? entry[field].join(', ') : entry[field] || ''
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
                      InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
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
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
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
      "https://linkedin.com/in/johndoe",
      "https://github.com/johndoe"
    ],
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    sections: []
  })
  console.log(group);

  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [errors, setErrors] = useState({});

  // Load existing group data if editing
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getSingleCv/mukesh_277/${groupId}`);
        console.log("pppr", response.data.singleCv);

        const cvData = response.data.singleCv; // pehla CV record
        console.log("ppp", cvData);


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
            userId: 4,
            cvInfoId: cvData?.cvInfoId,
            firstName: cvData?.firstName || "",
            lastName: cvData?.lastName || "",
            email: cvData?.email || "",
            phoneNo: cvData?.phoneNo || "",
            dob: cvData?.dob || "",
            gender: cvData?.gender || "",
            designation: cvData?.designation || "",
            socialLinks: [
              "https://linkedin.com/in/johndoe",
              "https://github.com/johndoe"
            ],
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


  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    // for create 
    // const payloadCreateCv = {
    //   userId: 4,
    //   userName: "mukesh_277",
    //   cvInfo: [
    //     {
    //       firstName: group.firstName,
    //       lastName: group.lastName,
    //       email: group.email,
    //       phoneNo: Number(group.phoneNo),
    //       dob: Date(group.dob),
    //       gender: group.gender,
    //       profilePhoto: "https://example.com/photo.jpg",
    //       designation: group.designation,
    //       socialLinks: [
    //         "https://linkedin.com/in/mukesh",
    //         "https://github.com/mukesh"
    //       ],
    //       address: {
    //         city: group.city,
    //         pinCode: Number(group.zip),
    //         state: group.state,
    //         country: group.country
    //       },
    //       sections: formattedSections
    //     }
    //   ]
    // }
    // try {
    //   const response = await axios.post(`${apiUrl}/create-cv`, payloadCreateCv);
    //   console.log(response, "this from cv");
    //   navigate('/edit/');
    // }
    // catch {
    //   alert('Failed to save CV. Please try again.');
    // }


    const payloadCvCreate = {
      userName: "mukesh_277",
      userId: 4,
      cvInfoId: groupId,
      updateCvInfoSet: {
        firstName: group.firstName,
        lastName: group.lastName,
        email: group.email,
        phoneNo: group.phoneNo,
        dob: group.dob,
        gender: group.gender,
        designation: group.designation,
        socialLinks: [
          "https://linkedin.com/in/johndoe",
          "https://github.com/johndoe"
        ],
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
      response = await axios.put(`${apiUrl}/updateCvInfoSet`, payloadCvCreate);
      navigate('/edit/userinfo');

    } else {
      //  response = await axios.post(`${apiUrl}/create-cv`, payload);
    }

    // }

    //   console.log('API response:', response.data);
    //   navigate('/edit/userinfo');
    // }

  };


  // Cancel form
  const handleCancel = () => {
    navigate('/edit/userinfo');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ fullWidth: true, mx: 'auto', p: 2, bgcolor: '#fff', borderRadius: 4 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
          {groupId ? 'Edit Profile' : 'Add New Profile'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Personal Information */}
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: 1 }}>Personal Information</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'First Name', field: 'firstName', type: 'text' },
                  { label: 'Last Name', field: 'lastName', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phoneNo', type: 'tel' },
                  { label: 'designation', field: 'designation', type: 'text' },
                  { label: 'dob', field: 'dob', type: 'text' },
                  { label: 'street', field: 'street', type: 'text' },
                  { label: 'City', field: 'city', type: 'text' },
                  { label: 'PinCode', field: 'zip', type: 'number' },
                  { label: 'State', field: 'state', type: 'text' },
                  { label: 'Country', field: 'country', type: 'text' },
                  { label: 'gender', field: 'gender', type: 'text' },
                ].map(({ label, field, type, required }) => (
                  <Grid item xs={12} sm={6} key={field} >
                    <TextField
                      fullWidth
                      label={label}
                      type={type}
                      // value={field ? group?.address[field.split('.')[1]] || '' : group[field] || ''}
                      value={group[field] ?? ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      variant="outlined"
                    // required={required}
                    />
                  </Grid>
                ))}
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
          <Button sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }} onClick={() => setShowModal(true)}>
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
                  disabled={group.sections.some(s => (s.name || '').toString().toLowerCase() === section.toLowerCase())}
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
            <Button sx={{ bgcolor: '#1976d2', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }} type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default GroupForm;