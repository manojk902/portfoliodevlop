<<<<<<< Updated upstream
// src/pages/HomePage/index.jsx
// This component represents the application's home or landing page.
// It now integrates the 3D scroll effect component and an example TemplateCard.

import React from 'react';
import { Box, Typography } from '@mui/material';
import ThreeDScrollEffect from '../../Components/Common/ThreeDScrollEffect';
import CvTemplates from '../../Components/Templates/CvTemplates';

const HomePage = () => {
  // const handleChooseSampleTemplate = (templateId) => {
  //   console.log(`Sample Template ${templateId} chosen on homepage!`);
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)', // Adjust height based on header to fill remaining space
        p: 2, // Padding
        textAlign: 'center', // Center text alignment
      }}
    >
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'extrabold', color: 'text.primary', mb: 2 }}>
        Welcome to Resume Now!
      </Typography>
=======
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar
} from '@mui/material';
import {
  Phone,
  Email,
  Search as SearchIcon,
  Work
} from '@mui/icons-material';

const HomePage = () => {
  const [users, setUsers] = useState([]);   // API se aane wala data
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 🔹 API call
  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.0.3:9000/api/v1/portfolio/search-user?name=${search}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data.searchedUser[0]);
        // 👇 agar API ka response { users: [...] } hai
        setUsers(data.searchedUser || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error kkkkkkkkkkkkkkkk:", err);
        setLoading(false);
      });
  }, [search]); // search change hote hi API call hoga

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
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
>>>>>>> Stashed changes

        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, title or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: '600px',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'background.paper',
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
      {!loading && users.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={user.image}
                      alt={user.name}
                      sx={{
                        width: 80,
                        height: 80,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        mr: 2,
                        flexShrink: 0
                      }}
                    />

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" noWrap>
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ fontSize: '1rem', mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2" color="primary" noWrap>
                          {user.designation}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Contact */}
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.phoneNo}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Skills */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(user.skills || []).map((skill, i) => (
                        <Chip key={i} label={skill} size="small" />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && (
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
    </Container>
  );
};

export default HomePage;
