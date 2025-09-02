/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/Layout/Header/index.jsx
// This component renders the top application bar with navigation and sidebar toggle.
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Skeleton } from '@mui/material';
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

const Header = ({ onNavigate, onToggleSidebar }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const handleNavigationClick = (path) => {
    onNavigate(path);
  };
  const app_name = process.env.REACT_APP_APP_NAME
  const app_url = process.env.REACT_APP_APP_URL
  const redirect_url = process.env.REACT_APP_REDIRECT_URL

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchParams] = useSearchParams();
  const [decodedToken, setDecodedToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasPortfolio, setHasPortfolio] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);


  useEffect(() => {
    dispatch(setUser({ userName: decodedToken?.userName, email: decodedToken?.email, id: decodedToken?.id }));
    if (isLoggedIn && decodedToken?.userName) {
      const fetchUser = async () => {
        try {
          setLoading(true); // start loading
          const user = await axios.get(`${apiUrl}/user-details/${decodedToken?.userName}`);
          dispatch(setUserProfile(user.data));
          setHasPortfolio(!!user.data); // true if data exists
          dispatch(setUserProfile(user.data));
          setHasPortfolio(!!user.data); // true if data exists
          dispatch(setUserProfile(user.data)); // store all payload data in redux
          // console.log(user);


          if (user) {
            setHasPortfolio(true);
          }
          else {
            setHasPortfolio(false);
          }
        } catch (error) {
          console.log("Server error->", error);
          setHasPortfolio(false);
        } finally {
          setLoading(false); // stop loading
        }
      };
      fetchUser();
    } else {
    };
  }, [isLoggedIn, decodedToken?.userName, dispatch]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}all-users-details`);
  //       // console.log(response.data);
  //       setData(response.data); // Uncomment if you want to store the data
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    let token = searchParams.get("token") || localStorage.getItem("token");

    if (token) {
      if (searchParams.get("token")) {
        // cleanup URL (remove ?token=...)
        const url = new URL(window.location);
        url.searchParams.delete("token");
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }

      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);

        // hydrate redux user immediately
        dispatch(setUser({ userName: decoded?.userName, email: decoded?.email, id: decoded?.id }));
      } catch (e) {
        console.error("Invalid token:", e);
        setDecodedToken(null);
      }
    }
  }, [searchParams, dispatch]);


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

  // console.log("this0", user);

return (
  <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1, py: 1 }}>
    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Left side: logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={120} height={30} />
          </Box>

          {/* Right side: buttons & avatar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rectangular" width={70} height={36} />
            <Skeleton variant="rectangular" width={70} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
      ) : (
        <>
          {/* Left side: logo and sidebar toggle */}
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

          {/* Right side: navigation buttons and user actions */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              loading ? (
                <Skeleton variant="circular" width={40} height={40} />
              ) : hasPortfolio ? (
                <>
                  <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {decodedToken?.userName?.[0]?.toUpperCase() || 'U'}
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
                      <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
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
                    onClick={() => handleNavigationClick('/editprofile')}
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
        </>
      )}
    </Toolbar>
  </AppBar>
);
};

export default Header;