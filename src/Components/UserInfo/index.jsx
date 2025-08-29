/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGroups, saveGroups } from './DummyData';
import styles from './UserInfo.module.css';

const sectionTypes = {
  education: { title: 'Education' },
  workExperience: { title: 'Work Experience' },
  skills: { title: 'Skills' },
  languages: { title: 'Languages' },
  certifications: { title: 'Certifications' },
  projects: { title: 'Projects' },
  custom: { title: 'Custom Fields' },
};

const UserInfo = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [defaultGroupId, setDefaultGroupId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch groups and default group from dummy data
  const fetchGroups = () => {
    const { groups: data, defaultGroupId: storedDefaultId } = getGroups();
    const newGroup = location.state?.newGroup;
    
    if (newGroup) {
      const updatedGroups = [...data.filter(g => g.id !== newGroup.id), newGroup];
      setGroups(updatedGroups);
      setSelectedGroupId(newGroup.id);
      setDefaultGroupId(storedDefaultId || newGroup.id);
      saveGroups({ groups: updatedGroups, defaultGroupId: storedDefaultId || newGroup.id });
    } else if (data.length === 0) {
      const defaultGroup = {
        id: crypto.randomUUID(),
        title: 'Default Group',
        personalInfo: [
          { label: 'Name', value: '' },
          { label: 'Address', value: '' },
          { label: 'Phone Number', value: '' },
          { label: 'Email', value: '' },
        ],
        sections: [],
      };
      setGroups([defaultGroup]);
      setSelectedGroupId(defaultGroup.id);
      setDefaultGroupId(defaultGroup.id);
      saveGroups({ groups: [defaultGroup], defaultGroupId: defaultGroup.id });
    } else {
      setGroups(data);
      setSelectedGroupId(location.state?.newGroupId || storedDefaultId || data[0].id);
      setDefaultGroupId(storedDefaultId || data[0].id);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [location.pathname]);

  // Set a group as default
  const setDefaultGroup = (groupId) => {
    setDefaultGroupId(groupId);
    saveGroups({ groups, defaultGroupId: groupId });
  };

  // Delete group
  const deleteGroup = (groupId) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    let newDefaultGroupId = defaultGroupId;
    if (groupId === defaultGroupId) {
      newDefaultGroupId = updatedGroups.length > 0 ? updatedGroups[0].id : null;
    }
    setSelectedGroupId(updatedGroups.length > 0 ? updatedGroups[0]?.id : null);
    setDefaultGroupId(newDefaultGroupId);
    saveGroups({ groups: updatedGroups, defaultGroupId: newDefaultGroupId });
  };

  // Add group navigation
  const addGroup = () => {
    navigate('/edit/add-group');
  };

  // Edit group
  const editGroup = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/edit/edit-group/${groupId}`);
  };

  // Select group
  const selectGroup = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>User Information</h2>
      <p className={styles.description}>This is the UserInfo component. Display user details here, like name, email, etc.</p>

      <h3 className={styles.subHeader}>Groups Cluster</h3>
      <div className={styles.cluster}>
        {groups.map(group => (
          <div
            key={group.id}
            className={`${styles.groupCard} ${selectedGroupId === group.id ? styles.selected : ''} ${defaultGroupId === group.id ? styles.default : ''}`}
          >
            <div className={styles.groupHeader}>
              <div onClick={() => selectGroup(group.id)} className={styles.groupContent}>
                <strong className={styles.groupTitle}>{group.title || 'Untitled Group'}</strong>
                {defaultGroupId === group.id && <span className={styles.defaultBadge}>Default</span>}
              </div>
              <button
                onClick={() => setDefaultGroup(group.id)}
                className={styles.defaultButton}
                title="Set as Default"
              >
                ★
              </button>
            </div>
            <div className={styles.groupPreview}>
              <ul>
                {group.personalInfo.map((field, index) => (
                  <li key={index} className={styles.fieldItem}>{field.label}: {field.value}</li>
                ))}
                {group.sections?.map((section, secIndex) => (
                  <li key={secIndex}>
                    <strong className={styles.sectionTitle}>{sectionTypes[section.type]?.title}</strong>
                    <ul>
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className={styles.itemList}>
                          <ul>
                            {Object.entries(item).map(([key, value], fieldIndex) => (
                              <li key={fieldIndex}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.groupActions}>
              <button onClick={() => editGroup(group.id)} className={styles.editButton}>Edit</button>
              <button onClick={() => deleteGroup(group.id)} className={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addGroup} className={styles.addButton}>Add New Group</button>
    </div>
  );
};

export default UserInfo;