/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Container,
  useTheme,
  Divider,
  Avatar,
  Button,
  Skeleton,
  MenuItem,
  Chip,
  alpha,
} from "@mui/material";
import {
  Phone,
  Email,
  Search as SearchIcon,
  Work,
  LocationOn,
  Person,
  CorporateFare,
  Flag,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { apiUrl } from "../../utils/common";
import axios from "axios";

const HomePage = ({ mode }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const theme = useTheme();

  // 🔹 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  // 🔹 API call
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let response;
        if (!debouncedSearch) {
          response = await axios.get(`${apiUrl}/search-user`);
        } else {
          response = await axios.get(
            `${apiUrl}/search-user?q=${debouncedSearch}`
          );
        }
        setUsers(response?.data?.data || response?.data || []);
      } catch (error) {
        console.error("API Error:", error);
        setUsers([]);
      } finally {
        setTimeout(() => setLoading(false), 80);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: 0,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            }}
          >
            Portfolio Showcase
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              maxWidth: "600px",
              mx: "auto",
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Discover professional portfolios and connect with talented creators.
            Find the perfect candidate for your team or get inspired for your
            next project.
          </Typography>

          {/* 🔍 Search Section */}
          <Box sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, skills, location, or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  background: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  fontSize: "1rem",
                  padding: "4px",
                  "&:hover": {
                    borderColor: "#3498db",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3498db",
                    boxShadow: "0 8px 32px rgba(52, 152, 219, 0.15)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 16px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      color: "#94a3b8",
                      mr: 1,
                      fontSize: "1.5rem",
                    }}
                  />
                ),
              }}
            />
          </Box>
        </Box>

        {/* User Cards Grid - PERFECTLY CENTERED */}
        {loading ? (
          <Grid container spacing={3} justifyContent="center">
            {[...Array(8)].map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    width: "100%",
                    maxWidth: "320px",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Avatar & Basic Info Skeleton */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton variant="circular" width={60} height={60} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="60%" height={20} />
                      </Box>
                    </Box>

                    <Skeleton
                      variant="text"
                      width="100%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="90%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ mb: 2 }}
                    />

                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={42}
                      sx={{ borderRadius: "12px" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : users?.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {users?.map((user, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    width: "100%",
                    maxWidth: "320px",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      pt: 1,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Avatar & Basic Info */}
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}
                    >
                      <Avatar
                        src={user?.profilePhoto}
                        sx={{
                          width: 65,
                          height: 65,
                          bgcolor: user?.profilePhoto
                            ? "transparent"
                            : "#3498db",
                          border: "3px solid",
                          borderColor: "rgba(52, 152, 219, 0.2)",
                          flexShrink: 0,
                        }}
                      >
                        {!user?.profilePhoto &&
                          `${user.firstName?.charAt(0)}${user.lastName?.charAt(
                            0
                          )}`}
                      </Avatar>

                      <Box sx={{ ml: 2, minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>

                        <Chip
                          label={`@${user.userName}`}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            background: "rgba(52, 152, 219, 0.1)",
                            color: "#3498db",
                            mb: 1,
                          }}
                        />

                        {user.designation && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Work
                              sx={{
                                fontSize: "1rem",
                                mr: 0.5,
                                color: "#64748b",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontWeight: 500,
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {user.designation}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1, opacity: 2 }} />

                    {/* Contact & Location Info */}
                    <Box sx={{ flexGrow: 1, pt: 0 }}>
                      {user.phoneNo && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Phone
                            sx={{
                              fontSize: "1.1rem",
                              mr: 1.5,
                              color: "#3498db",
                              mb: 1,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {user.phoneNo}
                          </Typography>
                        </Box>
                      )}

                      {user.email && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Email
                            sx={{
                              fontSize: "1.1rem",
                              mr: 1.5,
                              mb: 1,
                              color: "#3498db",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                            }}
                            noWrap
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      )}

                      {(user.city || user.state || user.country) && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: "1.1rem",
                              mr: 1.5,
                              // mt: 0.2,
                              color: "#3498db",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              lineHeight: 1.4,
                            }}
                          >
                            {[user.city, user.state, user.country]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Action Button */}
                    <Button
                      component={Link}
                      to={`/${user.userName}`}
                      variant="contained"
                      sx={{
                        mt: 2,
                        background:
                          "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                        color: "white",
                        borderRadius: "12px",
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2980b9 0%, #2471a3 100%)",
                          boxShadow: "0 6px 20px rgba(52, 152, 219, 0.4)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      View Portfolio
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Person sx={{ fontSize: 48, color: "#94a3b8" }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: "#475569",
                mb: 2,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              No portfolios found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                maxWidth: "400px",
                mx: "auto",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Try different search terms or explore all available portfolios
            </Typography>
          </Box>
        )}

        {/* Why Use Our Resume Builder Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="lg">
            {/* Section Header */}
            <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                }}
              >
                Why Use Our Portfolio DriveOSx?
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.4,
                }}
              >
                Everything you need to create a professional resume that stands
                out
              </Typography>
            </Box>

            {/* Features Grid - 2 CARDS PER ROW ON DESKTOP */}
            <Grid container spacing={6}>
              {/* Row 1 */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    // background: "#ffffff",
                    // borderRadius: "20px",
                    // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    // border: "1px solid rgba(255,255,255,0.8)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            // color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          💎
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Free AND Premium
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      We offer both free and premium features. Want your resume
                      to have that extra punch? Upgrade to Premium. On a budget?
                      That's OK too - you can use our resume builder completely
                      free of charge.
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    // background: "#ffffff",
                    // borderRadius: "20px",
                    // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    // border: "1px solid rgba(255,255,255,0.8)",
                    // transition: "all 0.3s ease",
                    // "&:hover": {
                    //   transform: "translateY(-8px)",
                    //   boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                    // },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          🔒
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        NO Hidden Fees
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      With our platform, you won't spend hours working on your
                      resume, just to be hit with a hidden paywall. Our resume
                      builder will notify you if you're using any of our premium
                      features in advance.
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    // background: "#ffffff",
                    // borderRadius: "20px",
                    // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    // border: "1px solid rgba(255,255,255,0.8)",
                    // transition: "all 0.3s ease",
                    // "&:hover": {
                    //   transform: "translateY(-8px)",
                    //   boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                    // },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            // color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          ⚡
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Live Content Feedback
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Our CV builder provides real-time feedback on your resume
                      content, ensuring that your resume reaches its full
                      potential! Get instant suggestions for improvements as you
                      type.
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    // background: "#ffffff",
                    // borderRadius: "20px",
                    // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    // border: "1px solid rgba(255,255,255,0.8)",
                    // transition: "all 0.3s ease",
                    // "&:hover": {
                    //   transform: "translateY(-8px)",
                    //   boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                    // },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            // color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          🎨
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Creative & Professional Templates
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Whatever resume template you're looking for, we've got it!
                      Whether it's a classic black-and-white template, or
                      something a bit more outside the box, we have what you
                      need!
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={
                    {
                      // height: "100%",
                      // background: "#ffffff",
                      // borderRadius: "20px",
                      // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      // border: "1px solid rgba(255,255,255,0.8)",
                      // transition: "all 0.3s ease",
                      // "&:hover": {
                      //   transform: "translateY(-8px)",
                      //   boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                      // },
                    }
                  }
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            // color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          🤖
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        ATS-Friendly
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Our resume templates are ATS-friendly. It means your
                      resume won't automatically be rejected because an ATS
                      can't read it. Optimized for both humans and machines.
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={
                    {
                      // height: "100%",
                      // background: "#ffffff",
                      // borderRadius: "20px",
                      // boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      // border: "1px solid rgba(255,255,255,0.8)",
                      // transition: "all 0.3s ease",
                      // "&:hover": {
                      //   transform: "translateY(-8px)",
                      //   boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                      // },
                    }
                  }
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          // background:
                          //   "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            // color: "white",
                            fontSize: "4.5rem",
                            fontWeight: 700,
                          }}
                        >
                          ✏️
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Real-Time Editing
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      As you edit your resume with our builder, you'll
                      immediately see the changes applied to your document. No
                      waiting, no delays - instant visual feedback.
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            </Grid>

            {/* CTA Section */}
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  mb: 3,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Ready to create your professional resume?
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                  color: "white",
                  borderRadius: "16px",
                  py: 2,
                  px: 6,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 8px 25px rgba(52, 152, 219, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2980b9 0%, #2471a3 100%)",
                    boxShadow: "0 12px 35px rgba(52, 152, 219, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Your Resume Now
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
