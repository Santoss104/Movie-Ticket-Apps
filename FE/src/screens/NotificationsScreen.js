import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTickets } from "../context/TicketContext";

const NotificationsScreen = ({ navigation }) => {
  const { tickets } = useTickets();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Generate notifications based on tickets
    const ticketNotifications = tickets.map((ticket, index) => ({
      id: `ticket-${Date.now()}-${index}`,
      title: "Booking Successful",
      description: `Your ticket for ${ticket.movieTitle} has been booked successfully!`,
      time: "Now",
      icon: "checkmark-circle",
      isNew: true,
      timestamp: Date.now(),
    }));

    // Add default notifications
    const defaultNotifications = [
      {
        id: "cashback-1",
        title: "Cashback",
        description: "You've got a cashback for the past ticket booking.",
        time: "30m",
        icon: "gift",
        isNew: true,
        timestamp: Date.now() - 1800000,
      },
      {
        id: "reminder-1",
        title: "Reminder",
        description: "Movie is starting in 12:00",
        time: "1h",
        icon: "time",
        isNew: true,
        timestamp: Date.now() - 3600000,
      },
    ];

    const allNotifications = [
      ...ticketNotifications,
      ...defaultNotifications,
    ].sort((a, b) => b.timestamp - a.timestamp);

    const updatedNotifications = allNotifications.map((notification) => ({
      ...notification,
      time: getTimeDisplay(notification.timestamp),
    }));

    setNotifications(updatedNotifications);
  }, [tickets]);

  const getTimeDisplay = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const markAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isNew: false }
          : notification
      )
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {notifications.some((n) => n.isNew) && (
            <View style={styles.newNotificationsBadge} />
          )}
        </View>

        <ScrollView style={styles.notificationList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.7}
            >
              {notification.isNew && <View style={styles.newIndicator} />}

              <View style={styles.notificationIconContainer}>
                <Ionicons name={notification.icon} size={24} color="#FFB800" />
              </View>

              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
              </View>

              <Text style={styles.notificationTime}>{notification.time}</Text>
            </TouchableOpacity>
          ))}

          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#9E9E9E"
              />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
    position: "relative",
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
  newNotificationsBadge: {
    position: "absolute",
    right: 16,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB800",
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: "relative",
  },
  newIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB800",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 24,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  notificationTime: {
    fontSize: 14,
    color: "#9E9E9E",
    alignSelf: "flex-start",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateText: {
    color: "#9E9E9E",
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationsScreen;