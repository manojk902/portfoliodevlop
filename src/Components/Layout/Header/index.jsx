/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/Layout/Header/index.jsx
// This component renders the top application bar with navigation and sidebar toggle.
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon for sidebar toggle
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for "Resume Now." logo
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate hook
import { jwtDecode } from "jwt-decode";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/features/userSlice';
import { setUserProfile } from '../../../store/features/userProfileSlice';
import { apiUrl } from '../../../utils/common';
import { persistor } from "../../../store";
import NightlightIcon from '@mui/icons-material/Nightlight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const Header = ({ onNavigate, onToggleSidebar, mode, setMode }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigationClick = (path) => {
    // onNavigate(path);
    if (!userProfile?.firstName && path !== "/editprofile") {
      // Agar profile incomplete hai to force editprofile
      navigate("/editprofile", { replace: true });
      return;
    }
    navigate(path);
  };
  const app_name = process.env.REACT_APP_APP_NAME;
  const app_url = process.env.REACT_APP_APP_URL;
  const redirect_url = process.env.REACT_APP_REDIRECT_URL;

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchParams] = useSearchParams();
  const [decodedToken, setDecodedToken] = useState(null);
  const [redirected, setRedirected] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const userProfile = useSelector(state => state.userProfile?.data?.fetchedUsed);
  const [profileFetched, setProfileFetched] = useState(false);
  console.log(userProfile?.firstName, "userProfile");

  const location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);



  useEffect(() => {
    dispatch(setUser({ userName: decodedToken?.userName, email: decodedToken?.email, id: decodedToken?.id }));
    if (isLoggedIn && decodedToken?.userName) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await axios.get(`${apiUrl}/user-details/${decodedToken?.userName}`);
          dispatch(setUserProfile(user.data));
        } catch (error) {
          console.log("Server error->", error);
        } finally {
          setLoading(false);
          setProfileFetched(true);
        }
      };
      fetchUser();
    }
  }, [isLoggedIn, decodedToken?.userName, dispatch]);
useEffect(() => {
  if (
    isLoggedIn &&
    profileFetched &&   // ✅ wait till API done
    !loading &&
    !userProfile?.firstName && // ✅ check after fetch
    !redirected &&
    location.pathname !== "/editprofile"
  ) {
    setRedirected(true);
    navigate("/editprofile", { replace: true });
  }
}, [isLoggedIn, profileFetched, loading, userProfile, redirected, location.pathname, navigate]);


  useEffect(() => {
    let token = searchParams.get("token") || localStorage.getItem("token");
    if (token) {
      if (searchParams.get("token")) {
        const url = new URL(window.location);
        url.searchParams.delete("token");
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }
      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
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
    persistor.purge();
    alert("logout successful");
    const url = new URL(window.location);
    url.searchParams.delete("token");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    navigate("/");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
    // You would typically save this to localStorage
  };
  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.background.default, boxShadow: 1, py: { xs: 0.5, sm: 1 } }}>
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
              <Skeleton variant="rectangular" width={isMobile ? 50 : 70} height={36} />
              <Skeleton variant="rectangular" width={isMobile ? 50 : 70} height={36} />
              {!isMobile && <Skeleton variant="rectangular" width={100} height={36} />}
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>
        ) : (
          <>
            {/* Left side: logo and sidebar toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
              {/* Sidebar Toggle Button (visible only on small screens) */}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: 'block', md: 'none' }, color: 'text.primary' }}
                onClick={onToggleSidebar}
              >
                <MenuIcon />
              </IconButton>
              {/* "Resume Now." Logo/Title */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  typography: { xs: 'h6', sm: 'h5' },
                  fontWeight: 'bold',
                  // color: 'text.primary',
                  color: theme.palette.text.primary,
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigationClick('/')}
              >
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main', display: { xs: 'none', sm: 'block' } }} />
                Resume Now.
              </Box>
            </Box>

            {/* Right side: navigation buttons and user actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
                <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary }}>
                  {mode === 'light' ? <NightlightIcon /> : <WbSunnyIcon />}
                </IconButton>
                <Button
                  onClick={() => handleNavigationClick('/')}
                  variant="text"
                  sx={{
                    color: theme.palette.text.primary,
                    px: 2,
                    py: 1,
                  }}
                >
                  Home
                </Button>

                <Button
                  onClick={() => handleNavigationClick('/Designpage')}
                  variant="contained"
                  color="primary"
                  sx={{ px: 2, py: 1 }}
                >
                  Templates
                </Button>
              </Box>
              {isLoggedIn ? (
                loading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) :
                  userProfile?.firstName ? (
                    <>
                      <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                        {userProfile?.profilePhoto ? (
                          <Avatar src={userProfile.profilePhoto} sx={{ bgcolor: 'primary.main', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }} />
                        ) : (
                          <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                            {decodedToken?.userName?.[0]?.toUpperCase() || 'U'}
                          </Avatar>
                        )}
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
                        <MenuItem onClick={handleMenuClose}>
                          <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Profile
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                          <Link to="/edit" style={{ textDecoration: 'none', color: 'inherit' }}>
                            BuilderPage
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleLogout} sx={{ display: { xs: 'none', sm: 'block' } }}>Logout</Button>
                      {/* <Button
                        // onClick={() => handleNavigationClick('/editprofile')}
                        variant="contained"

                        color="primary"
                        sx={{ px: { xs: 1, sm: 2 }, py: 1 }}
                      >
                        Create Profile
                      </Button> */}
                    </>
                  )
              ) : (
                <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                  <Button
                    onClick={() => window.location.href = `${redirect_url}/signup?appName=${app_name}&redirectUrl=${app_url}`}
                    variant="text"
                    sx={{
                      color: theme.palette.text.primary,
                      px: 1,
                      py: 1,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Signup
                  </Button>
                  <Button
                    onClick={() => window.location.href = `${redirect_url}/login?appName=${app_name}&redirectUrl=${app_url}`}
                    variant="contained"
                    color="primary"
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: 1,
                    }}
                  >
                    Login
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;