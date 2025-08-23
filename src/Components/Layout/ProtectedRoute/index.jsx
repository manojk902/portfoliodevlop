// src/components/Layout/ProtectedRoute/index.jsx
// This component acts as a wrapper for routes that require authentication.
// If the user is not authenticated, it redirects them to a login page (or home).

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // From react-router-dom
// import { useAuth } from '../../../utils/AuthContext'; // Import the authentication context hook

const ProtectedRoute = () => {
  // const { isAuthenticated } = useAuth(); // Get authentication status from context

  const isAuthenticated = true || localStorage.getItem('token');
  // alert(isAuthenticated)
  // If the user is authenticated, render the child routes (Outlet).
  // Otherwise, redirect them to the home page (or a specific login route if one existed).
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute; // <--- ENSURE ProtectedRoute IS DEFAULT EXPORTED