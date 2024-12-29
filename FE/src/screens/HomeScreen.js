import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import MovieCard from "../components/MovieCard";
import {
  getNowPlayingMoviesList,
  getUpcomingMoviesList,
  getPopularMoviesList,
  initializeGenres,
  formatMovieData,
  MOVIE_CATEGORIES,
} from "../api/apicalls";

const { width } = Dimensions.get("window");

const categoryMappings = {
  "Now Playing": MOVIE_CATEGORIES.NOW_PLAYING,
  Upcoming: MOVIE_CATEGORIES.UPCOMING,
  Popular: MOVIE_CATEGORIES.POPULAR,
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Now Playing");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (selectedCategory) {
        case "Now Playing":
          response = await getNowPlayingMoviesList(page);
          break;
        case "Upcoming":
          response = await getUpcomingMoviesList(page);
          break;
        case "Popular":
          response = await getPopularMoviesList(page);
          break;
        default:
          response = await getNowPlayingMoviesList(page);
      }

      const formattedMovies = response.results.map((movie) =>
        formatMovieData(movie)
      );

      setMovies(formattedMovies);
      if (formattedMovies.length > 0) {
        setCurrentBg(formattedMovies[0].backdrop);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const slideSize = width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / slideSize);

    if (movies[index] && movies[index].backdrop !== currentBg) {
      setCurrentBg(movies[index].backdrop);
    }
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate("MovieDetail", { movieId });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB800" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <ScrollView
        accessible={true}
        accessibilityLabel="Available movies list"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {movies.map((movie) => (
          <View key={movie.id} style={styles.movieWrapper}>
            <MovieCard
              movie={movie}
              onPress={() => handleMoviePress(movie.id)}
            />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ImageBackground
      source={
        currentBg
          ? { uri: currentBg }
          : require("../../assets/images/screenBG.png")
      }
      style={styles.background}
      blurRadius={90}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Header />
            <CategoryList
              categories={Object.keys(categoryMappings)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {renderContent()}
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  movieWrapper: {
    width: width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;