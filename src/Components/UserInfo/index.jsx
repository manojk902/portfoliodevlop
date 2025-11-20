/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Grid,
  Skeleton,
  Fab,
  Tooltip,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import { apiUrl } from "../../utils/common";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [defaultUser, setDefaultUser] = useState({});
  const [userid, setUserId] = useState();
  const [updatingCvId, setUpdatingCvId] = useState(null);
  const [deletingCvId, setDeletingCvId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
    cvInfoId: null,
    userName: "",
  });

  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;

  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/cv-details/${username}`);
      const cvInfo = response.data.fetchedCv.cvInfo || [];

      // Get default CV info first
      const defaultCvInfo = response.data.fetchedCv.templateInfo || {};
      setDefaultUser(defaultCvInfo);

      // Sort with default CV first, then latest first
      const sorted = cvInfo.sort((a, b) => {
        const isADefault = defaultCvInfo?.cvInfoId === a.cvInfoId;
        const isBDefault = defaultCvInfo?.cvInfoId === b.cvInfoId;

        if (isADefault && !isBDefault) return -1;
        if (!isADefault && isBDefault) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setUsers(sorted);
      setUserId(response.data.fetchedCv.userId);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [username]);

  const handleSetDefault = async (userId, cvInfoId) => {
    if (!userId || !cvInfoId) return;

    // If already default, remove it
    if (defaultUser?.cvInfoId === cvInfoId) {
      setUpdatingCvId(cvInfoId);
      try {
        await axios.put(`${apiUrl}/updateDefaultCvId`, {
          userId,
          cvInfoId: null, // Remove default
        });
        setDefaultUser({});
        await fetchUsers();
      } catch (error) {
        console.error("Error removing default:", error);
      } finally {
        setUpdatingCvId(null);
      }
    } else {
      // Set as default
      setUpdatingCvId(cvInfoId);
      try {
        await axios.put(`${apiUrl}/updateDefaultCvId`, {
          userId,
          cvInfoId,
        });
        await fetchUsers();
      } catch (error) {
        console.error("Error setting default:", error);
      } finally {
        setUpdatingCvId(null);
      }
    }
  };

  const handleEdit = (cvInfoId) => {
    navigate(`/edit/add-group?groupId=${cvInfoId}&edit=true`);
  };

  const openDeleteDialog = (userId, cvInfoId, userName) => {
    setDeleteDialog({
      open: true,
      userId,
      cvInfoId,
      userName: userName || "This CV",
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      userId: null,
      cvInfoId: null,
      userName: "",
    });
  };

  const handleDelete = async () => {
    const { userId, cvInfoId } = deleteDialog;
    if (!userId || !cvInfoId) return;

    setDeletingCvId(cvInfoId);
    try {
      const res = await axios.delete(`${apiUrl}/deleteCvInfoSet`, {
        data: { userId, cvInfoId },
      });
      console.log("delete response:", res.data);
      setUsers((prev) => prev.filter((u) => u.cvInfoId !== cvInfoId));
      closeDeleteDialog();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingCvId(null);
    }
  };

  const handleAddNew = () => {
    navigate("/edit/add-group?edit=false");
  };

  // Format address function
  const formatAddress = (address) => {
    if (!address) return "No address";
    const { street, city, state, pinCode, country } = address;
    const parts = [street, city, state, pinCode, country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Box
      sx={{
        py: 3,
        pr: { xs: 1, sm: 2, md: 3, lg: 4 },
        pl: { xs: 1, sm: 2, md: 3, lg: 4 },
        minHeight: "100vh",
        backgroundColor: "#fffafae6",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Floating Add Button */}
        <Tooltip title="Add New CV">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddNew}
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 1200,
              boxShadow: 4,
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>

      {/* <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: 16,
          fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
          fontFamily: "'Inter', 'SF Pro Display', sans-serif",
        }}
      >
        My CV Details 
      </Typography> */}

      <Grid container spacing={3}>
        {loading ? (
          // Skeletons while loading
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ p: 2, height: "100%", borderRadius: 2 }}>
                <Skeleton
                  variant="text"
                  height={32}
                  width="70%"
                  sx={{ mb: 1, ml: 2 }}
                />
                <CardContent>
                  <Skeleton height={20} width="50%" sx={{ mb: 0.5 }} />
                  <Skeleton height={20} width="85%" sx={{ mb: 0.5 }} />
                  <Skeleton height={20} width="95%" sx={{ mb: 1 }} />
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Skeleton variant="circular" width={20} height={30} />
                    <Skeleton
                      width={140}
                      height={32}
                      sx={{ ml: 0.5, mr: 0.5 }}
                    />
                    <Skeleton variant="circular" width={20} height={30} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            {/* Add New card */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  p: 3,
                  height: "280px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px dashed",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  backgroundColor: "white",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    borderColor: "primary.main",
                  },
                }}
                onClick={handleAddNew}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Add
                    sx={{
                      fontSize: 48,
                      color: "primary.light",
                      mb: 1,
                    }}
                  />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    Create New CV
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Add your professional details
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* User CV Cards */}
            {users.map((user) => {
              const key = user.cvInfoId ?? userid;
              const isDefault = defaultUser?.cvInfoId === user.cvInfoId;
              const userName = `${user.firstName || ""} ${
                user.lastName || ""
              }`.trim();

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                  <Card
                    sx={{
                      height: "280px",
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: "all 0.3s ease",
                      border: isDefault ? "2px solid" : "1px solid",
                      borderColor: isDefault ? "primary.light" : "divider",
                      backgroundColor: "white",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 2.5,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header with Name and Default Badge */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            fontWeight={600}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Person color="primary" fontSize="small" />
                            {userName || "Unnamed CV"}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      {/* Designation */}
                      {user.designation && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.5,
                          }}
                        >
                          <Work color="action" fontSize="small" />
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {user.designation}
                          </Typography>
                        </Box>
                      )}

                      {/* Contact Information */}
                      <Box sx={{ mb: 2, flex: 1 }}>
                        {user.email && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Email
                              fontSize="small"
                              sx={{ color: "text.secondary", fontSize: 16 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        )}

                        {user.phoneNo && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Phone
                              fontSize="small"
                              sx={{ color: "text.secondary", fontSize: 16 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {user.phoneNo}
                            </Typography>
                          </Box>
                        )}

                        {user.address && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <LocationOn
                              fontSize="small"
                              sx={{
                                color: "text.secondary",
                                fontSize: 16,
                                mt: 0.25,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ lineHeight: 1.3, fontSize: "0.8rem" }}
                              noWrap
                            >
                              {formatAddress(user.address)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(user.cvInfoId)}
                          sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            flex: 1,
                            fontSize: "0.75rem",
                          }}
                        >
                          Edit / Preview
                        </Button>

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Button
                            variant={isDefault ? "contained" : "outlined"}
                            color={isDefault ? "success" : "primary"}
                            size="small"
                            startIcon={isDefault ? <CheckCircle /> : null}
                            onClick={() =>
                              handleSetDefault(userid, user.cvInfoId)
                            }
                            disabled={updatingCvId === user.cvInfoId}
                            sx={{
                              borderRadius: 1,
                              textTransform: "none",
                              minWidth: "auto",
                              px: 1.5,
                              fontSize: "0.7rem",
                            }}
                          >
                            {updatingCvId === user.cvInfoId
                              ? "..."
                              : isDefault
                              ? "Selected"
                              : "Default"}
                          </Button>

                          {users.length > 1 && (
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() =>
                                openDeleteDialog(
                                  userid,
                                  user.cvInfoId,
                                  userName || "Unnamed CV"
                                )
                              }
                              disabled={deletingCvId === user.cvInfoId}
                              sx={{
                                borderRadius: 1,
                              }}
                            >
                              
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>"{deleteDialog.userName}"</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deletingCvId === deleteDialog.cvInfoId}
            sx={{ textTransform: "none" }}
          >
            {deletingCvId === deleteDialog.cvInfoId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Person sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No CV Profiles Yet
          </Typography>
          <Typography variant="body1">
            Create your first CV profile to get started
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default UserInfo;
