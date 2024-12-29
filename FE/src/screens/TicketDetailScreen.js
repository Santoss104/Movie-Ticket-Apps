import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import { baseImagePath, IMAGE_SIZES } from "../api/apicalls";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const TicketDetailScreen = ({ navigation, route }) => {
  const { ticket } = route.params;

  const handleBackPress = () => {
    navigation.navigate("Main", { screen: "Ticket" });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.contentContainer}>
          <View style={styles.ticketCard}>
            <View style={styles.movieSection}>
              <Image
                source={
                  ticket.image
                    ? { uri: ticket.image }
                    : ticket.poster_path
                    ? {
                        uri: baseImagePath(
                          IMAGE_SIZES.POSTER.MEDIUM,
                          ticket.poster_path
                        ),
                      }
                    : require("../../assets/images/defaultmovies.png")
                }
                style={styles.moviePoster}
              />
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>16+</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>ENG</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>SUB/Indonesia</Text>
                  </View>
                </View>
                <Text style={styles.genre}>
                  {Array.isArray(ticket.genres)
                    ? ticket.genres.join(" • ")
                    : "Action • Adventure • Fantasy"}
                </Text>
                <Text style={styles.duration}>{ticket.duration}</Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <DetailRow label="CINEMA" value={ticket.theater} />
              <DetailRow label="DATE" value={ticket.date} />
              <DetailRow label="TIME" value={ticket.time} />
              <DetailRow
                label="SEATS"
                value={ticket.seats.map((seat) => `G${seat}`).join(", ")}
              />
            </View>

            <View style={styles.barcodeSection}>
              <Image
                source={require("../../assets/images/barcode.png")}
                style={styles.barcode}
                resizeMode="cover"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => navigation.navigate("Main", { screen: "Ticket" })}
          >
            <Text style={styles.viewAllText}>View all Tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Back to my ticket</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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
  movieSection: {
    flexDirection: "row",
    marginBottom: 24,
  },
  moviePoster: {
    width: 100,
    height: 140,
    borderRadius: 12,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  genre: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 4,
  },
  duration: {
    color: "#666666",
    fontSize: 14,
  },
  detailsSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
  },
  detailValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  barcodeSection: {
    marginTop: 16,
    alignItems: "center",
  },
  barcode: {
    width: "100%",
    height: 80,
  },
  viewAllLink: {
    alignItems: "center",
    marginTop: 24,
  },
  viewAllText: {
    color: "#FFB800",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  backButton: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: CARD_WIDTH,
    marginTop: 24,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TicketDetailScreen;
