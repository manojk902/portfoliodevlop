import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGroups, saveGroups } from './DummyData';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
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

const UserInfo = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const { groups: data } = await getGroups();
      console.log('Fetched groups:', data);
      const newGroup = location.state?.newGroup;
      if (newGroup) {
        const updatedGroups = [...data.filter(g => g.id !== newGroup.id), { ...newGroup, sections: newGroup.sections || [], groupName: newGroup.groupName || '' }];
        console.log('Updated groups with new group:', updatedGroups);
        setGroups(updatedGroups);
        await saveGroups({ groups: updatedGroups });
      } else if (data.length === 0) {
        const defaultGroup = {
          id: crypto.randomUUID(),
          groupName: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNo: '',
          address: { city: '', pinCode: '', state: '', country: '' },
          sections: [],
          isDefault: true,
        };
        console.log('Created default group:', defaultGroup);
        setGroups([defaultGroup]);
        await saveGroups({ groups: [defaultGroup] });
      } else {
        const hasDefault = data.some(g => g.isDefault);
        const updatedData = data.map((g, index) => ({
          ...g,
          sections: g.sections || [],
          groupName: g.groupName || '',
          isDefault: !hasDefault && index === 0 ? true : g.isDefault || false,
        }));
        console.log('Updated groups with default:', updatedData);
        setGroups(updatedData);
        await saveGroups({ groups: updatedData });
      }
    };
    fetchData();
  }, [location.pathname, location.state?.newGroup]);

  const deleteGroup = async (groupId) => {
    console.log('Attempting to delete group:', groupId, 'Current groups length:', groups.length, 'Groups:', groups);
    if (groups.length <= 1) {
      alert("You can't delete this card, one card should always be there.");
      console.log('Deletion prevented: only one group remains');
      return;
    }
    const updatedGroups = groups.filter(g => g.id !== groupId);
    if (updatedGroups.length > 0 && groups.find(g => g.id === groupId)?.isDefault) {
      updatedGroups[0].isDefault = true;
    }
    console.log('Updated groups after deletion:', updatedGroups);
    setGroups(updatedGroups);
    await saveGroups({ groups: updatedGroups });
  };

  const addGroup = () => {
    navigate('/edit/add-group');
  };

  const editGroup = (groupId) => {
    navigate(`/edit/edit-group/${groupId}`);
  };

  const setDefaultGroup = async (groupId) => {
    const updatedGroups = groups.map(g => ({
      ...g,
      isDefault: g.id === groupId,
    }));
    console.log('Setting default group:', groupId, 'Updated groups:', updatedGroups);
    setGroups(updatedGroups);
    await saveGroups({ groups: updatedGroups });
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>User Information</Typography>
      {groups.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No profiles yet. Click 'Add New Profile' to create one.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {groups
            .filter(group => (group.groupName || '').trim() || (group.firstName || '').trim() || (group.lastName || '').trim() || (group.email || '').trim() || (group.phoneNo || '').trim() || Object.values(group.address || {}).some(v => (v || '').trim()) || ((group.sections || []).length > 0))
            .map(group => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <Card sx={{ 
                  border: group.isDefault ? '2px solid' : '1px solid', 
                  borderColor: group.isDefault ? 'success.main' : 'grey.300',
                  bgcolor: group.isDefault ? 'success.light' : 'background.paper',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {group.groupName || `${group.firstName || ''} ${group.lastName || ''}`.trim() || 'Unnamed Profile'}
                      {group.isDefault && (
                        <Typography component="span" color="success.main" sx={{ ml: 1, fontSize: '0.75rem', bgcolor: 'success.dark', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
                          Default
                        </Typography>
                      )}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, listStyleType: 'disc' }}>
                      {['groupName', 'firstName', 'lastName', 'email', 'phoneNo'].map(field => (
                        group[field] && (
                          <Typography component="li" variant="body2" key={field} sx={{ mb: 1 }}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}: {group[field]}
                          </Typography>
                        )
                      ))}
                      {group.address && ['city', 'pinCode', 'state', 'country'].map(field => (
                        group.address[field] && (
                          <Typography component="li" variant="body2" key={field} sx={{ mb: 1 }}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}: {group.address[field]}
                          </Typography>
                        )
                      ))}
                      {(group.sections || []).map((section, secIndex) => (
                        <Typography component="li" key={secIndex} sx={{ mb: 1 }}>
                          <strong>{sectionTypes[section.name]?.title || section.name}</strong>
                          <Box component="ul" sx={{ pl: 2, listStyleType: 'circle' }}>
                            {(section.data || []).map((item, itemIndex) => (
                              <Typography component="li" key={itemIndex}>
                                {sectionTypes[section.name]?.fields.map(field => (
                                  item[field] && (
                                    <Typography key={field} variant="body2">
                                      {field.charAt(0).toUpperCase() + field.slice(1)}: {item[field]}
                                    </Typography>
                                  )
                                ))}
                              </Typography>
                            ))}
                          </Box>
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button onClick={() => editGroup(group.id)} color="primary">Edit</Button>
                    <Button
                      onClick={() => deleteGroup(group.id)}
                      color="error"
                      disabled={groups.length <= 1}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => setDefaultGroup(group.id)}
                      color="success"
                      disabled={group.isDefault}
                    >
                      Set as Default
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
      <Button variant="contained" color="primary" onClick={addGroup}>
        Add New Profile
      </Button>
    </Box>
  );
};

export default UserInfo;