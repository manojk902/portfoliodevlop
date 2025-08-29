import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroups, saveGroups } from '../DummyData';
import styles from '../UserInfo.module.css';

const sectionTypes = {
  education: {
    title: 'Education',
    itemTemplate: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    },
  },
  workExperience: {
    title: 'Work Experience',
    itemTemplate: {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  },
  skills: {
    title: 'Skills',
    itemTemplate: {
      skill: '',
    },
  },
  languages: {
    title: 'Languages',
    itemTemplate: {
      language: '',
      proficiency: 'Intermediate',
    },
    proficiencyOptions: ['Native', 'Fluent', 'Intermediate', 'Basic'],
  },
  certifications: {
    title: 'Certifications',
    itemTemplate: {
      name: '',
      organization: '',
      dateIssued: '',
      expirationDate: '',
      description: '',
    },
  },
  projects: {
    title: 'Projects',
    itemTemplate: {
      name: '',
      description: '',
      technologies: '',
      link: '',
    },
  },
  custom: {
    title: 'Custom Fields',
    itemTemplate: {
      label: '',
      value: '',
    },
  },
};

const GroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({
    id: null,
    title: '',
    personalInfo: [
      { label: 'Name', value: '' },
      { label: 'Address', value: '' },
      { label: 'Phone Number', value: '' },
      { label: 'Email', value: '' },
    ],
    sections: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!groupId;

  // Fetch groups from dummy data
  useEffect(() => {
    const { groups: data } = getGroups();
    setGroups(Array.isArray(data) ? data : []);
    if (isEdit) {
      const groupToEdit = data.find(g => g.id === groupId); // Compare as strings
      if (groupToEdit) {
        const personalLabels = ['Name', 'Address', 'Phone Number', 'Email'];
        const personalInfo = personalLabels.map(label => ({
          label,
          value: groupToEdit.info?.find(f => f.label === label)?.value || '',
        }));
        let sections = groupToEdit.sections || [];
        if (groupToEdit.customFields && groupToEdit.customFields.length > 0 && !sections.find(s => s.type === 'custom')) {
          sections = [...sections, { type: 'custom', items: groupToEdit.customFields.map(f => ({ label: f.label, value: f.value })) }];
        }
        setCurrentGroup({
          id: groupToEdit.id,
          title: groupToEdit.title || '',
          personalInfo,
          sections: sections || [],
        });
      } else {
        console.error(`Group with ID ${groupId} not found`);
        // Fallback to default state with warning
        setCurrentGroup({
          id: groupId,
          title: 'Editing Group (Not Found)',
          personalInfo: [
            { label: 'Name', value: '' },
            { label: 'Address', value: '' },
            { label: 'Phone Number', value: '' },
            { label: 'Email', value: '' },
          ],
          sections: [],
        });
      }
    } else {
      setCurrentGroup({
        id: crypto.randomUUID(),
        title: '',
        personalInfo: [
          { label: 'Name', value: '' },
          { label: 'Address', value: '' },
          { label: 'Phone Number', value: '' },
          { label: 'Email', value: '' },
        ],
        sections: [],
      });
    }
  }, [groupId, isEdit]);

  // Handle title change
  const handleTitleChange = (e) => {
    setCurrentGroup({ ...currentGroup, title: e.target.value });
  };

  // Handle personal info change
  const handlePersonalInfoChange = (index, value) => {
    const updatedPersonalInfo = [...currentGroup.personalInfo];
    updatedPersonalInfo[index] = { ...updatedPersonalInfo[index], value };
    setCurrentGroup({ ...currentGroup, personalInfo: updatedPersonalInfo });
  };

  // Handle section item field change
  const handleSectionChange = (sectionType, itemIndex, field, value) => {
    const updatedSections = currentGroup.sections.map(section => {
      if (section.type === sectionType) {
        const updatedItems = section.items.map((item, i) => {
          if (i === itemIndex) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...section, items: updatedItems };
      }
      return section;
    });
    setCurrentGroup({ ...currentGroup, sections: updatedSections });
  };

  // Add a new section
  const addSection = (type) => {
    if (currentGroup.sections.find(s => s.type === type)) {
      alert('This section is already added.');
      return;
    }
    const template = sectionTypes[type].itemTemplate;
    const newSection = { type, items: [{ ...template }] };
    setCurrentGroup({
      ...currentGroup,
      sections: [...currentGroup.sections, newSection],
    });
    setIsModalOpen(false);
  };

  // Add a new item to a section
  const addItem = (type) => {
    const template = sectionTypes[type].itemTemplate;
    const updatedSections = currentGroup.sections.map(section => {
      if (section.type === type) {
        return { ...section, items: [...section.items, { ...template }] };
      }
      return section;
    });
    setCurrentGroup({ ...currentGroup, sections: updatedSections });
  };

  // Remove an item from a section
  const removeItem = (type, itemIndex) => {
    const updatedSections = currentGroup.sections.map(section => {
      if (section.type === type) {
        const updatedItems = section.items.filter((_, i) => i !== itemIndex);
        return { ...section, items: updatedItems };
      }
      return section;
    });
    setCurrentGroup({ ...currentGroup, sections: updatedSections });
  };

  // Remove a section
  const removeSection = (type) => {
    const updatedSections = currentGroup.sections.filter(section => section.type !== type);
    setCurrentGroup({ ...currentGroup, sections: updatedSections });
  };

  // Save the group and navigate back to userinfo
  const saveGroup = () => {
    const info = [...currentGroup.personalInfo];
    const groupToSave = { ...currentGroup, info };
    const updatedGroups = Array.isArray(groups) && groups.some(g => g.id === currentGroup.id)
      ? groups.map(g => (g.id === currentGroup.id ? groupToSave : g))
      : [...(Array.isArray(groups) ? groups : []), groupToSave];
    setGroups(updatedGroups);
    saveGroups({ groups: updatedGroups, defaultGroupId: getGroups().defaultGroupId });
    navigate('/edit/userinfo', { state: { newGroup: groupToSave } });
  };

  // Cancel and navigate back to userinfo
  const cancel = () => {
    navigate('/edit/userinfo');
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={`${styles.subHeader} ${isEdit ? styles.editHeader : ''}`}>
        {isEdit ? `Edit Group: ${currentGroup.title || 'Untitled'}` : 'Add Group'}
      </h3>
      {isEdit && (
        <p className={styles.editNotice}>
          You are editing group ID: {groupId}
        </p>
      )}
      <div className={styles.form}>
        <label className={styles.label}>
          Group Title:
          <input
            type="text"
            value={currentGroup.title}
            onChange={handleTitleChange}
            className={styles.input}
            placeholder="Enter group title"
          />
        </label>

        <h4 className={styles.subHeader}>Personal Info</h4>
        <div className={styles.personalInfoSection}>
          {currentGroup.personalInfo.map((field, index) => (
            <div key={index} className={styles.fieldRow}>
              <label className={styles.label}>{field.label}</label>
              <input
                type="text"
                placeholder={`Enter ${field.label}`}
                value={field.value}
                onChange={(e) => handlePersonalInfoChange(index, e.target.value)}
                className={styles.input}
              />
            </div>
          ))}
        </div>

        {currentGroup.sections.map((section) => {
          const config = sectionTypes[section.type];
          return (
            <div key={section.type} className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.subHeader}>{config.title}</h4>
                <button onClick={() => removeSection(section.type)} className={styles.removeButton}>Remove Section</button>
              </div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className={styles.entryCard}>
                  {Object.entries(config.itemTemplate).map(([field]) => (
                    <div key={field} className={styles.field}>
                      <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      {field === 'description' ? (
                        <textarea
                          value={item[field]}
                          onChange={(e) => handleSectionChange(section.type, itemIndex, field, e.target.value)}
                          className={styles.textarea}
                        />
                      ) : field === 'proficiency' ? (
                        <select
                          value={item[field]}
                          onChange={(e) => handleSectionChange(section.type, itemIndex, field, e.target.value)}
                          className={styles.input}
                        >
                          {config.proficiencyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.includes('Date') ? 'date' : 'text'}
                          value={item[field]}
                          onChange={(e) => handleSectionChange(section.type, itemIndex, field, e.target.value)}
                          className={styles.input}
                        />
                      )}
                    </div>
                  ))}
                  {section.items.length > 1 && (
                    <button onClick={() => removeItem(section.type, itemIndex)} className={styles.removeButton}>Remove Entry</button>
                  )}
                </div>
              ))}
              <button onClick={() => addItem(section.type)} className={styles.addButtonSmall}>+ Add Another {config.title.slice(0, -1)}</button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={styles.addFieldButton}
        >
          Add Section
        </button>
      </div>
      <div className={styles.formActions}>
        <button onClick={saveGroup} className={styles.saveButton}>Save</button>
        <button onClick={cancel} className={styles.cancelButton}>Cancel</button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent}>
            <h3>Add Section</h3>
            {Object.keys(sectionTypes).map(type => (
              <button key={type} onClick={() => addSection(type)} className={styles.modalButton}>
                Add {sectionTypes[type].title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupForm;