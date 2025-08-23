/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGroups, saveGroups } from './DummyData';
import styles from './UserInfo.module.css';

const UserInfo = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch groups from dummy data
  const fetchGroups = () => {
    const data = getGroups();
    const newGroup = location.state?.newGroup;
    if (newGroup) {
      // Add new group from navigation state if present
      const updatedGroups = [...data.filter(g => g.id !== newGroup.id), newGroup];
      setGroups(updatedGroups);
      setSelectedGroupId(newGroup.id);
      saveGroups(updatedGroups);
    } else if (data.length === 0) {
      const defaultGroup = {
        id: Date.now(),
        title: 'Default Group',
        info: [
          { label: 'Name', value: '' },
          { label: 'Address', value: '' },
          { label: 'Phone Number', value: '' },
          { label: 'Email', value: '' },
        ],
      };
      setGroups([defaultGroup]);
      setSelectedGroupId(defaultGroup.id);
      saveGroups([defaultGroup]);
    } else {
      setGroups(data);
      setSelectedGroupId(location.state?.newGroupId || data[0].id);
    }
  };

  // Fetch groups on mount and when navigating to /edit/userinfo
  useEffect(() => {
    fetchGroups();
  }, [location.pathname]);

  // Delete group from state and dummy data
  const deleteGroup = (groupId) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    setSelectedGroupId(updatedGroups.length > 0 ? updatedGroups[0]?.id : null);
    saveGroups(updatedGroups);
  };

  // Navigate to add new group
  const addGroup = () => {
    navigate('/edit/add-group');
  };

  // Navigate to edit an existing group and set as selected
  const editGroup = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/edit/edit-group/${groupId}`);
  };

  // Function to select a group without editing
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
            className={`${styles.groupCard} ${selectedGroupId === group.id ? styles.selected : ''}`}
          >
            <div onClick={() => selectGroup(group.id)} className={styles.groupContent}>
              <strong className={styles.groupTitle}>{group.title || 'Untitled Group'}</strong>
              <ul className={styles.groupPreview}>
                {group.info.map((field, index) => (
                  <li key={index} className={styles.fieldItem}>{field.label}: {field.value}</li>
                ))}
              </ul>
            </div>
            <div className={styles.groupActions}>
              <button
                onClick={() => editGroup(group.id)}
                className={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => deleteGroup(group.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addGroup} className={styles.addButton}>Add New Group</button>
    </div>
  );
};

export default UserInfo;