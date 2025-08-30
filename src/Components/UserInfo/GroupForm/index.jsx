import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Define section types based on schema
const sectionTypes = {
  education: { title: 'Education', fields: ['college', 'course', 'fieldOfStudy', 'startDate', 'endDate', 'grade', 'location'], required: ['college', 'course'] },
  experience: { title: 'Experience', fields: ['jobTitle', 'company', 'location', 'startDate', 'endDate', 'description'], required: ['jobTitle', 'company'] },
  skill: { title: 'Skill', fields: ['skill', 'rating'], required: ['skill', 'rating'] },
  certification: { title: 'Certification', fields: ['name', 'institute', 'issueDate'], required: ['name'] },
  language: { title: 'Language', fields: ['language', 'proficiency'], required: ['language'] },
  project: { title: 'Project', fields: ['name', 'description', 'url', 'technologies', 'projectImages'], required: ['name'] },
  summary: { title: 'Summary', fields: ['summary'], required: ['summary'], single: true },
  achievement: { title: 'Achievement', fields: ['title'], required: ['title'] },
  interest: { title: 'Interest', fields: ['interest'], required: ['interest'] },
  award: { title: 'Award', fields: ['title', 'issuer', 'date', 'description'], required: ['title'] },
};

const ItemType = 'SECTION';

// Draggable section component
const DraggableSection = ({ section, index, moveSection, toggleSection, expandedSections, handleSectionChange, removeSection, removeEntry, addSectionEntry }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
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
    <Card
      ref={node => drag(drop(node))}
      sx={{ mb: 1, borderRadius: 4, opacity: isDragging ? 0.5 : 1 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIndicator sx={{ color: '#666', fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
            {sectionTypes[section.name].title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            sx={{ color: '#d32f2f', textTransform: 'none', fontSize: '0.875rem' }}
            onClick={() => removeSection(section.name)}
          >
            Remove
          </Button>
          <IconButton onClick={() => toggleSection(section.name)}>
            {expandedSections[section.name] ? <ExpandLess sx={{ color: '#666', fontSize: 20 }} /> : <ExpandMore sx={{ color: '#666', fontSize: 20 }} />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expandedSections[section.name]}>
        <CardContent sx={{ p: 2 }}>
          {section.data.map((entry, entryIndex) => (
            <Box key={entryIndex} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 2, mb: 1 }}>
              {sectionTypes[section.name].fields.map(field => (
                <Box key={field} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={field.includes('Date') ? 'date' : field === 'rating' ? 'number' : 'text'}
                    multiline={field === 'summary' || field === 'description' || field === 'technologies' || field === 'projectImages'}
                    rows={field === 'summary' || field === 'description' ? 4 : 1}
                    value={entry[field] || ''}
                    onChange={e => handleSectionChange(section.name, index, entryIndex, field, e.target.value)}
                    variant="outlined"
                    InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
                    error={sectionTypes[section.name].required.includes(field) && !entry[field]}
                    helperText={sectionTypes[section.name].required.includes(field) && !entry[field] ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required` : ''}
                    inputProps={field === 'rating' ? { min: 1, max: 5 } : undefined}
                  />
                </Box>
              ))}
              {!sectionTypes[section.name].single && (
                <Button
                  sx={{ color: '#d32f2f', textTransform: 'none', fontSize: '0.875rem' }}
                  onClick={() => removeEntry(section.name, entryIndex)}
                >
                  Remove Entry
                </Button>
              )}
            </Box>
          ))}
          {!sectionTypes[section.name].single && (
            <Button
              sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }}
              onClick={() => addSectionEntry(section.name)}
            >
              Add Entry
            </Button>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const GroupForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({
    id: crypto.randomUUID(),
    groupName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: { city: '', pinCode: '', state: '', country: '' },
    sections: [],
    isDefault: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [errors, setErrors] = useState({});

  // Load existing group for editing
  useEffect(() => {
    if (groupId) {
      const fetchGroup = async () => {
        const { groups } = await getGroups();
        const existingGroup = groups.find(g => g.id === groupId);
        if (existingGroup) {
          setGroup({ ...existingGroup, sections: existingGroup.sections || [] });
          setExpandedSections(
            (existingGroup.sections || []).reduce((acc, section) => ({
              ...acc,
              [section.name]: false,
            }), {})
          );
        }
      };
      fetchGroup();
    }
  }, [groupId]);

  // Handle input changes for personal info (unchanged)
  const handleInputChange = (field, value) => {
    if (field.includes('address.')) {
      const addressField = field.split('.')[1];
      setGroup(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setGroup(prev => ({ ...prev, [field]: value }));
    }
  };

  // Handle section field changes
  const handleSectionChange = (sectionName, sectionIndex, entryIndex, field, value) => {
    setGroup(prev => {
      const updatedSections = [...prev.sections];
      const targetSection = updatedSections[sectionIndex];
      if (!targetSection) return prev;
      const updatedData = targetSection.data.map((item, i) =>
        i === entryIndex ? { ...item, [field]: field === 'rating' ? Number(value) : value } : item
      );
      updatedSections[sectionIndex] = { ...targetSection, data: updatedData };
      return { ...prev, sections: updatedSections };
    });
    // Clear error on change
    setErrors(prev => ({ ...prev, [`${sectionName}_${entryIndex}_${field}`]: '' }));
  };

  // Add a new section or entry
  const addSectionEntry = (sectionName) => {
    const fields = sectionTypes[sectionName].fields.reduce((acc, field) => ({
      ...acc,
      [field]: field === 'rating' ? 1 : '',
    }), {});
    setGroup(prev => {
      const existingSection = prev.sections.find(s => s.name === sectionName);
      if (sectionName === 'summary' || sectionName === 'achievement' || sectionName === 'interest') {
        return {
          ...prev,
          sections: [
            ...prev.sections.filter(s => s.name !== sectionName),
            { name: sectionName, data: sectionName === 'summary' ? fields.summary : [fields] },
          ],
        };
      }
      return {
        ...prev,
        sections: existingSection
          ? prev.sections.map(s =>
              s.name === sectionName
                ? { ...s, data: [...s.data, fields] }
                : s
            )
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
      if (sectionIndex !== -1) {
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
      const data = section.name === 'summary' ? [section.data] : section.data;
      data.forEach((entry, entryIndex) => {
        sectionConfig.required.forEach(field => {
          if (!entry[field]) {
            newErrors[`${section.name}_${entryIndex}_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
        if (section.name === 'skill' && entry.rating && (entry.rating < 1 || entry.rating > 5)) {
          newErrors[`${section.name}_${entryIndex}_rating`] = 'Rating must be between 1 and 5';
          isValid = false;
        }
      });
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

    // Format sections for API
    const formattedSections = group.sections.map(section => {
      if (section.name === 'summary') {
        return { name: section.name, data: section.data.summary || '' };
      }
      if (section.name === 'achievement' || section.name === 'interest') {
        return { name: section.name, data: section.data.map(entry => entry.title || entry.interest) };
      }
      return section;
    });

    try {
      const response = await fetch('http://192.168.0.3:9000/api/v1/portfolio/create-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: formattedSections }),
      });
      if (!response.ok) {
        throw new Error('Failed to create CV');
      }
      const result = await response.json();
      console.log('API response:', result);

      // Update local storage (fallback)
      const { groups } = await getGroups();
      const updatedGroups = groupId
        ? groups.map(g => (g.id === groupId ? { ...group, sections: formattedSections } : g))
        : [...groups, { ...group, sections: formattedSections }];
      await saveGroups({ groups: updatedGroups });

      navigate('/edit/userinfo', { state: { newGroup: group } });
    } catch (error) {
      console.error('API error:', error);
      alert('Failed to save CV. Please try again.');
    }
  };

  // Cancel form
  const handleCancel = () => {
    navigate('/edit/userinfo');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, bgcolor: '#fff', borderRadius: 4 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
          {groupId ? 'Edit Profile' : 'Add New Profile'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Personal Information (unchanged, no API) */}
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: 1 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Group Name', field: 'groupName', type: 'text', required: true },
                  { label: 'First Name', field: 'firstName', type: 'text' },
                  { label: 'Last Name', field: 'lastName', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phoneNo', type: 'tel' },
                  { label: 'City', field: 'address.city', type: 'text' },
                  { label: 'Pin Code', field: 'address.pinCode', type: 'text' },
                  { label: 'State', field: 'address.state', type: 'text' },
                  { label: 'Country', field: 'address.country', type: 'text' },
                ].map(({ label, field, type, required }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      type={type}
                      value={field.includes('address.') ? group.address[field.split('.')[1]] || '' : group[field] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      variant="outlined"
                      required={required}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          {/* Sections */}
          {group.sections.map((section, index) => (
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
          <Button
            sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }}
            onClick={() => setShowModal(true)}
          >
            Add Section
          </Button>
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
                  disabled={group.sections.some(s => s.name === section)}
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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              sx={{ color: '#666', textTransform: 'none', fontSize: '0.875rem' }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              sx={{ bgcolor: '#1976d2', color: '#fff', textTransform: 'none', fontSize: '0.875rem' }}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default GroupForm;