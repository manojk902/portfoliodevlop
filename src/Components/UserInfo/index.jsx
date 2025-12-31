/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
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
    const userIdToDelete = deleteDialog.userId ?? userid;
    const cvInfoId = deleteDialog.cvInfoId;

    if (!userIdToDelete || !cvInfoId) {
      console.warn("Delete aborted: missing userId or cvInfoId", { userId: userIdToDelete, cvInfoId });
      return;
    }

    setDeletingCvId(cvInfoId);
    try {
      console.log("Deleting CV:", { userId: userIdToDelete, cvInfoId });
      const res = await axios.delete(`${apiUrl}/deleteCvInfoSet`, {
        data: { userId: userIdToDelete, cvInfoId },
      });
      console.log("delete response:", res.data);
      // Remove the deleted CV from local state
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
    /* Replace the entire Grid container block with this */
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 3,
        alignItems: "stretch",
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        pt: { xs: 2, sm: 3, md: 4 },   // <— ADDED
      }}
    >
      {loading
        ? // skeletons
        Array.from(new Array(8)).map((_, index) => (
          <Card key={`s-${index}`} sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Skeleton variant="text" height={32} width="70%" sx={{ mb: 1, ml: 2 }} />
            <CardContent>
              <Skeleton height={20} width="50%" sx={{ mb: 0.5 }} />
              <Skeleton height={20} width="85%" sx={{ mb: 0.5 }} />
              <Skeleton height={20} width="95%" sx={{ mb: 1 }} />
              <Box mt={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Skeleton variant="circular" width={20} height={30} />
                <Skeleton width={140} height={32} sx={{ ml: 0.5, mr: 0.5 }} />
                <Skeleton variant="circular" width={20} height={30} />
              </Box>
            </CardContent>
          </Card>
        ))
        : (
          <>
            {/* Add New card as first grid cell */}
            <Card
              onClick={handleAddNew}
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
                borderRadius: 3,
                transition: "all 0.3s ease",
                backgroundColor: "white",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4, borderColor: "primary.main" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Add sx={{ fontSize: 48, color: "primary.light", mb: 1 }} />
                <Typography variant="h6" color="primary" fontWeight={600}>Create New CV</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add your professional details
                </Typography>
              </CardContent>
            </Card>

            {/* User CV Cards */}
            {users.map((user) => {
              const key = user.cvInfoId ?? userid;
              const isDefault = defaultUser?.cvInfoId === user.cvInfoId;
              const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

              return (
                <Card
                  key={key}
                  sx={{
                    height: "280px",
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "all 0.3s ease",
                    border: isDefault ? "2px solid" : "1px solid",
                    borderColor: isDefault ? "primary.light" : "divider",
                    backgroundColor: "white",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* same inner content as before */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h2" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "1.1rem" }}>
                          <Person color="primary" fontSize="small" />
                          {userName || "Unnamed CV"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {user.designation && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <Work color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight={500} noWrap>{user.designation}</Typography>
                      </Box>
                    )}

                    <Box sx={{ mb: 2, flex: 1 }}>
                      {user.email && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Email fontSize="small" sx={{ color: "text.secondary", fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: "0.8rem" }}>{user.email}</Typography>
                        </Box>
                      )}

                      {user.phoneNo && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Phone fontSize="small" sx={{ color: "text.secondary", fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>{user.phoneNo}</Typography>
                        </Box>
                      )}

                      {user.address && (
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <LocationOn fontSize="small" sx={{ color: "text.secondary", fontSize: 16, mt: 0.25 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, fontSize: "0.8rem" }} noWrap>
                            {formatAddress(user.address)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Button variant="outlined" color="primary" size="small" startIcon={<Edit />} onClick={() => handleEdit(user.cvInfoId)} sx={{ borderRadius: 3, textTransform: "none", fontSize: "0.75rem" }}>
                        Edit
                      </Button>

                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button variant={isDefault ? "contained" : "outlined"} color={isDefault ? "success" : "primary"} size="small" startIcon={isDefault ? <CheckCircle /> : null} onClick={() => handleSetDefault(userid, user.cvInfoId)} disabled={updatingCvId === user.cvInfoId} sx={{ borderRadius: 3, textTransform: "none", minWidth: "auto", px: 1.5, fontSize: "0.7rem" }}>
                          {updatingCvId === user.cvInfoId ? "..." : isDefault ? "Selected" : "Set As Default"}
                        </Button>

                        {users.length > 1 && !isDefault && (
                          <Tooltip title="Delete CV" arrow placement="top">
                            <IconButton color="error" size="small" onClick={() => openDeleteDialog(userid, user.cvInfoId, userName || "Unnamed CV")} disabled={deletingCvId === user.cvInfoId} sx={{ borderRadius: 3 }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete CV</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.userName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deletingCvId === deleteDialog.cvInfoId}
          >
            {deletingCvId === deleteDialog.cvInfoId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}

export default UserInfo;
