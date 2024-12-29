import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IMAGE_SIZES, baseImagePath } from "../api/apicalls";

const BookingTicketScreen = ({ navigation, route }) => {
  const { bookingData } = route.params;

  const subtotal = bookingData.totalPrice;
  const chargeFees = 2500 * bookingData.seats.length;
  const total = subtotal + chargeFees;

  const handleCheckout = () => {
    navigation.navigate("Checkout", { bookingData: { ...bookingData, total } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Movie Summary Card */}
        <View style={styles.summaryCard}>
          {/* Movie Info */}
          <View style={styles.movieInfo}>
            <Image
              source={{
                uri:
                  bookingData.image ||
                  (bookingData.poster_path &&
                    baseImagePath(
                      IMAGE_SIZES.POSTER.MEDIUM,
                      bookingData.poster_path
                    )),
              }}
              defaultSource={require("../../assets/images/defaultmovies.png")}
              style={styles.moviePoster}
            />
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{bookingData.movieTitle}</Text>
              <View style={styles.tagContainer}>
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
                {bookingData.genres?.join(" • ") ||
                  "Action • Adventure • Fantasy"}
              </Text>
              <Text style={styles.movieDuration}>
                {bookingData.duration || "2 hr 30min"}
              </Text>
            </View>
          </View>

          {/* Booking Details */}
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>CINEMA</Text>
              <Text style={styles.detailValue}>{bookingData.theater}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DATE</Text>
              <Text style={styles.detailValue}>{bookingData.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>TIME</Text>
              <Text style={styles.detailValue}>{bookingData.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SEATS</Text>
              <Text style={styles.detailValue}>
                {bookingData.seats.map((seat) => `G${seat}`).join(", ")}
              </Text>
            </View>
          </View>

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <Text style={styles.summaryTitle}>SUMMARY</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sub-total</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Charge fees</Text>
              <Text style={styles.priceValue}>
                {formatPrice(2500)} X{bookingData.seats.length}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        {/* Voucher Section */}
        <View style={styles.voucherSection}>
          <Text style={styles.voucherTitle}>VOUCHER</Text>
          <TouchableOpacity style={styles.gifCodeButton}>
            <Ionicons name="gift-outline" size={20} color="white" />
            <Text style={styles.gifCodeText}>Gif code</Text>
          </TouchableOpacity>

          {/* Voucher Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.voucherCard}>
              <Text style={styles.discountText}>Discount 30%</Text>
              <Text style={styles.voucherValidity}>
                Use Voucher{"\n"}Until: 23:59 13/01/2025
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.voucherCard}>
              <Text style={styles.discountText}>Discount 30%</Text>
              <Text style={styles.voucherValidity}>
                Use Voucher{"\n"}Until: 23:59 13/01/2025
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: StatusBar.currentHeight + 30,
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
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  movieInfo: {
    flexDirection: "row",
    marginBottom: 24,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  movieDetails: {
    marginLeft: 16,
    flex: 1,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  movieGenre: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 4,
  },
  movieDuration: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  detailValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  priceSummary: {
    paddingTop: 16,
    gap: 12,
  },
  summaryTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  priceValue: {
    color: "white",
    fontSize: 14,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  totalLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  voucherSection: {
    padding: 16,
  },
  voucherTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  gifCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 8,
    marginBottom: 16,
  },
  gifCodeText: {
    color: "white",
    fontSize: 14,
  },
  voucherCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
  },
  discountText: {
    color: "#FFB800",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  voucherValidity: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
  },
  checkoutButton: {
    backgroundColor: "#FFB800",
    margin: 26,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookingTicketScreen;