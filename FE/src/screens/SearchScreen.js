import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getSearchResults,
  baseImagePath,
  IMAGE_SIZES,
  formatMovieData,
} from "../api/apicalls";
import debounce from "lodash/debounce";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = debounce(async (query) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getSearchResults(query);
      const formattedMovies = response.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average.toFixed(1),
        overview: movie.overview,
      }));
      setMovies(formattedMovies);
    } catch (error) {
      console.error("Error searching movies:", error);
      setError("Failed to search movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchMovies(searchQuery);
    return () => searchMovies.cancel();
  }, [searchQuery]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFB800" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (movies.length === 0 && searchQuery) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Image
            source={require("../../assets/images/notfound.png")}
            style={styles.notFoundImage}
            resizeMode="contain"
          />
          <Text style={styles.notFoundTitle}>Not Found</Text>
          <Text style={styles.notFoundDescription}>
            Sorry, the keyword you entered could not be found. Try to check
            again or search with other keywords.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {searchQuery && (
          <Text style={styles.resultCount}>Found {movies.length} results</Text>
        )}
        {movies.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            style={styles.movieCard}
            onPress={() =>
              navigation.navigate("MovieDetail", { movieId: movie.id })
            }
          >
            <View style={styles.movieContent}>
              <ImageBackground
                source={
                  movie.backdrop_path
                    ? {
                        uri: baseImagePath(
                          IMAGE_SIZES.BACKDROP.MEDIUM,
                          movie.backdrop_path
                        ),
                      }
                    : require("../../assets/images/defaultmovies.png")
                }
                style={styles.movieImage}
                imageStyle={styles.movieImageStyle}
              >
                <View style={styles.movieDetails}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                  {movie.release_date && (
                    <Text style={styles.movieDuration}>
                      {new Date(movie.release_date).getFullYear()}
                    </Text>
                  )}
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.movieRating}>
                      {movie.vote_average}/10
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <View style={styles.closeButton}>
                  <Ionicons name="close" size={20} color="black" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {renderContent()}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginLeft: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultCount: {
    fontSize: 16,
    color: "white",
    marginBottom: 16,
  },
  movieCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  movieContent: {
    borderRadius: 16,
    overflow: "hidden",
  },
  movieImage: {
    height: 200,
    justifyContent: "flex-end",
  },
  movieImageStyle: {
    borderRadius: 16,
  },
  movieDetails: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  movieDuration: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieRating: {
    fontSize: 14,
    color: "#FFD700",
    marginLeft: 4,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  noResultsTitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 32,
  },
  notFoundImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  notFoundDescription: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SearchScreen;