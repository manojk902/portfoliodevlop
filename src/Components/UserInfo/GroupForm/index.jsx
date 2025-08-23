
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroups, saveGroups } from '../DummyData';
import styles from '../UserInfo.module.css';

const GroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({ id: null, title: '', info: [] });
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!groupId;

  // Fetch groups from dummy data
  useEffect(() => {
    const data = getGroups();
    setGroups(data);
    if (isEdit) {
      const groupToEdit = data.find(g => g.id === parseInt(groupId));
      if (groupToEdit) {
        setCurrentGroup({ ...groupToEdit, info: [...groupToEdit.info] });
      }
    } else {
      const defaultFields = [
        { label: 'Name', value: '' },
        { label: 'Address', value: '' },
        { label: 'Phone Number', value: '' },
        { label: 'Email', value: '' },
      ];
      setCurrentGroup({ id: Date.now(), title: '', info: defaultFields });
    }
  }, [groupId, isEdit]);

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

  // Save the group and navigate back to userinfo
  const saveGroup = () => {
    const updatedGroups = groups.some(g => g.id === currentGroup.id)
      ? groups.map(g => (g.id === currentGroup.id ? currentGroup : g))
      : [...groups, currentGroup];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    navigate('/edit/userinfo', { state: { newGroup: currentGroup } });
  };

  // Cancel and navigate back to userinfo
  const cancel = () => {
    navigate('/edit/userinfo');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.subHeader}>{isEdit ? 'Edit Group' : 'Add Group'}</h3>
      <div className={styles.form}>
        <label className={styles.label}>
          Group Title:
          <input
            type="text"
            value={currentGroup.title}
            onChange={handleTitleChange}
            className={styles.input}
          />
        </label>
        <h4 className={styles.subHeader}>Custom Fields</h4>
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
        <button
          type="button"
          onClick={addField}
          className={styles.addFieldButton}
        >
          Add Custom Field
        </button>
      </div>
      <div className={styles.formActions}>
        <button onClick={saveGroup} className={styles.saveButton}>Save</button>
        <button onClick={cancel} className={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

export default GroupForm;
