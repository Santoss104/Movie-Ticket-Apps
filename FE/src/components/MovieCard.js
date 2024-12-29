import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MovieCard = ({ movie, onPress }) => {
  if (!movie) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.container}>
        <Image
          source={
            typeof movie.image === "string"
              ? { uri: movie.image }
              : movie.image || require("../../assets/images/defaultmovies.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.movieInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title || "Unknown Title"}
          </Text>
          <Text style={styles.duration}>
            {movie.duration || "Duration N/A"}
          </Text>
          <View style={styles.genreContainer}>
            {(movie.genres || []).map((genre, index) => (
              <Text key={index} style={styles.genreText}>
                {genre}
                {index < movie.genres.length - 1 ? (
                  <Text style={styles.genreText}> · </Text>
                ) : null}
              </Text>
            ))}
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>{movie.rating || "0"}/10</Text>
            </View>
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchButtonText}>Watch Trailer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 62,
    marginHorizontal: 15,
    borderRadius: 30,
    backgroundColor: "#1E1E1E",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 410,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  movieInfo: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  genreText: {
    color: "#888",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  watchButton: {
    backgroundColor: "#FFB43A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  watchButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default MovieCard;