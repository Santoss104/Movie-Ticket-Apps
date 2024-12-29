import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getMovieDetails,
  formatMovieData,
  baseImagePath,
  IMAGE_SIZES,
} from "../api/apicalls";

const SeatBookingScreen = ({ navigation, route }) => {
  const { movieId, movieData: initialMovieData } = route.params;
  const [selectedDate, setSelectedDate] = useState("03-01");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieData, setMovieData] = useState(initialMovieData || null);
  const [loading, setLoading] = useState(!initialMovieData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await getMovieDetails(movieId);
        const formattedData = formatMovieData(response, response);
        setMovieData(formattedData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        Alert.alert("Error", "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const dates = [
    { day: "Mon", date: "02-01" },
    { day: "Tue", date: "03-01" },
    { day: "Wed", date: "04-01" },
    { day: "Thu", date: "05-01" },
    { day: "Fri", date: "06-01" },
  ];

  const times = ["08:00", "10:00", "12:00", "14:00", "16:00"];

  const totalSeats = 40;
  const reservedSeats = [13, 14, 15, 25, 26, 27, 28, 29, 30, 31];

  const toggleSeatSelection = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < 2) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    const bookingData = {
      movieId: movieId,
      movieTitle: movieData?.title,
      poster_path: movieData?.poster_path,
      image: movieData?.image,
      genres: movieData?.genres,
      duration: movieData?.duration,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      totalPrice: selectedSeats.length * 40000,
      theater: "PEKANBARU XCHANGE XXI",
    };

    navigation.navigate("BookingTicket", { bookingData });
  };

  const renderSeats = () => {
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const isReserved = reservedSeats.includes(i);
      const isSelected = selectedSeats.includes(i);
      seats.push(
        <TouchableOpacity
          key={i}
          onPress={() => toggleSeatSelection(i)}
          style={[
            styles.seat,
            isReserved && styles.seatReserved,
            isSelected && styles.seatSelected,
          ]}
          disabled={isReserved}
        >
          <Ionicons
            name="square-outline"
            size={24}
            color={isSelected ? "#FFB800" : isReserved ? "#374151" : "#FFFFFF"}
          />
        </TouchableOpacity>
      );
    }
    return seats;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotalPrice = (numSeats, pricePerSeat = 40000) => {
    return numSeats * pricePerSeat;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Seats</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Content ScrollView */}
      <ScrollView style={styles.contentContainer}>
        {/* Movie Info */}
        {movieData && (
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{movieData.title}</Text>
          </View>
        )}

        {/* Theater Info */}
        <View style={styles.theaterInfo}>
          <Text style={styles.theaterName}>PEKANBARU XCHANGE XXI</Text>
          <Text style={styles.theaterAddress}>
            Mall Pekanbaru Xchange lantai 3, Jl. Riau No. 147
          </Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.dateSelection}>
            <TouchableOpacity style={styles.monthSelector}>
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.monthText}>Jan 2025</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dateButton,
                    selectedDate === item.date && styles.dateButtonSelected,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDate === item.date && styles.dateTextSelected,
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === item.date && styles.dateTextSelected,
                    ]}
                  >
                    {item.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeButtonSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Screen */}
        <View style={styles.screenContainer}>
          {movieData && (
            <Image
              source={{ uri: movieData.backdrop }}
              style={styles.screenImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Seats */}
        <View style={styles.seatsContainer}>
          <View style={styles.seatGrid}>{renderSeats()}</View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendReserved]} />
            <Text style={styles.legendText}>10 Reserved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendAvailable]} />
            <Text style={styles.legendText}>28 Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendSelected]} />
            <Text style={styles.legendText}>2 Selected</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Price and Booking Button */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {formatPrice(calculateTotalPrice(selectedSeats.length))}
            <Text style={styles.priceSubtext}>
              {" "}
              for {selectedSeats.length} tickets
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedSeats.length === 0 && styles.bookButtonDisabled,
          ]}
          disabled={selectedSeats.length === 0}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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
    marginLeft: 16,
  },
  changeText: {
    color: "#FFB800",
    fontSize: 16,
  },
  theaterInfo: {
    padding: 16,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  dateSelection: {
    gap: 12,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  monthText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginHorizontal: 12,
  },
  dateButton: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    padding: 12,
    borderRadius: 14,
    marginRight: 8,
    alignItems: "center",
    minWidth: 80,
  },
  dateButtonSelected: {
    backgroundColor: "#FFB800",
  },
  dayText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  dateTextSelected: {
    color: "#000000",
  },
  timeButton: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
  },
  timeButtonSelected: {
    backgroundColor: "#FFB800",
  },
  timeText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  timeTextSelected: {
    color: "#000000",
  },
  screenContainer: {
    padding: 16,
    alignItems: "center",
  },
  screenImage: {
    width: "100%",
    height: 100,
    borderRadius: 16,
  },
  seatsContainer: {
    padding: 16,
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  seat: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  seatReserved: {
    opacity: 0.5,
  },
  seatSelected: {
    transform: [{ scale: 1.1 }],
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(55, 65, 81, 0.5)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendReserved: {
    backgroundColor: "#374151",
  },
  legendAvailable: {
    backgroundColor: "#FFFFFF",
  },
  legendSelected: {
    backgroundColor: "#FFB800",
  },
  legendText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(55, 65, 81, 0.5)",
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  priceSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "normal",
  },
  bookButton: {
    backgroundColor: "#FFB800",
    padding: 16,
    marginBottom: "10",
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonDisabled: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
  },
  bookButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  movieTitle: {
    fontSize:"24",
    fontWeight:"bold",
    color:"white",
  },
});

export default SeatBookingScreen;