let groups = [];

export const getGroups = () => {
  return [...groups]; // Return a copy to prevent direct mutation
};

export const saveGroups = (updatedGroups) => {
  groups = [...updatedGroups]; // Update the in-memory store
  return true; // Simulate successful save
};
