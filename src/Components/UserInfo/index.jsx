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
  Skeleton
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import { apiUrl } from "../../utils/common";
import { useNavigate } from "react-router-dom";
// ...existing code...

function UserInfo() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [defaultUser, setDefaultUser] = useState({});
  const [userid, setUserId] = useState();
  const [updatingCvId, setUpdatingCvId] = useState(null);
  const [deletingCvId, setDeletingCvId] = useState(null);
  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userNamEe || "mukesh_277";
  console.log(userProfile, "userProfile from userinfo");

  // const username = userProfile?.fetchedUsed?.userNamEe || "mukesh_277";
  // const username = userProfile?.fetchedUsed?.userNamEe || "mukesh_277";
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/cv-details/${username}`);
      setUsers(response.data.fetchedCv.cvInfo || []);
      setUserId(response.data.fetchedCv.userId);
      setDefaultUser(response.data.fetchedCv.templateInfo || {});
      // console.log("===== ", response.data);
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
  };

  const handleEdit = (cvInfoId) => {
    // navigate(`/edit/add-group`)
    navigate(`/edit/add-group?groupId=${cvInfoId}`)
  };

  const handleDelete = async (userId, cvInfoId) => {
    if (!userId || !cvInfoId) return;
    const ok = window.confirm("Are you sure you want to delete this CV?");
    if (!ok) return;
    setDeletingCvId(cvInfoId);
    try {
      // axios.delete with body: pass data in config
      const res = await axios.delete(`${apiUrl}/deleteCvInfoSet`, {
        data: { userId, cvInfoId },
      });
      console.log("delete response:", res.data);
      // remove the deleted card from UI
      setUsers((prev) => prev.filter((u) => u.cvInfoId !== cvInfoId));
      // optional: if server returns updated list, you can use setUsers(res.data.updatedList)
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingCvId(null);
    }
  };

  const handleAddNew = () => {
    navigate(`add-group`);
    // alert("Add Group / Add Info button clicked!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {loading ? (
          // Skeletons while loading
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ p: 2, height: "100%" }}>
                <Skeleton variant="text" height={32} width="70%" sx={{ mb: 1, ml: 2 }} />
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
                    <Skeleton width={140} height={32} sx={{ ml: 0.5, mr: 0.5 }} />
                    <Skeleton variant="circular" width={20} height={30} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            {users.map((user) => {
              const key = user.cvInfoId ?? userid;
              const isDefault = defaultUser?.cvInfoId === user.cvInfoId;
              return (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Card sx={{ p: 2, height: "100%" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {user.designation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        Email: {user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        Phone: {user.phoneNo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        City: {user.address?.city}
                      </Typography>

                      <Box
                        mt={2}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(user.cvInfoId)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <Button
                          variant={isDefault ? "contained" : "outlined"}
                          color="primary"
                          size="small"
                          onClick={() => handleSetDefault(userid, user.cvInfoId)}
                          disabled={updatingCvId === user.cvInfoId || isDefault}
                        >
                          {updatingCvId === user.cvInfoId
                            ? "Updating..."
                            : isDefault
                              ? "Default"
                              : "Set as Default"}
                        </Button>

                        {users.length > 1 && !isDefault && (
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(userid, user.cvInfoId)}
                            disabled={deletingCvId === user.cvInfoId}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}

                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {/* Add New card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px dashed #aaa",
                }}
                onClick={handleAddNew}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Add sx={{ fontSize: 40, color: "primary.main" }} />
                  <Typography variant="body1" color="primary">
                    Add Group / Add Info
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default UserInfo;