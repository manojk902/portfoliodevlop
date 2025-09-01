/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

function UserInfo() {
  const [users, setUsers] = useState([]);
  const [defaultUser, setDefaultUser] = useState({});
  const [userid, setUserId] = useState()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.2:9000/api/v1/portfolio/cv-details/mukesh_277`
        );
        setUsers(response.data.fetchedCv.cvInfo);
        setUserId(response.data.fetchedCv.userId);
        setDefaultUser(response.data.fetchedCv.templateInfo);
        // manoj_804 userid52,,, manoj_756 userid5
        console.log(`=====`, response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [userid]);
  
  const handleSetDefault = async (userId, cvInfoId) => {
    console.log(userId, cvInfoId);

    try {
      const response = await axios.put(
        `http://192.168.0.2:9000/api/v1/portfolio/updateDefaultCvId`
        , {
          userId: userId,
          cvInfoId: cvInfoId
        });
      // setUsers(response.data.fetchedCv.cvInfo);
      // manoj_804 userid52,,, manoj_756 userid5
      console.log(`=====d`, response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    // updateDefaultCvId
    // handleSetDefault;
  };

  const handleEdit = (id) => {
    axios
      .put(`https://jsonplaceholder.typicode.com/users/${id}`, {
        name: "Updated Name"
      })
      .then((res) => {
        console.log("Edit API response:", res.data);
        alert(`Edited user with id ${id}`);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => {
        console.log("Delete API response:", res.data);
        alert(`Deleted user with id ${id}`);
      })
      .catch((err) => console.error(err));
  };

  const handleAddNew = () => {
    alert("Add Group / Add Info button clicked!");
    // yaha tu apna modal ya form open kara sakta hai
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // 5 cards per row
          gap: 2
        }}
      >
        {users.map((user) => (
          <Card key={user.id} sx={{ p: 2, height: "100%" }}>
            <CardContent>
              {/* User Details */}
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

              {/* Action Row: Left Icon | Default Button | Right Icon */}
              <Box
                mt={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {/* Left Icon */}
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleEdit(user.id)}
                >
                  <Edit fontSize="small" />
                </IconButton>

                {/* Center Button */}
                <Button
                  variant={defaultUser.cvInfoId === user.cvInfoId ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => handleSetDefault(userid, user.cvInfoId)}
                >
                  {defaultUser.cvInfoId === user.cvInfoId ? "Default" : "Set as Default"}
                </Button>

                {/* Right Icon */}
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(user.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Extra Card for Add New */}
        <Card
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px dashed #aaa"
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
      </Box>
    </Box>
  );
}

export default UserInfo;
