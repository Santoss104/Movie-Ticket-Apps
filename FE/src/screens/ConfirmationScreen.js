import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseImagePath, IMAGE_SIZES } from "../api/apicalls";
import { useTickets } from "../context/TicketContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const defaultMovieData = {
  movieTitle: "Movie Title",
  poster_path: null,
  genres: ["Genre"],
  duration: "2 hr 30min",
  theater: "Cinema",
  date: "Date",
  time: "Time",
  seats: [],
  total: 0,
  image: null,
};

const ConfirmationScreen = ({ navigation, route }) => {
  const { bookingData = {} } = route.params || {};
  const { addTicket } = useTickets();

  useEffect(() => {
    const ticketData = {
      movieTitle: bookingData.movieTitle,
      poster_path: bookingData.poster_path,
      image: bookingData.image,
      theater: bookingData.theater,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats,
      genres: bookingData.genres,
      duration: bookingData.duration,
      total: bookingData.total,
    };

    addTicket(ticketData);
  }, []);

  const handleHomePress = () => {
    navigation.navigate("Main", { screen: "Home" });
  };

  const movieData = { ...defaultMovieData, ...bookingData };

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.contentContainer}>
        <View style={styles.successIcon}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#000000" />
          </View>
        </View>

        <Text style={styles.successTitle}>Tickets Booked Successfully!</Text>

        <View style={styles.ticketCard}>
          <View style={styles.movieInfo}>
            <Image
              source={
                movieData.image
                  ? { uri: movieData.image }
                  : movieData.poster_path
                  ? {
                      uri: baseImagePath(
                        IMAGE_SIZES.POSTER.MEDIUM,
                        movieData.poster_path
                      ),
                    }
                  : require("../../assets/images/defaultmovies.png")
              }
              style={styles.moviePoster}
            />
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{movieData.movieTitle}</Text>
              <View style={styles.movieTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>16+</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>ENG</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>SUB/VIETNAMESE</Text>
                </View>
              </View>
              <Text style={styles.movieGenre}>
                {Array.isArray(movieData.genres)
                  ? movieData.genres.join(" • ")
                  : "Action • Adventure • Fantasy"}
              </Text>
              <Text style={styles.movieDuration}>{movieData.duration}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>CINEMA</Text>
              <Text style={styles.detailValue}>{movieData.theater}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DATE</Text>
              <Text style={styles.detailValue}>{movieData.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>TIME</Text>
              <Text style={styles.detailValue}>{movieData.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SEATS</Text>
              <Text style={styles.detailValue}>
                {movieData.seats.map((seat) => `G${seat}`).join(", ")}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.barcodeContainer}>
            <Image
              source={require("../../assets/images/barcode.png")}
              style={styles.barcode}
              resizeMode="contain"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.viewAllLink}>
          <Text
            style={styles.viewAllText}
            onPress={() => navigation.navigate("Main", { screen: "Ticket" })}
          >
            View all Tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFB800",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFB800",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFB800",
    marginBottom: 32,
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  movieInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  moviePoster: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  movieTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  movieGenre: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 4,
  },
  movieDuration: {
    color: "#666666",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  bookingDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#666666",
    fontSize: 14,
  },
  detailValue: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  barcodeContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  barcode: {
    width: "100%",
    height: 80,
  },
  viewAllLink: {
    marginTop: 24,
  },
  viewAllText: {
    color: "#FFB800",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  homeButton: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: CARD_WIDTH,
    marginTop: 24,
  },
  homeButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ConfirmationScreen;