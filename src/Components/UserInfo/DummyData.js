let groupsData = [];
let defaultGroupId = null;

export const getGroups = () => {
  return { groups: groupsData, defaultGroupId };
};

export const saveGroups = ({ groups, defaultGroupId: newDefaultGroupId }) => {
  groupsData = groups;
  defaultGroupId = newDefaultGroupId;
};