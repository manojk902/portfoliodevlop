/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  Skeleton
} from '@mui/material';
import {
  Phone,
  Email,
  Search as SearchIcon,
  Work,

} from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from "react-router-dom";
import { apiUrl } from '../../utils/common';
import axios from 'axios';

const HomePage = ({ mode }) => {
  const [users, setUsers] = useState([]);   // API se aane wala data
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const theme = useTheme();
  // const stringToColor = (string) => {
  //   let hash = 0;
  //   let i;
  //   /* eslint-disable no-bitwise */
  //   for (i = 0; i < string.length; i += 1) {
  //     hash = string.charCodeAt(i) + ((hash << 5) - hash);
  //   }
  //   let color = '#';
  //   for (i = 0; i < 3; i += 1) {
  //     const value = (hash >> (i * 8)) & 0xff;
  //     color += `00${value.toString(16)}`.slice(-2);
  //   }
  //   /* eslint-enable no-bitwise */
  //   return color;
  // };


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)
    return () => clearTimeout(handler)
  }, [search])
  // 🔹 API call
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/search-user?name=${debouncedSearch}`);
        setUsers(response.data.searchedUser || response.data);
        // Show skeleton for at least 3 seconds
        setTimeout(() => setLoading(false), 100);
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  return (
    <Container maxWidth="xl" sx={{
      py: { xs: 4, md: 6 }
    }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          User Directory
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: '600px',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                // backgroundColor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Box>

        {/* Count */}
        <Typography variant="body2" color="text.secondary">
          {loading
            ? "Loading users..."
            : `${users.length} ${users.length === 1 ? 'user' : 'users'} found`}
        </Typography>
      </Box>

      {/* User Cards Grid */}
      {loading ? (
        <Grid container spacing={3} justifyContent="center">
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} width={"18%"} key={index}>
              <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <CardContent sx={{ p: 2, }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={80} height={80} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={120} height={24} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={100} height={20} sx={{ mt: 1 }} />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mt: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        users.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {users.map((user, index) => (
              // ... your existing user card JSX here
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      // boxShadow: '0 8px 16px rgba(185, 35, 205, 0.18)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection:{ xs: 'row', md: 'column', lg: 'column', xl: 'column'}, // Stacks children vertically
                      alignItems:{ xs: 'flex-start', md: 'center', lg: 'center', xl: 'center'}, // Centers children horizontally within the column
                      // alignItems: 'center', // Centers children horizontally within the column
                      mb: { xs: 0, md: 3, lg: 2, xl: 2 },
                      textAlign: 'center' // Ensures text inside the inner box is also centered
                    }}>
                      <Avatar
                        key={index}
                        src={user?.profilePhoto}
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: user?.profilePhoto ? 'transparent' : user.firstName + user.lastName,
                          border: '2px solid',
                          borderColor: 'primary.main',
                          mb: 1, // Added a margin bottom to separate the avatar and name
                          flexShrink: 0
                        }}
                      >
                        {(!user?.profilePhoto) && `${user?.firstName?.charAt(0)?.toUpperCase()}${user?.lastName?.charAt(0)?.toUpperCase()}`}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 ,pt: { xs: 0.5, md: 1, lg: 0, xl: 0 } }}>
                        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', mb: '-10px', }}>
                          {`${user?.firstName} ${user?.lastName}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.primary }} noWrap>
                          @{`${user?.userName}`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Work sx={{ fontSize: '1rem', mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body2" color="primary.main" noWrap>
                            {user?.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />
                    {/* Contact */}
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ fontSize: '1rem', mr: 1, color: 'text.primary' }} />
                        <Typography variant="body2" color="text.primary" noWrap>
                          {user?.phoneNo}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email sx={{ fontSize: '1rem', mr: 1, color: 'text.primary' }} />
                        <Typography variant="body2" color="text.primary" noWrap>
                          {user?.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.primary' }} />
                        <Typography variant="body2" color="text.primary" noWrap>
                          {user?.city}, {user?.state}, {user?.country}
                        </Typography>
                      </Box>
                    </Box>


{/* 18602662666 */}

                    {/* View CV Button */}
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button
                        component={Link}
                        to={`/${user?.userName}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query
            </Typography>
          </Box>
        )
      )}
    </Container >
  );
};
export default HomePage;