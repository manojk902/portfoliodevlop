/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/Layout/Header/index.jsx
// This component renders the top application bar with navigation and sidebar toggle.
import React, { use, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon for sidebar toggle
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for "Resume Now." logo
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate hook
import { jwtDecode } from "jwt-decode"
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/features/userSlice';
import { setUserProfile } from '../../../store/features/userProfileSlice';
import { apiUrl } from '../../../utils/common';
import BuilderPage from '../../../pages/BuilderPage';

const Header = ({ onNavigate, onToggleSidebar }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const handleNavigationClick = (path) => {
    onNavigate(path);
  };
  const app_name = process.env.REACT_APP_APP_NAME
  const app_url = process.env.REACT_APP_APP_URL
  const redirect_url = process.env.REACT_APP_REDIRECT_URL
<<<<<<< Updated upstream
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  // (!!localStorage.getItem("token"));
=======
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
=======
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  // (!!localStorage.getItem("token"));
>>>>>>> template-page
>>>>>>> Stashed changes
  const [searchParams] = useSearchParams();
  const [decodedToken, setDecodedToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasPortfolio, setHasPortfolio] = useState(true);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);


  useEffect(() => {
    dispatch(setUser({ userName: decodedToken?.userName, email: decodedToken?.email, id: decodedToken?.id }));
    if (isLoggedIn && decodedToken?.userName) {
      const fetchUser = async () => {
        try {
          const user = await axios.get(`${apiUrl}/user-details/${decodedToken?.userName}`);
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
          dispatch(setUserProfile(user.data));
          setHasPortfolio(!!user.data); // true if data exists
=======
>>>>>>> Stashed changes
          dispatch(setUserProfile(user.data)); // store all payload data in redux
          console.log(user);


          if (user) {
            setHasPortfolio(true);
          }
          else {
            setHasPortfolio(false);
          }
<<<<<<< Updated upstream
=======
>>>>>>> template-page
>>>>>>> Stashed changes
        } catch (error) {
          console.log("Server error->", error)
        }
      }
      fetchUser();
    } else {
    };
  }, [isLoggedIn, decodedToken?.userName, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}all-users-details`);
        console.log(response.data);
        // setData(response.data); // Uncomment if you want to store the data
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      // co=nole.log(decodedToken.userName);
      try {
        setDecodedToken(jwtDecode(token))
      } catch (e) {
        setDecodedToken(null);
      }


    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDecodedToken(null);
    alert("logout successful");
    const url = new URL(window.location);
    url.searchParams.delete("token");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    navigate("/")
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  console.log("this0", user);

  return (
    // AppBar is a Material-UI component for the top application bar.
    <AppBar Bar position="static" sx={{ bgcolor: 'white', boxShadow: 1, py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Sidebar Toggle Button (visible only on small screens) */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.secondary' }}
            onClick={onToggleSidebar} // Triggers sidebar open/close in AppProvider
          >
            <MenuIcon />
          </IconButton>
          {/* "Resume Now." Logo/Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'h6', // MUI typography variant
              fontWeight: 'bold',
              color: 'text.primary',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigationClick('/')} // Navigates to the home page path
          >
            <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} /> {/* Icon for visual appeal */}
            Resume Now.
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => handleNavigationClick('/')} // Navigates to home path
            variant="text" // Text button style
            sx={{
              color: 'text.secondary',
              bgcolor: 'grey.200',
              '&:hover': { bgcolor: 'grey.300' },
              px: 2,
              py: 1,
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => window.location.href = `${redirect_url}/signup?appName=${app_name}&redirectUrl=${app_url}`}
            variant="text" // Text button style
            sx={{
              color: 'text.secondary',
              bgcolor: 'grey.200',
              '&:hover': { bgcolor: 'grey.300' },
              px: 2,
              py: 1,
            }}
          >
            Signup
          </Button>
          <Button
            onClick={() => handleNavigationClick('/templates')} // Navigates to templates page path
            variant="contained" // Filled button style
            color="primary"
            sx={{ px: 2, py: 1 }}
          >
            Templates
          </Button>



          {isLoggedIn ? (
            hasPortfolio ? (
              <>
                <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {decodedToken?.userName?.[0]?.toUpperCase() || 'not'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 150,
                        borderRadius: 2,
                      },
                    },
                  }}
                >
                  <MenuItem>
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                  </MenuItem>
                  <MenuItem >
                    <Link to="/edit" style={{ textDecoration: 'none', color: 'inherit' }}>
                      BuilderPage
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button onClick={handleLogout}>Logout</Button>
                <Button
                  onClick={() => handleNavigationClick('/userform')}
                  variant="contained"
                  color="primary"
                  sx={{ px: 2, py: 1 }}
                >
                  Create Portfolio
                </Button>
              </>

            )
          ) : (
            <Button
              onClick={() => window.location.href = `${redirect_url}/login?appName=${app_name}&redirectUrl=${app_url}`}
              variant="text"
              sx={{
                color: 'text.secondary',
                bgcolor: 'grey.200',
                '&:hover': { bgcolor: 'grey.300' },
                px: 2,
                py: 1,
              }}
            >
              Login
            </Button>
          )}


        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;