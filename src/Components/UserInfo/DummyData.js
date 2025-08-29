let groupsData = [
  {
    id: crypto.randomUUID(),
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: { city: '', pinCode: '', state: '', country: '' },
    sections: [],
    isDefault: true,
  },
];

// Placeholder for API integration
export const getGroups = async () => {
  try {
    // Simulate API response or replace with actual API call
    /*
    const response = await fetch('https://your-api-endpoint/users/123/cvInfo');
    if (!response.ok) throw new Error('Failed to fetch groups');
    const data = await response.json();
    const groups = data.cvInfo.map(group => ({
      id: group.cvInfoId || crypto.randomUUID(),
      firstName: group.firstName || '',
      lastName: group.lastName || '',
      email: group.email || '',
      phoneNo: group.phoneNo || '',
      address: {
        city: group.address?.city || '',
        pinCode: group.address?.pinCode || '',
        state: group.address?.state || '',
        country: group.address?.country || '',
      },
      sections: (group.sections || []).map(section => ({
        name: section.name.toLowerCase(),
        data: Array.isArray(section.data)
          ? section.data.map(item => ({
              ...item,
              ...Object.fromEntries(
                Object.entries(item).map(([key, value]) => [key, String(value)])
              ),
            }))
          : [Object.fromEntries(sectionTypes[section.name.toLowerCase()]?.fields.map(f => [f, '']))]
      })),
      isDefault: group.isDefault || false,
    }));
    const hasDefault = groups.some(g => g.isDefault);
    if (!hasDefault && groups.length > 0) groups[0].isDefault = true;
    return { groups };
    */
    const data = groupsData.map(g => ({ ...g, sections: g.sections || [], isDefault: g.isDefault || false }));
    if (data.length === 0) {
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
      data.push(defaultGroup);
    }
    const hasDefault = data.some(g => g.isDefault);
    if (!hasDefault && data.length > 0) data[0].isDefault = true;
    console.log('Returning groups:', data); // Debug log
    return { groups: data };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { groups: [] };
  }
};

export const saveGroups = async ({ groups }) => {
  try {
    // Simulate API call or replace with actual API call
    /*
    const userData = {
      userId: 123,
      userName: 'mukesh123',
      templateInfo: {
        templateName: 'defaultCv',
        cvInfoId: groups[0]?.id || crypto.randomUUID(),
      },
      cvInfo: groups.map(group => ({
        isDefault: group.isDefault || false,
        firstName: group.firstName,
        lastName: group.lastName,
        email: group.email,
        phoneNo: group.phoneNo,
        address: group.address,
        sections: (group.sections || []).map(section => ({
          name: section.name.charAt(0).toUpperCase() + section.name.slice(1),
          data: section.data,
        })),
      })),
    };
    const response = await fetch('https://your-api-endpoint/users/123/cvInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to save groups');
    */
    if (groups.length === 0) {
      console.log('Prevented saving empty groups, initializing with default group'); // Debug log
      groupsData = [{
        id: crypto.randomUUID(),
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        address: { city: '', pinCode: '', state: '', country: '' },
        sections: [],
        isDefault: true,
      }];
    } else {
      groupsData = groups.map(g => ({ ...g, sections: g.sections || [], isDefault: g.isDefault || false }));
    }
    console.log('Saved groups:', groupsData); // Debug log
  } catch (error) {
    console.error('Error saving groups:', error);
  }
};