/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/Layout/Header/index.jsx
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
  Grid,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../store/features/userSlice";
import { setUserProfile } from "../../../store/features/userProfileSlice";
import { apiUrl } from "../../../utils/common";
import { persistor } from "../../../store";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const Header = ({ onNavigate, onToggleSidebar, mode, setMode }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNavigationClick = (path) => {
    if (!userProfile?.firstName && path !== "/editprofile") {
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
  const userProfile = useSelector(
    (state) => state.userProfile?.data?.fetchedUsed
  );
  const [profileFetched, setProfileFetched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(
      setUser({
        userName: decodedToken?.userName,
        email: decodedToken?.email,
        id: decodedToken?.id,
      })
    );
    if (isLoggedIn && decodedToken?.userName) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await axios.get(
            `${apiUrl}/user-details/${decodedToken?.userName}`
          );
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
      profileFetched &&
      !loading &&
      !userProfile?.firstName &&
      !redirected &&
      location.pathname !== "/editprofile"
    ) {
      setRedirected(true);
      navigate("/editprofile", { replace: true });
    }
  }, [
    isLoggedIn,
    profileFetched,
    loading,
    userProfile,
    redirected,
    location.pathname,
    navigate,
  ]);

  useEffect(() => {
    let token = searchParams.get("token") || localStorage.getItem("token");
    if (token) {
      if (searchParams.get("token")) {
        const url = new URL(window.location);
        url.searchParams.delete("token");
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );
      }
      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
        dispatch(
          setUser({
            userName: decoded?.userName,
            email: decoded?.email,
            id: decoded?.id,
          })
        );
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
    const url = new URL(window.location);
    url.searchParams.delete("token");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    setSnackbarOpen(true);
    navigate("/");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Grid>
      <AppBar
        position="fixed"
        sx={{
          height: { xs: "80px", sm: "70px" },
          background: "transparent",
          boxShadow: "none",
          backdropFilter: "blur(10px)",
          backgroundColor: scrolled ? "#fffafae6" : "#fffafae6", // ✅ Background changes on scroll
          py: { xs: 0.5, sm: 1 },
          borderBottom: scrolled
            ? "1px solid transparent" // ✅ Transparent when scrolled
            : "1px solid rgba(0,0,0,0.05)", // ✅ Visible when at top
          transition: "all 0.3s ease", // ✅ Smooth transition
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: "60px", sm: "70px" },
          }}
        >
          {loading ? (
            // Loading skeleton (same as before)
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} height={30} />
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Skeleton variant="rectangular" width={80} height={36} />
                <Skeleton variant="rectangular" width={80} height={36} />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Box>
          ) : (
            <>
              {/* Left side: Logo and Brand - UPDATED COLORS */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={() => handleNavigationClick("/")}
              >
                {/* Logo Container */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LibraryBooksIcon
                    sx={{
                      color: "#2c3e50",
                      fontSize: { xs: "42px" },
                    }}
                  />

                  {/* Text Stack */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#2c3e50",
                        fontWeight: 700,
                        fontSize: { xs: "16px" },
                        letterSpacing: "0.5px",
                        lineHeight: 1.1,
                        fontFamily:
                          "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                      }}
                    >
                      Portfolio
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: "2px",
                        background: "linear-gradient(90deg, #3498db, #2c3e50)",
                        my: 0.3,
                      }}
                    />

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        sx={{
                          color: "#7f8c8d",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "11px" },
                          letterSpacing: "0.3px",
                          lineHeight: 1.1,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        by
                      </Typography>
                      <Typography
                        sx={{
                          color: "#3498db",
                          fontWeight: 600,
                          fontSize: { xs: "0.7rem" },
                          letterSpacing: "0.5px",
                          lineHeight: 1.1,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        DriveOSx
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Right side: Actions and User Menu - UPDATED COLORS */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 2 },
                  alignItems: "center",
                }}
              >
                {/* Theme Toggle */}
                {/* <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: "#5d6d7e",
                    backgroundColor: "rgba(52, 152, 219, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(52, 152, 219, 0.2)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                  }}
                >
                  {mode === "light" ? <NightlightIcon /> : <WbSunnyIcon />}
                </IconButton> */}

                {/* Navigation Buttons */}
                {!isMobile && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => handleNavigationClick("/edit/template")}
                      sx={{
                        color: "#2c3e50",
                        px: 2,
                        fontWeight: 500,
                        borderRadius: "8px",
                        border: "1px solid rgba(44, 62, 80, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(52, 152, 219, 0.1)",
                          border: "1px solid #3498db",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Templates
                    </Button>
                  </Box>
                )}

                {isLoggedIn ? (
                  userProfile?.firstName ? (
                    <>
                      {/* User Avatar */}
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          onMouseEnter={handleProfileClick}
                          onClick={handleProfileClick}
                          sx={{
                            p: 0,
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {userProfile?.profilePhoto ? (
                            <Avatar
                              src={userProfile.profilePhoto}
                              sx={{
                                bgcolor: "#3498db",
                                width: { xs: 36, sm: 40 },
                                height: { xs: 36, sm: 40 },
                                border: "2px solid rgba(52, 152, 219, 0.3)",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: "#3498db",
                                width: { xs: 36, sm: 40 },
                                height: { xs: 36, sm: 40 },
                                border: "2px solid rgba(52, 152, 219, 0.3)",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              {decodedToken?.userName?.[0]?.toUpperCase() ||
                                "U"}
                            </Avatar>
                          )}
                        </IconButton>

                        {/* Down Arrow Icon */}
                        <KeyboardArrowDownIcon
                          sx={{
                            color: "#141516ff",
                            fontSize: "20px",
                            transition: "all 0.2s ease",
                            opacity: 0.7,
                          }}
                        />
                      </Box>

                      {/* User Menu */}
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        onMouseLeave={handleMenuClose}
                        disableScrollLock={true}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              mt: 1.5,
                              minWidth: 100,
                              borderRadius: "16px",
                              background: "#FFFFFF",
                              color: "#1a1a1a",
                              border: "1px solid rgba(0,0,0,0.08)",
                              overflow: "hidden",
                              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                            },
                          },
                        }}
                      >
                        {/* My Profile Menu Item */}
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigate("/profile");
                          }}
                          sx={{
                            gap: 1.5,
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid rgba(0,0,0,0.04)",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(52, 152, 219, 0.08)",
                            },
                            minHeight: "auto",
                          }}
                        >
                          <AccountCircleIcon
                            sx={{
                              color: "#5d6d7e",
                              fontSize: "18px",
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                lineHeight: 1.2,
                              }}
                            >
                              My Profile
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: "#6c757d",
                                lineHeight: 1.2,
                              }}
                            >
                              View and edit profile
                            </Typography>
                          </Box>
                          <ArrowForwardIosIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClose();
                              navigate("/profile");
                            }}
                            sx={{
                              fontSize: "12px",
                              color: "#adb5bd",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                        </MenuItem>

                        {/* Builder Menu Item */}
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigate("/edit");
                          }}
                          sx={{
                            gap: 1.5,
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid rgba(0,0,0,0.04)",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(52, 152, 219, 0.08)",
                            },
                            minHeight: "auto",
                          }}
                        >
                          <BuildIcon
                            sx={{
                              color: "#5d6d7e",
                              fontSize: "18px",
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                lineHeight: 1.2,
                              }}
                            >
                              Builder
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: "#6c757d",
                                lineHeight: 1.2,
                              }}
                            >
                              Create and edit portfolio
                            </Typography>
                          </Box>
                          <ArrowForwardIosIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClose();
                              navigate("/edit");
                            }}
                            sx={{
                              fontSize: "12px",
                              color: "#adb5bd",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                        </MenuItem>

                        {/* Logout Menu Item */}
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            setLogoutConfirmOpen(true);
                          }}
                          sx={{
                            gap: 1.5,
                            px: 2,
                            py: 1.2,
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(231, 76, 60, 0.08)",
                            },
                            minHeight: "auto",
                          }}
                        >
                          <ExitToAppIcon
                            sx={{
                              color: "#5d6d7e",
                              fontSize: "18px",
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                lineHeight: 1.2,
                              }}
                            >
                              Logout
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: "#6c757d",
                                lineHeight: 1.2,
                              }}
                            >
                              Sign out from account
                            </Typography>
                          </Box>
                          <ArrowForwardIosIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClose();
                              setLogoutConfirmOpen(true);
                            }}
                            sx={{
                              fontSize: "12px",
                              color: "#adb5bd",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                        </MenuItem>

                        {/* Footer Section */}
                        <Box
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                            background: "rgba(248, 249, 250, 0.6)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              color: "#6c757d",
                              textAlign: "center",
                            }}
                          >
                            Portfolio By DriveOSx
                          </Typography>
                        </Box>
                      </Menu>
                    </>
                  ) : (
                    <Button
                      onClick={() => setLogoutConfirmOpen(true)}
                      sx={{
                        color: "#e74c3c",
                        border: "1px solid rgba(231, 76, 60, 0.3)",
                        borderRadius: "8px",
                        "&:hover": {
                          bgcolor: "rgba(231, 76, 60, 0.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Logout
                    </Button>
                  )
                ) : (
                  <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
                    <Button
                      onClick={() =>
                        (window.location.href = `${redirect_url}/signup?appName=${app_name}&redirectUrl=${app_url}`)
                      }
                      sx={{
                        color: "#2c3e50",
                        px: { xs: 1, sm: 2 },
                        borderRadius: "8px",
                        border: "1px solid rgba(44, 62, 80, 0.3)",
                        "&:hover": {
                          bgcolor: "rgba(52, 152, 219, 0.1)",
                          border: "1px solid #3498db",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={() =>
                        (window.location.href = `${redirect_url}/login?appName=${app_name}&redirectUrl=${app_url}`)
                      }
                      variant="contained"
                      sx={{
                        px: { xs: 2, sm: 3 },
                        background:
                          "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2980b9 0%, #2471a3 100%)",
                          boxShadow: "0 6px 20px rgba(52, 152, 219, 0.6)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
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

      {/* Add padding to body content to account for fixed header */}
      <Box sx={{ height: { xs: "60px", sm: "70px" } }} />

      {/* Rest of your dialogs and snackbars remain the same */}
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.8)" }}>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLogoutConfirmOpen(false)}
            sx={{ color: "rgba(255,255,255,0.8)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setLogoutConfirmOpen(false);
              handleLogout();
            }}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
              color: "white",
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#4caf50",
            color: "white",
            borderRadius: "8px",
          }}
        >
          Logout successful!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Header;
