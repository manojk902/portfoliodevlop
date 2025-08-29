import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroups, saveGroups } from '../DummyData';
import styles from '../UserInfo.module.css';

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
          setGroup({ ...existingGroup, sections: existingGroup.sections || [] });
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
        // For summary, replace existing summary if it exists, or add new
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
    navigate('/', { state: { newGroup: group } });
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{groupId ? 'Edit Profile' : 'Add New Profile'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.personalInfoSection}>
          <h3 className={styles.subHeader}>Personal Information</h3>
          <div className={styles.fieldRow}>
            <label className={styles.label}>First Name:</label>
            <input
              type="text"
              className={styles.input}
              value={group.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Last Name:</label>
            <input
              type="text"
              className={styles.input}
              value={group.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              className={styles.input}
              value={group.email}
              onChange={e => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Phone:</label>
            <input
              type="tel"
              className={styles.input}
              value={group.phoneNo}
              onChange={e => handleInputChange('phoneNo', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>City:</label>
            <input
              type="text"
              className={styles.input}
              value={group.address.city}
              onChange={e => handleInputChange('address.city', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Pin Code:</label>
            <input
              type="text"
              className={styles.input}
              value={group.address.pinCode}
              onChange={e => handleInputChange('address.pinCode', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>State:</label>
            <input
              type="text"
              className={styles.input}
              value={group.address.state}
              onChange={e => handleInputChange('address.state', e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Country:</label>
            <input
              type="text"
              className={styles.input}
              value={group.address.country}
              onChange={e => handleInputChange('address.country', e.target.value)}
            />
          </div>
        </div>
        {group.sections.map((section, index) => (
          <div key={section.name} className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.subHeader}>{sectionTypes[section.name].title}</h3>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeSection(section.name)}
              >
                Remove Section
              </button>
            </div>
            {section.data.map((entry, entryIndex) => (
              <div key={entryIndex} className={styles.entryCard}>
                {sectionTypes[section.name].fields.map(field => (
                  <div key={field} className={styles.field}>
                    <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                    {field === 'summary' || field === 'description' ? (
                      <textarea
                        className={styles.textarea}
                        value={entry[field] || ''}
                        onChange={e => handleSectionChange(section.name, index, entryIndex, field, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.includes('Date') ? 'date' : 'text'}
                        className={styles.input}
                        value={entry[field] || ''}
                        onChange={e => handleSectionChange(section.name, index, entryIndex, field, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                {section.name !== 'summary' && (
                  <button
                    type="button"
                    className={styles.removeEntryButton}
                    onClick={() => removeEntry(section.name, entryIndex)}
                  >
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            {section.name !== 'summary' && (
              <button
                type="button"
                className={styles.addButtonSmall}
                onClick={() => addSectionEntry(section.name)}
              >
                Add {sectionTypes[section.name].title} Entry
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className={styles.addFieldButton}
          onClick={() => setShowModal(true)}
        >
          Add Section
        </button>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Select Section</h3>
              {Object.keys(sectionTypes).map(section => (
                <button
                  key={section}
                  className={styles.modalButton}
                  onClick={() => {
                    addSectionEntry(section);
                    setShowModal(false);
                  }}
                  disabled={group.sections.some(s => s.name === section)}
                >
                  {sectionTypes[section].title}
                </button>
              ))}
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;