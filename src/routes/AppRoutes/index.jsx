// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import ProtectedRoute from "../../Components/Layout/ProtectedRoute";
import ProfilePage from "../../pages/ProfilePage";
import CreatePortfolioPage from "../../pages/CreatePortfolioPage";
import UserForm from "../../pages/UserForm";
import CreateCvPage from "../../pages/CreateCvPage";
// import Cv1 from '../../Components/Template/Cv1'; // <-- yahan se import kar (kyunki tu bol raha tha Cv1 HomePage ke folder me hai)
import BuilderPage from "../../pages/BuilderPage";
import UserInfo from "../../Components/UserInfo";
import Template from "../../Components/Template";
// import Cv3 from '../../Components/Template/Cv3';
import GroupForm from "../../Components/UserInfo/GroupForm";
import Designpreview from "../../Components/Template/Designpreview";
import Designpage from "../../Components/Template/Designpage";
import DefaultCv from "../../Components/DefaultCv";
import ResumeSlider from "../../pages/HomePage/ResumeSlider";
// import Cv2 from '../../Components/Template/Cv2';
// import Learn from '../../Learn'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:username" element={<DefaultCv />} />

      {/* Design Routes */}
      <Route path="/Designpreview/:type/:id" element={<Designpreview />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/Designpage" element={<Designpage />} />
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
          {/* <Route path="a" element={<ResumeSlider />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
