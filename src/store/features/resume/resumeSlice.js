// // src/store/features/resume/resumeSlice.js
// // This file defines a Redux slice for managing all resume-related data.
// import { createSlice } from '@reduxjs/toolkit';

// // Function to safely get data from localStorage.
// // This ensures that the initial state is loaded even on first app load or refresh.
// const loadState = (key, defaultValue) => {
//   try {
//     const serializedState = localStorage.getItem(key);
//     if (serializedState === null) {
//       return defaultValue;
//     }
//     return JSON.parse(serializedState);
//   } catch (e) {
//     console.warn(`Could not load state from localStorage for key "${key}"`, e);
//     return defaultValue;
//   }
// };

// // Function to safely save data to localStorage.
// const saveState = (key, state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem(key, serializedState);
//   } catch (e) {
//     console.warn(`Could not save state to localStorage for key "${key}"`, e);
//   }
// };

// // Define the initial state for the resume slice.
// // It loads data from localStorage if available, otherwise uses default values.
// const initialState = {
//   // `headerData` stores information from the "Header Input" page.
//   headerData: loadState('resumeHeaderData', {
//     firstName: 'Manoj',
//     surname: 'Kumar',
//     city: 'New Delhi',
//     country: 'India',
//     pinCode: '110034',
//     phone: '+91 11 1234 5677',
//     email: 'manoj@example.com',
//   }),
//   // `selectedTemplateId` stores the ID of the template chosen by the user.
//   selectedTemplateId: loadState('selectedTemplateId', null),
//   // Add other resume sections here as they are developed
//   experience: loadState('resumeExperience', []),
//   education: loadState('resumeEducation', []),
//   skills: loadState('resumeSkills', []),
//   summary: loadState('resumeSummary', ''),
//   additionalDetails: loadState('resumeAdditionalDetails', []),
// };

// // Create a Redux slice using createSlice from Redux Toolkit.
// // A slice automatically generates action creators and reducers for you.
// const resumeSlice = createSlice({
//   name: 'resume', // The name of the slice, used as a prefix for action types (e.g., 'resume/updateHeaderData')
//   initialState, // The initial state defined above
//   reducers: {
//     // Reducer to update header data.
//     // Redux Toolkit uses Immer internally, so you can "mutate" the state directly,
//     // and Immer will handle creating a new immutable state behind the scenes.
//     updateHeaderData: (state, action) => {
//       state.headerData = { ...state.headerData, ...action.payload };
//       // Save the updated header data to localStorage whenever it changes in Redux.
//       saveState('resumeHeaderData', state.headerData);
//     },
//     // Reducer to set the selected template ID.
//     setSelectedTemplate: (state, action) => {
//       state.selectedTemplateId = action.payload;
//       // Save the selected template ID to localStorage.
//       saveState('selectedTemplateId', state.selectedTemplateId);
//     },
//     // You would add more reducers here for other resume sections:
//     // addExperience: (state, action) => { state.experience.push(action.payload); saveState('resumeExperience', state.experience); },
//     // updateExperience: (state, action) => { /* logic to find and update */ saveState('resumeExperience', state.experience); },
//     // deleteExperience: (state, action) => { /* logic to filter out */ saveState('resumeExperience', state.experience); },
//     // ... and so on for education, skills, summary etc.
//   },
// });

// // Export action creators from the slice.
// // These are functions you call in your components to dispatch actions.
// export const { updateHeaderData, setSelectedTemplate } = resumeSlice.actions;

// // Export the reducer.
// // This will be combined in the root store.
// export default resumeSlice.reducer;