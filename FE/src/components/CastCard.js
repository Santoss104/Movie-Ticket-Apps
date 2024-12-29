import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { baseImagePath, IMAGE_SIZES } from "../api/apicalls";

const { width } = Dimensions.get("window");

const CastCard = ({ cast = [] }) => {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {cast.map((actor, index) => (
          <View key={`${actor.name}-${index}`} style={styles.castItem}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  actor.profile_path
                    ? {
                        uri: baseImagePath(
                          IMAGE_SIZES.PROFILE.MEDIUM,
                          actor.profile_path
                        ),
                      }
                    : require("../../assets/images/profile.png")
                }
                style={styles.castImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.castInfo}>
              <Text style={styles.castName} numberOfLines={1}>
                {actor.name}
              </Text>
              <Text style={styles.castRole} numberOfLines={2}>
                {actor.role || actor.character || "Unknown Role"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    marginLeft: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  castItem: {
    marginRight: 16,
    width: width * 0.25,
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2C2C2C",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  castImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  castInfo: {
    marginTop: 8,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  castName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  castRole: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default CastCard;