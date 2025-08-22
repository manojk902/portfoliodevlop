
// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import ProtectedRoute from '../../Components/Layout/ProtectedRoute';
import ProfilePage from '../../pages/ProfilePage';
import CreatePortfolioPage from '../../pages/CreatePortfolioPage';
import UserForm from '../../pages/UserForm';
import CreateCvPage from '../../pages/CreateCvPage';
import Cv1 from '../../Components/Templates/CvTemplates/Cv1';
import BuilderPage from '../../pages/BuilderPage';
import UserInfo from '../../Components/UserInfo';
import Template from '../../Components/Template';
const AppRoutes = () => {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/createportfolio' element={<CreatePortfolioPage />} />
        <Route path='/editprofile' element={<UserForm />} />
        <Route path='/create-cv' element={<CreateCvPage />} />
        <Route path='/edit' element={<BuilderPage />} >
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="template" element={<Template />} />
        </Route>
      </Route>
      {/* <Route path="*" element={<HomePage />} /> */}
      <Route path="/:username" element={<Cv1 />} />
    </Routes>


  );
};

export default AppRoutes;