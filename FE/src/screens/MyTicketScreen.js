import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseImagePath, IMAGE_SIZES } from "../api/apicalls";
import { useTickets } from "../context/TicketContext";

const { width } = Dimensions.get("window");

const MyTicketsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Current");
  const { getTicketsByStatus } = useTickets();
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const tickets = getTicketsByStatus(activeTab);
    setFilteredTickets(tickets);
  }, [activeTab, getTicketsByStatus]);

  const handleTicketPress = (ticket) => {
    navigation.navigate("TicketDetail", { ticket });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyText}>No {activeTab.toLowerCase()} tickets</Text>
    </View>
  );

  const renderTicketCard = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => handleTicketPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={
          item.image
            ? { uri: item.image }
            : item.poster_path
            ? {
                uri: baseImagePath(IMAGE_SIZES.POSTER.MEDIUM, item.poster_path),
              }
            : require("../../assets/images/defaultmovies.png")
        }
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.ticketInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.movieTitle}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#FFFFFF" />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.theater}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#FFFFFF" />
          <Text style={styles.infoText}>
            {item.time}
            <Text style={styles.seatText}>
              {"  •  "}
              {item.seats.length} {item.seats.length > 1 ? "seats" : "seat"}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.headerTitle}>My Tickets</Text>

        <View style={styles.tabContainer}>
          <TabButton
            title="Current"
            isActive={activeTab === "Current"}
            onPress={() => setActiveTab("Current")}
          />
          <TabButton
            title="Past"
            isActive={activeTab === "Past"}
            onPress={() => setActiveTab("Past")}
          />
        </View>

        <FlatList
          data={filteredTickets}
          renderItem={renderTicketCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ticketList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#000000",
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: "600",
  },
  ticketList: {
    padding: 16,
    paddingBottom: 32,
    minHeight: "100%",
  },
  ticketCard: {
    flexDirection: "row",
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moviePoster: {
    width: 120,
    height: 160,
  },
  ticketInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 8,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
  },
  seatText: {
    color: "#FFB800",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 16,
  },
});

export default MyTicketsScreen;