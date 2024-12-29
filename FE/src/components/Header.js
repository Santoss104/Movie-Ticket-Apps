import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../context/ProfileContext";

const Header = () => {
  const navigation = useNavigation();
  const { profile, loading, getProfile } = useProfile();

  useEffect(() => {
    getProfile();
  }, []);

  const handleProfileClick = () => {
    navigation.navigate("Profile");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ActivityIndicator size="small" color="#FFA500" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>
            Welcome, {profile?.name || "User"}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="rgba(255,255,255,0.5)"
            />
            <Text style={styles.locationText}>Pekanbaru</Text>
          </View>
        </View>
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            onPress={handleProfileClick}
            style={styles.profileTouchable}
          >
            <View style={styles.profileContainer}>
              <Image
                source={
                  profile?.avatarUrl
                    ? { uri: profile.avatarUrl }
                    : require("../../assets/images/defaultavatar.png")
                }
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    color: "rgba(255,255,255,0.5)",
    marginLeft: 4,
    fontSize: 14,
  },
  profileWrapper: {
    padding: 2,
    backgroundColor: "#fff",
    borderRadius: 25,
    marginLeft: 16,
  },
  profileTouchable: {
    activeOpacity: 0.7,
  },
  profileContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default Header;