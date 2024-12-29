import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    avatarUrl: null,
  });
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.get(
        "https://moviepass.freack21.web.id/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setProfile({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          gender: response.data.gender || "",
          avatarUrl: response.data.avatarUrl || null,
        });
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
      if (error.response) {
        console.log("Error Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await axios.put(
        "https://moviepass.freack21.web.id/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await getProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  const updateProfileImage = (newImage) => {
    setProfile((prev) => ({
      ...prev,
      avatarUrl: newImage,
    }));
  };

  useEffect(() => {
    const checkTokenAndLoadProfile = async () => {
      const token = await getToken();
      if (token) {
        getProfile();
      }
    };

    checkTokenAndLoadProfile();
  }, []);

  const value = {
    profile,
    setProfile,
    loading,
    getProfile,
    updateProfile,
    updateProfileImage,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export default ProfileProvider;