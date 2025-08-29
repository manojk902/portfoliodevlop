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
} from '@mui/material';

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

  useEffect(() => {
    if (groupId) {
      const fetchGroup = async () => {
        const { groups } = await getGroups();
        const existingGroup = groups.find(g => g.id === groupId);
        if (existingGroup) {
          setGroup({ ...existingGroup, sections: existingGroup.sections || [], groupName: existingGroup.groupName || '' });
        }
      };
      fetchGroup();
    }
  }, [groupId]);

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

  const handleSectionChange = (sectionName, sectionIndex, entryIndex, field, value) => {
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
  };

  const removeSection = (sectionName) => {
    setGroup(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.name !== sectionName),
    }));
  };

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
        }
      }
      return { ...prev, sections: updatedSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { groups } = await getGroups();
    const updatedGroups = groupId
      ? groups.map(g => (g.id === groupId ? group : g))
      : [...groups, group];
    await saveGroups({ groups: updatedGroups });
    navigate('/edit/userinfo', { state: { newGroup: group } });
  };

  const handleCancel = () => {
    navigate('/edit/userinfo');
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        {groupId ? 'Edit Profile' : 'Add New Profile'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
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
          <Card key={section.name} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{sectionTypes[section.name].title}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeSection(section.name)}
                >
                  Remove Section
                </Button>
              </Box>
              {section.data.map((entry, entryIndex) => (
                <Box key={entryIndex} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2, mb: 2, bgcolor: 'grey.50' }}>
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
                      color="error"
                      onClick={() => removeEntry(section.name, entryIndex)}
                      sx={{ mt: 1 }}
                    >
                      Remove Entry
                    </Button>
                  )}
                </Box>
              ))}
              {section.name !== 'summary' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => addSectionEntry(section.name)}
                >
                  Add {sectionTypes[section.name].title} Entry
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        <Button
          variant="contained"
          color="success"
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
                sx={{ mb: 1 }}
              >
                {sectionTypes[section].title}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupForm;