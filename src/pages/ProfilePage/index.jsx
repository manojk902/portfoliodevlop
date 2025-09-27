import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShareIcon from '@mui/icons-material/Share';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';

import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserProfile } from '../../store/features/userProfileSlice';
import { apiUrl } from '../../utils/common';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
const user1 = {
  profilePhoto: '',
  firstName: 'Alpha',
  lastName: 'Zero',
  designation: 'System Architect',
  dob: '2000-01-01T00:00:00Z',
  gender: 'Unspecified',
  phoneNo: '0000000000',
  email: 'alpha.zero@nowhere.test',
  socialLinks: ['https://placeholder.link/alpha'],
  city: 'NullCity',
  state: 'NowhereState',
  pincode: '000000',
  about: 'An abstract persona used for testing purposes. Does not belong to any country or real entity.',
};

function ProfilePage() {
  // const [hasCV, setHasCV] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;

  // Functionality remains the same
  const editProfile = () => {
    navigate('/editprofile', { state: { isUpdate: true } });
  };

  const handleCVAction = async () => {
    try {
      // await axios.get(`${apiUrl}/cv-details/${username}`);
      navigate('/edit');
    } catch (error) {
      navigate('/edit');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // You would typically save this to localStorage
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const updated = await axios.get(`${apiUrl}/user-details/${username}`);
        dispatch(setUserProfile(updated.data));
        setLoading(false);
      } catch (error) {
        console.log('this is profile fetching error', error);
        setLoading(false);
      }
    };
    if (username) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [username, dispatch]);

  const primaryColor = '#4F46E5';
  const subtextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#F9FAFB' : '#1F2937';

  // Component to render info items with icons
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.875rem' }}>
      <Box sx={{ color: subtextColor, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Box sx={{ color: textColor }}>
        {label === 'Social Links' && Array.isArray(value) ? (
          value.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              style={{
                color: primaryColor,
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {link}
            </a>
          ))
        ) : label === 'Email' ? (
          <a
            href={`mailto:${value}`}
            style={{ color: primaryColor, textDecoration: 'none' }}
          >
            {value}
          </a>
        ) : (
          <span>{value}</span>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        bgcolor: isDarkMode ? '#111827' : '#F3F4F6',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          maxWidth: '960px',
          width: '100%',
          mx: 'auto',
          bgcolor: cardBgColor,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box>
            {/* Cover Photo Skeleton */}
            <Skeleton variant="rectangular" width="100%" height={192} />

            {/* Content Skeletons */}
            <Box sx={{ p: 4, position: 'relative' }}>
              <Skeleton
                variant="circular"
                width={128}
                height={128}
                sx={{ position: 'absolute', left: 32, top: -64, border: `4px solid ${cardBgColor}` }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mt: { xs: 4, md: 0 } }}>
                  <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '8px' }} />
                  <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '8px' }} />
                </Stack>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
              </Box>
              <Box sx={{ mt: 4 }}>
                <Skeleton variant="text" width="20%" height={24} />
                <Skeleton variant="text" width="90%" />
              </Box>
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${borderColor}` }}>
                <Skeleton variant="text" width="30%" height={24} />
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
                  {Array(6).fill().map((_, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width="70%" />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${borderColor}` }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: '8px' }} />
                  <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: '8px' }} />
                </Stack>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* Cover Photo Section */}
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                sx={{
                  height: 192,
                  width: '100%',
                  objectFit: 'cover',
                }}
                src="https://tse4.mm.bing.net/th/id/OIP.3pRVgDEHgJprQOdd1GsQQAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Cover photo"
              />
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  {isDarkMode ? <WbSunnyIcon /> : <NightlightIcon />}
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Profile Content Section */}
            <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
              <Avatar
                src={userProfile?.fetchedUsed?.profilePhoto || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJbeYJKaFNeGPnhYHTwz0JPZjUTmEk08oJPoGNZmNKvK0D5jZL-Uv6KuyqwUiWoguYrRUYyySVtnnirl7-nFpOHFvuzBUIEq9QCN4gsnzwr53pMWe7pWzG6OjMW2RxKyotKtj7nShvTPF0cYVeSx5-hwiDucPvvS2fBhhwiI1k7a-f_Sh5c6652WhX6ZsWBk2WATdlU_EtVMXpNRLKb7eo1UVZsoovtJ9WU5kP8ptMFqRTltvj0mqhi-P3yRDmM1MaNAPUOPqnvXE'}
                alt={userProfile?.fetchedUsed?.firstName || user1.firstName}
                sx={{
                  position: 'absolute',
                  left: { xs: '50%', md: 32 },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  top: { xs: -64, md: -64 },
                  width: 128,
                  height: 128,
                  border: `4px solid ${cardBgColor}`,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 1 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                    onClick={editProfile}
                    sx={{
                      bgcolor: `${primaryColor}1A`,
                      color: primaryColor,
                      '&:hover': { bgcolor: `${primaryColor}33` },
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                    onClick={handleCVAction}
                    sx={{
                      bgcolor: primaryColor,
                      color: 'white',
                      '&:hover': { bgcolor: '#4338CA' },
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                    }}
                  >
                    Create Portfolio
                  </Button>
                </Stack>
              </Box>

              {/* Name & Designation */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4" sx={{ color: textColor, fontWeight: 'bold' }}>
                  {userProfile?.fetchedUsed?.firstName || user1.firstName}{' '}
                  {userProfile?.fetchedUsed?.lastName || user1.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: subtextColor, mt: 0.5 }}>
                  {userProfile?.fetchedUsed?.designation || user1.designation}
                </Typography>
              </Box>

              {/* About Section */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 2 }}>
                  About
                </Typography>
                <Typography sx={{ color: subtextColor, lineHeight: 1.6 }}>
                  {userProfile?.fetchedUsed?.about || user1.about}
                </Typography>
              </Box>

              {/* Contact Information Section */}
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${borderColor}` }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 3 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12} md={6} lg={4}>
                    <InfoItem
                      icon={<CakeIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Date of Birth"
                      value={userProfile?.fetchedUsed?.dob ? format(parseISO(userProfile.fetchedUsed.dob), 'MMMM d, yyyy') : user1.dob}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <InfoItem
                      icon={<PersonIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Gender"
                      value={userProfile?.fetchedUsed?.gender || user1.gender}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <InfoItem
                      icon={<PhoneIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Phone"
                      value={userProfile?.fetchedUsed?.phoneNo || user1.phoneNo}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <InfoItem
                      icon={<LocationOnIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Address"
                      value={`${userProfile?.fetchedUsed?.city || user1.city}, ${userProfile?.fetchedUsed?.state || user1.state}`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <InfoItem
                      icon={<EmailIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Email"
                      value={userProfile?.fetchedUsed?.email || user1.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <InfoItem
                      icon={<LinkIcon sx={{ fontSize: '1.25rem' }} />}
                      label="Social Links"
                      value={userProfile?.fetchedUsed?.socialLinks || user1.socialLinks}
                    />
                  </Grid>

                </Grid>
              </Box>

              {/* Bottom Buttons */}
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${borderColor}` }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    startIcon={<UploadFileIcon />}
                    sx={{
                      bgcolor: `${primaryColor}1A`,
                      color: primaryColor,
                      '&:hover': { bgcolor: `${primaryColor}33` },
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: '8px',
                      width: '100%',
                    }}
                  >
                    Update CV
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    sx={{
                      bgcolor: `${primaryColor}1A`,
                      color: primaryColor,
                      '&:hover': { bgcolor: `${primaryColor}33` },
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: '8px',
                      width: '100%',
                    }}
                  >
                    Share Profile
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
} export default ProfilePage;