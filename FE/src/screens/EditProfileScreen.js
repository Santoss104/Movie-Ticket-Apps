import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Alert,
  ImageBackground,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../context/ProfileContext";

const genderOptions = [
  "Male",
  "Female",
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { profile, updateProfile, getProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showGenderModal, setShowGenderModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        await getProfile();
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.name || "");
      setPhone(profile.phone || "");
      setGender(profile.gender || "");
    }
  }, [profile]);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName.trim());
    if (phone.trim()) formData.append("phone", phone.trim());
    if (gender) formData.append("gender", gender);

    try {
      setLoading(true);
      const success = await updateProfile(formData);

      if (success) {
        Alert.alert("Success", "Profile updated successfully!");
        await getProfile();
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "The app requires permission to access the gallery.!"
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets[0]
      ) {
        const imageUri = pickerResult.assets[0].uri;

        const formData = new FormData();
        formData.append("avatar", {
          uri: imageUri,
          type: "image/jpeg",
          name: "profile-image.jpg",
        });

        const success = await updateProfile(formData);
        if (!success) {
          Alert.alert("Error", "Failed to update profile photo");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  if (profileLoading) {
    return (
      <ImageBackground
        source={require("../../assets/images/screenBG.png")}
        style={[styles.container, styles.centerContent]}
      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={
                profile?.avatarUrl
                  ? { uri: profile.avatarUrl }
                  : require("../../assets/images/defaultavatar.png")
              }
              style={styles.profilePicture}
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={handleImageChange}
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#666"
              placeholder="Enter your full name"
            />

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={[styles.input, { color: "#888" }]}
              value={profile?.email}
              placeholderTextColor="#666"
              editable={false}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>PHONE</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                  placeholder="Enter phone number"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.label}>GENDER</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowGenderModal(true)}
                >
                  <Text
                    style={[styles.inputText, !gender && styles.placeholder]}
                  >
                    {gender || "Select gender"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FFA500" />
          ) : (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalOption,
                    index === genderOptions.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => handleGenderSelect(option)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGenderModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

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
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 140,
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 50,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "white",
  },
  inputText: {
    color: "white",
    fontSize: 16,
    marginTop:"16",
  },
  placeholder: {
    color: "#666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfWidth: {
    width: "48%",
  },
  updateButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  updateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalOptionText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  modalCancelButton: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#FFA500",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default EditProfileScreen;