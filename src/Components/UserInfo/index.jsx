import React, { useState, useEffect } from 'react';
import styles from './UserInfo.module.css';

const UserInfo = () => {
  // State for groups and selected group
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // State for modal visibility and the currently edited group
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({ id: null, title: '', info: [] });

  // API endpoints (customize these with your actual URLs)
  const API_BASE_URL = 'https://your-api-endpoint.com'; // Replace with your API base URL
  const GROUPS_ENDPOINT = `${API_BASE_URL}/api/groups`;

  // Fetch groups from API on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(GROUPS_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
          if (data.length > 0) setSelectedGroupId(data[0].id); // Default to first group
        } else {
          console.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, );

  // Save or update groups to API
  const saveGroupsToAPI = async (updatedGroups) => {
    try {
      const response = await fetch(GROUPS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGroups),
      });
      if (!response.ok) {
        console.error('Failed to save groups');
      }
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  };

  // Delete group from state and API
  const deleteGroup = async (groupId) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    setSelectedGroupId(updatedGroups.length > 0 ? updatedGroups[0].id : null); // Update selected if deleted
    await saveGroupsToAPI(updatedGroups); // Sync with API
  };

  // Open modal for adding a new group
  const addGroup = () => {
    const defaultFields = [
      { label: 'Name', value: '' },
      { label: 'Address', value: '' },
      { label: 'Phone Number', value: '' },
      { label: 'Email', value: '' },
    ];
    setCurrentGroup({ id: Date.now(), title: '', info: defaultFields });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing group
  const editGroup = (group) => {
    setCurrentGroup({ ...group, info: [...group.info] });
    setIsModalOpen(true);
    setSelectedGroupId(group.id); // Set as selected when editing
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setCurrentGroup({ ...currentGroup, title: e.target.value });
  };

  // Handle change for a specific field
  const handleFieldChange = (index, field, value) => {
    const updatedInfo = [...currentGroup.info];
    updatedInfo[index] = { ...updatedInfo[index], [field]: value };
    setCurrentGroup({ ...currentGroup, info: updatedInfo });
  };

  // Add a new custom field
  const addField = () => {
    setCurrentGroup({
      ...currentGroup,
      info: [...currentGroup.info, { label: '', value: '' }],
    });
  };

  // Remove a field
  const removeField = (index) => {
    const updatedInfo = currentGroup.info.filter((_, i) => i !== index);
    setCurrentGroup({ ...currentGroup, info: updatedInfo });
  };

  // Save the group (add or update), update local state, save to API, and close modal
  const saveGroup = () => {
    const updatedGroups = groups.some(g => g.id === currentGroup.id)
      ? groups.map(g => (g.id === currentGroup.id ? currentGroup : g))
      : [...groups, currentGroup];
    setGroups(updatedGroups);
    saveGroupsToAPI(updatedGroups);
    setIsModalOpen(false);
    if (!selectedGroupId) setSelectedGroupId(currentGroup.id); // Set as selected if none
  };

  // Close modal without saving
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h2>User Information</h2>
      <p>This is the UserInfo component. Display user details here, like name, email, etc.</p>
      
      <h3>Groups Cluster</h3>
      <div className={styles.cluster}>
        {groups.map(group => (
          <div
            key={group.id}
            className={`${styles.groupCard} ${selectedGroupId === group.id ? styles.selected : ''}`}
            onClick={() => editGroup(group)}
          >
            <strong>{group.title || 'Untitled Group'}</strong>
            <ul className={styles.groupPreview}>
              {group.info.map((field, index) => (
                <li key={index}>{field.label}: {field.value}</li>
              ))}
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      <button onClick={addGroup} className={styles.addButton}>Add New Group</button>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>{currentGroup.id ? 'Edit Group' : 'Add Group'}</h3>
            <form>
              <label>
                Group Title:
                <input
                  type="text"
                  value={currentGroup.title}
                  onChange={handleTitleChange}
                  className={styles.input}
                />
              </label>
              <h4>Custom Fields</h4>
              {currentGroup.info.map((field, index) => (
                <div key={index} className={styles.fieldRow}>
                  <input
                    type="text"
                    placeholder="Label (e.g., Name)"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addField} className={styles.addFieldButton}>
                Add Custom Field
              </button>
            </form>
            <div className={styles.modalButtons}>
              <button onClick={saveGroup} className={styles.saveButton}>Save</button>
              <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;