// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import ProtectedRoute from '../../Components/Layout/ProtectedRoute';
import ProfilePage from '../../pages/ProfilePage';
import CreatePortfolioPage from '../../pages/CreatePortfolioPage';
import UserForm from '../../pages/UserForm';
import CreateCvPage from '../../pages/CreateCvPage';
import Cv1 from '../../pages/HomePage/Cv1'; // <-- yahan se import kar (kyunki tu bol raha tha Cv1 HomePage ke folder me hai)
import BuilderPage from '../../pages/BuilderPage';
import UserInfo from '../../Components/UserInfo';
import Template from '../../Components/Template';
import GroupForm from '../../Components/UserInfo/GroupForm';
import Designpreview from '../../Components/Template/Designpreview';
import Designpage from '../../Components/Template/Designpage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/:username" element={<Cv1 />} />   {/* ✅ Static CV route */}

      {/* Design Routes */}
      <Route path="/Designpage" element={<Designpage />} />
      <Route path="/Designpreview/:type/:id" element={<Designpreview />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/createportfolio" element={<CreatePortfolioPage />} />
        <Route path="/editprofile" element={<UserForm />} />
        <Route path="/create-cv" element={<CreateCvPage />} />
        {/* Builder Routes */}
        <Route path="/edit" element={<BuilderPage />}>
          <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="template" element={<Template />} />
          <Route path="add-group" element={<GroupForm />} />
          <Route path="edit-group/:groupId" element={<GroupForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
