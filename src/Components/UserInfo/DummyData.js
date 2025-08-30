let groupsData = [
  {
    id: crypto.randomUUID(),
    groupName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: { city: '', pinCode: '', state: '', country: '' },
    sections: [],
    isDefault: true,
  },
];

export const getGroups = async () => {
  try {
    const data = groupsData.map(g => ({ ...g, sections: g.sections || [], groupName: g.groupName || '', isDefault: g.isDefault || false }));
    if (data.length === 0) {
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
      data.push(defaultGroup);
    }
    const hasDefault = data.some(g => g.isDefault);
    if (!hasDefault && data.length > 0) data[0].isDefault = true;
    console.log('Returning groups:', data);
    return { groups: data };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { groups: [] };
  }
};

export const saveGroups = async ({ groups }) => {
  try {
    if (groups.length === 0) {
      console.log('Prevented saving empty groups, initializing with default group');
      groupsData = [{
        id: crypto.randomUUID(),
        groupName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        address: { city: '', pinCode: '', state: '', country: '' },
        sections: [],
        isDefault: true,
      }];
    } else {
      groupsData = groups.map(g => ({ ...g, sections: g.sections || [], groupName: g.groupName || '', isDefault: g.isDefault || false }));
    }
    console.log('Saved groups:', groupsData);
  } catch (error) {
    console.error('Error saving groups:', error);
  }
};