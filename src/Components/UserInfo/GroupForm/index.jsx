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

const ItemType = 'SECTION';

const sectionTypes = {
  education: { title: 'Education', fields: ['college', 'course', 'fieldOfStudy', 'startDate', 'endDate', 'grade', 'location'] },
  experience: { title: 'Experience', fields: ['jobTitle', 'company', 'location', 'startDate', 'endDate', 'description'] },
  skill: { title: 'Skill', fields: ['skill', 'rating'] },
  certification: { title: 'Certification', fields: ['name', 'institute', 'issueDate'] },
  language: { title: 'Language', fields: ['language', 'proficiency'] },
  project: { title: 'Project', fields: ['name', 'description', 'technologies', 'url'] },
  custom: { title: 'Custom', fields: ['label', 'value'] },
  summary: { title: 'Summary', fields: ['summary'] },
  achievement: { title: 'Achievement', fields: ['title', 'description', 'date'] },
};

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
      sx={{
        mb: 2,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: '#f5f5f5',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIndicator sx={{ color: '#666', cursor: 'grab' }} />
          <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {sectionTypes[section.name].title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#d32f2f', color: '#fff', textTransform: 'none', borderRadius: 6 }}
            onClick={() => removeSection(section.name)}
          >
            Remove Section
          </Button>
          <IconButton onClick={() => toggleSection(section.name)}>
            {expandedSections[section.name] ? (
              <ExpandLess sx={{ color: '#666' }} />
            ) : (
              <ExpandMore sx={{ color: '#666' }} />
            )}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expandedSections[section.name]}>
        <CardContent>
          {section.data.map((entry, entryIndex) => (
            <Box key={entryIndex} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
              {sectionTypes[section.name].fields.map(field => (
                <Box key={field} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={field.includes('Date') ? 'date' : 'text'}
                    multiline={field === 'summary' || field === 'description'}
                    rows={field === 'summary' || field === 'description' ? 4 : 1}
                    value={entry[field] || ''}
                    onChange={e => handleSectionChange(section.name, index, entryIndex, field, e.target.value)}
                    variant="outlined"
                    InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
                  />
                </Box>
              ))}
              {section.name !== 'summary' && (
                <Button
                  variant="outlined"
                  sx={{ color: '#d32f2f', borderColor: '#d32f2f', textTransform: 'none', borderRadius: 6 }}
                  onClick={() => removeEntry(section.name, entryIndex)}
                >
                  Remove Entry
                </Button>
              )}
            </Box>
          ))}
          {section.name !== 'summary' && (
            <Button
              variant="contained"
              sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', borderRadius: 6 }}
              onClick={() => addSectionEntry(section.name)}
            >
              Add {sectionTypes[section.name].title} Entry
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

  useEffect(() => {
    if (groupId) {
      const fetchGroup = async () => {
        console.log('Fetching group with ID:', groupId);
        const { groups } = await getGroups();
        const existingGroup = groups.find(g => g.id === groupId);
        if (existingGroup) {
          console.log('Found group:', existingGroup);
          setGroup({ ...existingGroup, sections: existingGroup.sections || [], groupName: existingGroup.groupName || '' });
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

  const handleInputChange = (field, value) => {
    console.log('Input change:', field, value);
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

  const handleSectionChange = (sectionName, sectionIndex, entryIndex, field, value) => {
    console.log('Section change:', { sectionName, sectionIndex, entryIndex, field, value });
    setGroup(prev => {
      const updatedSections = [...prev.sections];
      const targetSection = updatedSections[sectionIndex];
      if (!targetSection) return prev;
      const updatedData = (targetSection.data || []).map((item, i) =>
        i === entryIndex ? { ...item, [field]: value } : item
      );
      updatedSections[sectionIndex] = {
        ...targetSection,
        data: updatedData,
      };
      return { ...prev, sections: updatedSections };
    });
  };

  const addSectionEntry = (sectionName) => {
    console.log('Adding section entry:', sectionName);
    const fields = sectionTypes[sectionName].fields.reduce((acc, field) => ({
      ...acc,
      [field]: '',
    }), {});
    setGroup(prev => {
      const existingSection = prev.sections.find(s => s.name === sectionName);
      if (sectionName === 'summary') {
        return {
          ...prev,
          sections: [
            ...prev.sections.filter(s => s.name !== 'summary'),
            { name: 'summary', data: [fields] },
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

  const removeSection = (sectionName) => {
    console.log('Removing section:', sectionName);
    setGroup(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.name !== sectionName),
    }));
    setExpandedSections(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[sectionName];
      return newExpanded;
    });
  };

  const removeEntry = (sectionName, entryIndex) => {
    console.log('Removing entry:', sectionName, entryIndex);
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
  };

  const toggleSection = (sectionName) => {
    console.log('Toggling section:', sectionName);
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const moveSection = (fromIndex, toIndex) => {
    console.log('Moving section from:', fromIndex, 'to:', toIndex);
    setGroup(prev => {
      const reorderedSections = [...prev.sections];
      const [moved] = reorderedSections.splice(fromIndex, 1);
      reorderedSections.splice(toIndex, 0, moved);
      console.log('Reordered sections:', reorderedSections);
      return { ...prev, sections: reorderedSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting group:', group);
    const { groups } = await getGroups();
    const updatedGroups = groupId
      ? groups.map(g => (g.id === groupId ? group : g))
      : [...groups, group];
    await saveGroups({ groups: updatedGroups });
    navigate('/edit/userinfo', { state: { newGroup: group } });
  };

  const handleCancel = () => {
    console.log('Canceling form');
    navigate('/edit/userinfo');
  };

  console.log('Rendering GroupForm with group:', group, 'Expanded sections:', expandedSections);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, bgcolor: '#fff', borderRadius: 8 }}>
        <Typography variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 700, mb: 3 }}>
          {groupId ? 'Edit Profile' : 'Add New Profile'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Group Name"
                    type="text"
                    value={group.groupName || ''}
                    onChange={e => handleInputChange('groupName', e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>
                {[
                  { label: 'First Name', field: 'firstName', type: 'text' },
                  { label: 'Last Name', field: 'lastName', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phoneNo', type: 'tel' },
                  { label: 'City', field: 'address.city', type: 'text' },
                  { label: 'Pin Code', field: 'address.pinCode', type: 'text' },
                  { label: 'State', field: 'address.state', type: 'text' },
                  { label: 'Country', field: 'address.country', type: 'text' },
                ].map(({ label, field, type }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      type={type}
                      value={field.includes('address.') ? group.address[field.split('.')[1]] || '' : group[field] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
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
            variant="contained"
            sx={{ bgcolor: '#388e3c', color: '#fff', textTransform: 'none', borderRadius: 6 }}
            onClick={() => setShowModal(true)}
          >
            Add Section
          </Button>
          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle>Select Section</DialogTitle>
            <DialogContent>
              {Object.keys(sectionTypes).map(section => (
                <Button
                  key={section}
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    addSectionEntry(section);
                    setShowModal(false);
                  }}
                  disabled={group.sections.some(s => s.name === section)}
                  sx={{ mb: 1, textTransform: 'none', borderRadius: 6 }}
                >
                  {sectionTypes[section].title}
                </Button>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowModal(false)}
                sx={{ color: '#666', textTransform: 'none', borderRadius: 6 }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{ color: '#666', borderColor: '#666', textTransform: 'none', borderRadius: 6 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#1976d2', color: '#fff', textTransform: 'none', borderRadius: 6 }}
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