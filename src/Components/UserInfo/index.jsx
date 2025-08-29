import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGroups, saveGroups } from './DummyData';
import styles from './UserInfo.module.css';

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
      console.log('Fetched groups:', data); // Debug log
      const newGroup = location.state?.newGroup;
      if (newGroup) {
        const updatedGroups = [...data.filter(g => g.id !== newGroup.id), { ...newGroup, sections: newGroup.sections || [] }];
        console.log('Updated groups with new group:', updatedGroups); // Debug log
        setGroups(updatedGroups);
        await saveGroups({ groups: updatedGroups });
      } else if (data.length === 0) {
        const defaultGroup = {
          id: crypto.randomUUID(),
          firstName: '',
          lastName: '',
          email: '',
          phoneNo: '',
          address: { city: '', pinCode: '', state: '', country: '' },
          sections: [],
          isDefault: true,
        };
        console.log('Created default group:', defaultGroup); // Debug log
        setGroups([defaultGroup]);
        await saveGroups({ groups: [defaultGroup] });
      } else {
        const hasDefault = data.some(g => g.isDefault);
        const updatedData = data.map((g, index) => ({
          ...g,
          sections: g.sections || [],
          isDefault: !hasDefault && index === 0 ? true : g.isDefault || false,
        }));
        console.log('Updated groups with default:', updatedData); // Debug log
        setGroups(updatedData);
        await saveGroups({ groups: updatedData });
      }
    };
    fetchData();
  }, [location.pathname, location.state?.newGroup]);

  const deleteGroup = async (groupId) => {
    console.log('Attempting to delete group:', groupId, 'Current groups length:', groups.length, 'Groups:', groups); // Debug log
    if (groups.length <= 1) {
      alert("You can't delete this card, one card should always be there.");
      console.log('Deletion prevented: only one group remains'); // Debug log
      return;
    }
    const updatedGroups = groups.filter(g => g.id !== groupId);
    if (updatedGroups.length > 0 && groups.find(g => g.id === groupId)?.isDefault) {
      updatedGroups[0].isDefault = true;
    }
    console.log('Updated groups after deletion:', updatedGroups); // Debug log
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
    console.log('Setting default group:', groupId, 'Updated groups:', updatedGroups); // Debug log
    setGroups(updatedGroups);
    await saveGroups({ groups: updatedGroups });
  };

  console.log('Rendering groups:', groups); // Debug log
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>User Information</h2>
      {groups.length === 0 ? (
        <p className={styles.noProfilesMessage}>No profiles yet. Click 'Add New Profile' to create one.</p>
      ) : (
        <div className={styles.cluster}>
          {groups
            .filter(group => (group.firstName || '').trim() || (group.lastName || '').trim() || (group.email || '').trim() || (group.phoneNo || '').trim() || Object.values(group.address || {}).some(v => (v || '').trim()) || ((group.sections || []).length > 0))
            .map(group => (
              <div key={group.id} className={`${styles.groupCard} ${group.isDefault ? styles.defaultGroup : ''}`}>
                <div className={styles.groupHeader}>
                  <strong className={styles.groupTitle}>
                    {group.firstName} {group.lastName}
                    {group.isDefault && <span className={styles.defaultBadge}>Default</span>}
                  </strong>
                </div>
                <div className={styles.groupPreview}>
                  <ul>
                    {['firstName', 'lastName', 'email', 'phoneNo'].map(field => (
                      group[field] && <li key={field} className={styles.fieldItem}>{field.charAt(0).toUpperCase() + field.slice(1)}: {group[field]}</li>
                    ))}
                    {group.address && ['city', 'pinCode', 'state', 'country'].map(field => (
                      group.address[field] && <li key={field} className={styles.fieldItem}>{field.charAt(0).toUpperCase() + field.slice(1)}: {group.address[field]}</li>
                    ))}
                    {(group.sections || []).map((section, secIndex) => (
                      <li key={secIndex}>
                        <strong>{sectionTypes[section.name]?.title}</strong>
                        <ul>
                          {(section.data || []).map((item, itemIndex) => (
                            <li key={itemIndex}>
                              {sectionTypes[section.name]?.fields.map(field => (
                                item[field] && <div key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}: {item[field]}</div>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.groupActions}>
                  <button onClick={() => editGroup(group.id)} className={styles.editButton}>Edit</button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className={styles.deleteButton}
                    disabled={groups.length <= 1}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDefaultGroup(group.id)}
                    className={styles.defaultButton}
                    disabled={group.isDefault}
                  >
                    Set as Default
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <button onClick={addGroup} className={styles.addButton}>Add New Profile</button>
    </div>
  );
};

export default UserInfo;