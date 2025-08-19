import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from 'react';
import { setUserProfile } from "../../../store/features/userProfileSlice"; // adjust path as needed
import { apiUrl } from "../../../utils/common";

const UserProfile = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const url = `${apiUrl}/all-details/manoj_382`;
        const response = await axios.get(url);
        dispatch(setUserProfile(response.data)); // store all payload data in redux
        console.log("Fetched user profile:", response.data);
      } catch (e) {
        console.log("error in userprofile", e);
        dispatch(setUserProfile(null));
      }
    };
    if (user.userName) {
      fetchUserProfile();
    }
  }, [user.userName, dispatch]);

  return (
    <div>userProfile</div>
  );
};

export default UserProfile;