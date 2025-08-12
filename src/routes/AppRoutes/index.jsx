
// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../../pages/HomePage';
import TemplateSelectionPage from '../../pages/TemplateSelectionPage';
import BuildResumePage from '../../pages/BuildResumePage';
import HeaderInputPage from '../../pages/HeaderInputPage';
// Import ProtectedRoute component for authentication
import ProtectedRoute from '../../Components/Layout/ProtectedRoute';
import Practice from '../../pages/Practice';
import ProfilePage from '../../pages/ProfilePage';
import CreatePortfolioPage from '../../pages/CreatePortfolioPage';
import UserForm from '../../pages/UserForm';
import CreateCvPage from '../../pages/CreateCvPage';
// import UserProfile from '../../Components/Common/UserProfile';
// --- Crucial: AppRoutes destructures handleChooseTemplate from its props ---
const AppRoutes = ({ navigate, handleChooseTemplate, selectedTemplateId, isSidebarOpen }) => {
  // --- End Crucial ---
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* --- Crucial: handleChooseTemplate is passed as onChooseTemplate to TemplateSelectionPage --- */}
      <Route path="/templates" element={<TemplateSelectionPage onChooseTemplate={handleChooseTemplate} />} /> {/* <--- Passed here */}
      {/* --- End Crucial --- */}
      <Route path="/build-resume" element={<BuildResumePage onNavigate={navigate} />} />
      <Route path="/practice" element={<Practice />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/header-input"
          element={
            <HeaderInputPage
              onNavigate={navigate}
              isSidebarOpen={isSidebarOpen}
            />
          }
        />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/createportfolio' element={<CreatePortfolioPage />} />
        <Route path='/userform' element={<UserForm />} />
        <Route path='/create-cv' element={<CreateCvPage />} />

        {/* <Route path='/userprofile' element={<UserProfile />}/> */}

      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;