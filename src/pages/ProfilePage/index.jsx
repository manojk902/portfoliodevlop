import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Button,
  Stack,
  Divider,
  Skeleton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useState } from 'react';
import { setUserProfile } from '../../store/features/userProfileSlice';
import { apiUrl } from '../../utils/common';




const user1 = {
  profilePhoto: 'dummy data', // Add image URL or leave blank
  firstName: 'dummy data',
  lastName: 'dummy data',
  designation: 'dummy data',
  dob: 'dummy data',
  gender: 'dummy data',
  phoneNo: 'dummy data',
  email: 'john@example.com',
  socialLink: 'https://linkedin.com/in/johndeo',
  city: 'New York',
  state: 'NY',
  pincode: '10001',
};

export default function ProfilePage() {
  const [hasCV, setHasCV] = useState(false)
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  console.log("ddd", apiUrl)

  const navigate = useNavigate();
  // const user = useSelector(state => state.user);
  const userProfile = useSelector(state => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName

  // console.log("ttttttt", userProfile.fetchedUsed.profilePhoto);

  const editProfile = () => {
    navigate("/editprofile", { state: { isUpdate: true } });
  };
  const signOut = () => {
    localStorage.removeItem("token")
    navigate("/")
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const updated = await axios.get(`${apiUrl}/user-details/${username}`);
        dispatch(setUserProfile(updated.data));
        setLoading(false);
      } catch (error) {
        console.log("thi is profile fetching erropeer", error);
        setLoading(false);

      }

    }
    fetchProfile()
  }, [username, dispatch])

  useEffect(() => {
    const checkCVExists = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/cv-details/${username}`
        );
        const exists = !!response.data;
        setHasCV(exists);
      } catch (error) {
        console.log("CV does not exist.");
        setHasCV(false);
      }
    };
    checkCVExists();
  }, [username]); /*this*/
  const handleCVAction = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/cv-details/${username}`
      );
      // CV exists — navigate to edit mode using userName
      navigate('/create-cv?edit=true&user=testing_user', {
        state: { existingData: res.data }
      });

    } catch (error) {
      // No CV — navigate to create mode
      navigate('/create-cv');
    }
  };
  // console.log("this is from  ", user.userName);
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1e1e2f, #3c3c78)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
        pb: 8,
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {loading ? (
        <>
          {/* Skeleton for Left Sidebar Controls */}
          <Box sx={{ position: 'absolute', top: 32, left: 32 }}>
            <Stack spacing={2} alignItems="flex-start">
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
              <Skeleton
                variant="rectangular"
                width={120}
                height={36}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={120}
                height={36}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}
              />
            </Stack>
          </Box>

          {/* Skeleton for Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Skeleton
              variant="circular"
              width={140}
              height={140}
              sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }}
            />
            <Skeleton
              variant="text"
              width={200}
              height={40}
              sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
            <Skeleton
              variant="text"
              width={150}
              height={24}
              sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>

          {/* Skeleton for Info Card */}
          <Box
            sx={{
              mt: { xs: 4, sm: 6 },
              px: { xs: 3, sm: 5 },
              py: 5,
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: 4,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              maxWidth: 920,
              width: '100%',
            }}
          >
            <Skeleton
              variant="text"
              width={150}
              height={28}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            />
            <Skeleton
              variant="rectangular"
              height={2}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }}
            />
            <Grid container spacing={4}>
              {Array(8)
                .fill()
                .map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton
                      variant="text"
                      width={80}
                      height={20}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                    <Skeleton
                      variant="text"
                      width={120}
                      height={24}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                  </Grid>
                ))}
            </Grid>
            <Box mt={5} display="flex" justifyContent="center" gap={3}>
              <Skeleton
                variant="rectangular"
                width={120}
                height={40}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width={140}
                height={40}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
              />
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Left Sidebar Controls */}
          <Box sx={{ position: 'absolute', top: 32, left: 32 }}>
            <Stack spacing={2} alignItems="flex-start">
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <SettingsIcon />
              </IconButton>
              <Button
                startIcon={<EditIcon />}
                onClick={editProfile}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': { borderColor: '#ddd', color: '#eee' },
                }}
              >
                Edit Profile
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                variant="outlined"
                onClick={signOut}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': { borderColor: '#ddd', color: '#eee' },
                }}
              >
                Sign Out
              </Button>
            </Stack>
          </Box>

          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', color: 'white', mb: 2 }}>
            <Avatar
              src={userProfile?.fetchedUsed?.profilePhoto}
              alt={userProfile?.fetchedUsed?.firstName}
              sx={{
                width: 140,
                height: 140,
                mx: 'auto',
                mb: 2,
                border: '4px solid white',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.6)',
                },
              }}
            />
            <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif' }}>
              {userProfile?.fetchedUsed?.firstName || 'First'} {userProfile?.fetchedUsed?.lastName || 'Last'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
              {userProfile?.fetchedUsed?.designation}
            </Typography>
          </Box>

          {/* Info Card */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              mt: { xs: 4, sm: 6 },
              px: { xs: 3, sm: 5 },
              py: 5,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: 4,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              maxWidth: 920,
              width: '100%',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Contact Info
            </Typography>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />
            <Grid container spacing={4}>
              {[
                ['Date of Birth', userProfile?.fetchedUsed?.dob || user1.dob],
                ['Gender', userProfile?.fetchedUsed?.gender || user1.gender],
                ['Phone', userProfile?.fetchedUsed?.phoneNo || user1.phoneNo],
                ['Email', userProfile?.fetchedUsed?.email || user1.email],
                ['Social Link', userProfile?.socialLink || user1.socialLink],
                ['City', userProfile?.fetchedUsed?.city || user1.city],
                ['State', userProfile?.fetchedUsed?.state || user1.state],
                ['Pincode', userProfile?.fetchedUsed?.pinCode || user1.pincode],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} md={4} key={label}>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    {label}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: 'white' }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Actions */}
            <Box mt={5} display="flex" justifyContent="center" gap={3}>
              <Button
                onClick={handleCVAction}
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #1a73e8, #8e2de2)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {hasCV ? 'Update CV' : 'Create10CV'}
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/createportfolio"
                sx={{
                  background: 'linear-gradient(to right, #5f72be, #9b23ea)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  },
                }}
              >
                Create Portfolio
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
