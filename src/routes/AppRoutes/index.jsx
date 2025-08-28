
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
<<<<<<< Updated upstream
import Designpreview from '../../Components/Template/Designpreview';
import Designpage from '../../Components/Template/Designpage';
=======
<<<<<<< HEAD
import GroupForm from '../../Components/UserInfo/GroupForm';
=======
import Designpreview from '../../Components/Template/Designpreview';
import Designpage from '../../Components/Template/Designpage';
>>>>>>> template-page
>>>>>>> Stashed changes
const AppRoutes = () => {
  return (

    <Routes>
      <Route path="/Designpage" element={<Designpage />} />
      <Route path="/Designpreview/:type/:id" element={<Designpreview />} />
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/createportfolio' element={<CreatePortfolioPage />} />
        <Route path='/userform' element={<UserForm />} />
        <Route path='/create-cv' element={<CreateCvPage />} />
        <Route path='/edit' element={<BuilderPage />} >
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="template" element={<Template />} />
<<<<<<< Updated upstream
          {/* <Route path="/Designpage" element={<Designpage />} /> */}
=======
<<<<<<< HEAD
          <Route path="add-group" element={<GroupForm />} />
          <Route path="edit-group/:groupId" element={<GroupForm />} />
=======
          {/* <Route path="/Designpage" element={<Designpage />} /> */}
>>>>>>> template-page
>>>>>>> Stashed changes
        </Route>
      </Route>
      {/* <Route path="*" element={<HomePage />} /> */}
      <Route path="/:username" element={<Cv1 />} />
    </Routes>


  );
};

export default AppRoutes;