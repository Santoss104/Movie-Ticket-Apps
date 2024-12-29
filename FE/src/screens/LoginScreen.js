import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfile } from "../context/ProfileContext";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { getProfile } = useProfile();

  useEffect(() => {
    const checkSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("rememberedEmail");
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.log("Error checking saved email:", error);
      }
    };

    checkSavedEmail();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://moviepass.freack21.web.id/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        await AsyncStorage.setItem("accessToken", response.data.accessToken);

        if (rememberMe) {
          await AsyncStorage.setItem("rememberedEmail", email);
        } else {
          await AsyncStorage.removeItem("rememberedEmail");
        }

        await getProfile();

        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.log("Login error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            "Error",
            "Incorrect email or password. Please try again."
          );
        } else {
          Alert.alert(
            "Error",
            error.response.data.message || "Login failed. Please try again."
          );
        }
      } else {
        Alert.alert("Error", "Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/signBG.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>Login to Your Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, loading && styles.inputDisabled]}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}
            >
              {rememberMe && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="#FFA500"
                />
              )}
            </TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signInButton,
              loading && styles.signInButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text style={styles.signInText}>Sign in</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or continue with</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width: width,
    height: height,
    position: "absolute",
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 200,
    fontWeight: "bold",
    color: "#FFA500",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: "white",
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    color: "white",
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: "25%",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    color: "white",
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#666",
  },
  separatorText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    paddingHorizontal: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "white",
    fontSize: 16,
  },
  registerLink: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;