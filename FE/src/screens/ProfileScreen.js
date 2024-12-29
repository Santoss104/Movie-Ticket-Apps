import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfile } from "../context/ProfileContext";
import axios from "axios";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { profile, getProfile } = useProfile();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        await getProfile();
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    const unsubscribe = navigation.addListener("focus", loadProfile);
    return unsubscribe;
  }, [navigation]);

  const handleEditProfileClick = () => {
    navigation.navigate("EditProfile");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem("accessToken");
              if (!token) throw new Error("No token found");

              const response = await axios.post(
                "https://moviepass.freack21.web.id/auth/logout",
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.data.success) {
                await AsyncStorage.removeItem("accessToken");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                });
              } else {
                throw new Error(response.data.message || "Failed to logout");
              }
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to logout. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../../assets/images/screenBG.png")}
        style={[styles.container, styles.centerContent]}
      >
        <ActivityIndicator size="large" color="#FFA500" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={
                profile?.avatarUrl
                  ? { uri: profile.avatarUrl }
                  : require("../../assets/images/defaultavatar.png")
              }
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.username}>{profile?.name || "Your Name"}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.phone && <Text style={styles.phone}>{profile.phone}</Text>}
          {profile?.gender && (
            <Text style={styles.gender}>{profile.gender}</Text>
          )}
        </View>

        <ScrollView style={styles.menuSection}>
          <MenuOption
            icon="person-outline"
            text="Edit Profile"
            onPress={handleEditProfileClick}
          />
          <MenuOption icon="key-outline" text="Change Password" />
          <MenuOption icon="card-outline" text="My Cards" />
          <MenuOption icon="planet-outline" text="Language" />
          <MenuOption icon="people-outline" text="Invite Friends" />
          <MenuOption icon="shield-outline" text="Help" />
          <MenuOption icon="settings-outline" text="Settings" />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const MenuOption = ({ icon, text, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon} size={20} color="white" />
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons
      name="chevron-forward"
      size={20}
      color="white"
      style={styles.chevron}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginLeft: 16,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  profilePictureContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#999",
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 24,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "white",
  },
  chevron: {
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA500",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginRight: 8,
  },
});

export default ProfileScreen;