import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CastCard from "../components/CastCard";
import {
  getMovieDetails,
  getCastList,
  getReviews,
  getSimilarMovies,
  formatRuntime,
  baseImagePath,
  IMAGE_SIZES,
} from "../api/apicalls";

const MovieHeader = ({ onBack, onFavorite }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.iconButton}>
      <Ionicons name="chevron-back" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity onPress={onFavorite} style={styles.iconButton}>
      <Ionicons name="heart-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const MovieInfoCard = ({ title, duration, rating, voteCount, genres }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.movieTitle}>{title || "No Title"}</Text>
    <View style={styles.ratingContainer}>
      <View style={styles.ratingBox}>
        <Ionicons name="star" size={20} color="#FFB800" />
        <Text style={styles.ratingText}>{rating || "0"}/10</Text>
        <Text style={styles.voteCount}>({voteCount || 0}k votes)</Text>
      </View>
      <View style={styles.durationBox}>
        <Ionicons name="time-outline" size={16} color="#9CA3AF" />
        <Text style={styles.durationText}>{duration || "N/A"}</Text>
      </View>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.genreScroll}
    >
      {(genres || []).map((genre, index) => (
        <View key={index} style={styles.genrePill}>
          <Text style={styles.genreText}>{genre}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const PlotSummaryCard = ({ summary }) => (
  <View style={styles.plotContainer}>
    <Text style={styles.sectionTitle}>About the movie</Text>
    <Text style={styles.plotText}>{summary || "No summary available"}</Text>
  </View>
);

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewAuthor}>By {review.author}</Text>
      <View style={styles.reviewRating}>
        <Ionicons name="star" size={16} color="#FFB800" />
        <Text style={styles.reviewRatingText}>{review.rating}/10</Text>
      </View>
    </View>
    <Text style={styles.reviewContent}>{review.content}</Text>
  </View>
);

const RecommendedMoviesCard = ({ movies, navigation }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.recommendedContainer}>
      <Text style={styles.sectionTitle}>Recommended Movies</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recommendedCard}
            onPress={() =>
              navigation.push("MovieDetail", { movieId: movie.id })
            }
          >
            <Image
              source={
                movie.poster_path
                  ? {
                      uri: baseImagePath(
                        IMAGE_SIZES.POSTER.MEDIUM,
                        movie.poster_path
                      ),
                    }
                  : require("../../assets/images/defaultmovies.png")
              }
              style={styles.recommendedPoster}
            />
            <View style={styles.recommendedRating}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.recommendedRatingText}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "0"}/10
              </Text>
            </View>
            <Text style={styles.recommendedTitle} numberOfLines={1}>
              {movie.title || "Unknown Title"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieData();
  }, [movieId]);

  const fetchMovieData = async () => {
    if (!movieId) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [movieDetails, castData, reviewsData, similarMoviesData] =
        await Promise.all([
          getMovieDetails(movieId),
          getCastList(movieId),
          getReviews(movieId),
          getSimilarMovies(movieId),
        ]);

      setMovieData({
        id: movieId,
        title: movieDetails.title,
        duration: formatRuntime(movieDetails.runtime),
        rating: movieDetails.vote_average.toFixed(1),
        voteCount: Math.round(movieDetails.vote_count / 1000),
        genres: movieDetails.genres.map((genre) => genre.name),
        summary: movieDetails.overview,
        poster_path: movieDetails.poster_path,
        backdrop_path: movieDetails.backdrop_path,
        release_date: movieDetails.release_date,
      });

      const formattedCast = castData.cast.slice(0, 10).map((person) => ({
        name: person.name,
        role: person.character,
        profile_path: person.profile_path
          ? baseImagePath(IMAGE_SIZES.PROFILE.MEDIUM, person.profile_path)
          : null,
      }));
      setCast(formattedCast);

      const formattedReviews = reviewsData.results
        .slice(0, 5)
        .map((review) => ({
          author: review.author,
          rating: review.author_details.rating || 7,
          content: review.content,
        }));
      setReviews(formattedReviews);

      setSimilarMovies(similarMoviesData.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setError("Failed to load movie details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFB800" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MovieHeader onBack={() => navigation.goBack()} onFavorite={() => {}} />
        <View style={styles.posterContainer}>
          <Image
            source={
              movieData?.poster_path
                ? {
                    uri: baseImagePath(
                      IMAGE_SIZES.POSTER.LARGE,
                      movieData.poster_path
                    ),
                  }
                : require("../../assets/images/defaultmovies.png")
            }
            style={styles.poster}
          />
        </View>
        <MovieInfoCard
          title={movieData?.title}
          duration={movieData?.duration}
          rating={movieData?.rating}
          voteCount={movieData?.voteCount}
          genres={movieData?.genres}
        />
        <PlotSummaryCard summary={movieData?.summary} />
        {cast.length > 0 && <CastCard cast={cast} />}
        <RecommendedMoviesCard movies={similarMovies} navigation={navigation} />
        <TouchableOpacity
          style={styles.selectSeatsButton}
          onPress={() => {
            if (movieData) {
              navigation.navigate("SeatBooking", {
                movieId: movieId,
                movieData: {
                  ...movieData,
                  image: movieData.poster_path
                    ? baseImagePath(
                        IMAGE_SIZES.POSTER.LARGE,
                        movieData.poster_path
                      )
                    : null,
                  poster_path: movieData.poster_path,
                },
              });
            } else {
              Alert.alert("Error", "Movie data not available");
            }
          }}
        >
          <Text style={styles.selectSeatsText}>Select Seats</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FFB800",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginTop: StatusBar.currentHeight,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  posterContainer: {
    height: 400,
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  ratingText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 16,
  },
  voteCount: {
    color: "#9CA3AF",
    fontSize: 14,
    marginLeft: 4,
  },
  durationBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    color: "#9CA3AF",
    marginLeft: 4,
    fontSize: 14,
  },
  genreScroll: {
    flexGrow: 0,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  genreText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  plotContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  plotText: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
  },
  recommendedContainer: {
    padding: 16,
  },
  recommendedCard: {
    width: 120,
    marginRight: 16,
  },
  recommendedPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  recommendedRatingText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 14,
  },
  recommendedTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  selectSeatsButton: {
    margin: 30,
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  selectSeatsText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MovieDetailScreen;