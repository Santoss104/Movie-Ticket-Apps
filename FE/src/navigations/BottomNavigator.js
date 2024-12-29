import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import MyTicketScreen from "../screens/MyTicketScreen";
import SearchScreen from "../screens/SearchScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

const Tab = createBottomTabNavigator();

const getIconName = (routeName, isFocused) => {
  switch (routeName) {
    case "Home":
      return isFocused ? "home" : "home-outline";
    case "Ticket":
      return isFocused ? "ticket" : "ticket-outline";
    case "Search":
      return isFocused ? "search" : "search-outline";
    case "Notification":
      return isFocused ? "notifications" : "notifications-outline";
    default:
      return "help-circle-outline";
  }
};

export default function BottomNavigator() {
  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Ticket" component={MyTicketScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Notification" component={NotificationsScreen} />
      </Tab.Navigator>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = getIconName(route.name, isFocused);

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Icon
              name={iconName}
              size={25}
              color={isFocused ? "#FFA500" : "#666"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: Dimensions.get("window").width / 2 - 32,
    backgroundColor: "#FFA500",
    borderRadius: 50,
    padding: 10,
  },
  tabBar: {
    height: 70,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
});