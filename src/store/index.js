// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import resumeReducer from './features/resume/resumeSlice';
import userReducer from './features/userSlice';
import userProfileReducer from './features/userProfileSlice';

// Configure persist settings for userProfile slice
const userProfilePersistConfig = {
  key: 'userProfile', // Key for the persisted state in storage
  storage, // Use localStorage
  // Optionally, whitelist specific fields to persist (e.g., only username)
  // whitelist: ['data.username'], // Uncomment and adjust if userProfile.data has a username field
};
const userPersistConfig = {
  key: 'user',
  storage,
};
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Wrap userProfileReducer with persistReducer
const persistedUserProfileReducer = persistReducer(userProfilePersistConfig, userProfileReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    // user: userReducer,
    userProfile: persistedUserProfileReducer, // Use persisted reducer
    user: persistedUserReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create the persistor object for redux-persist
export const persistor = persistStore(store);