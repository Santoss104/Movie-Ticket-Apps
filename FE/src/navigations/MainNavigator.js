import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomNavigator from "./BottomNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import { ProfileProvider } from "../context/ProfileContext";
import { TicketProvider } from "../context/TicketContext";
import EditProfileScreen from "../screens/EditProfileScreen";
import MovieDetailScreen from "./../screens/MovieDetailScreen";
import SeatBookingScreen from "../screens/SeatBookingScreen";
import BookingTicketScreen from "../screens/BookingTicketScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <ProfileProvider>
      <TicketProvider>
        {/* Tambahkan TicketProvider di sini */}
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          {/* Screens sebelum login */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* BottomNavigator sebagai root untuk semua screen utama */}
          <Stack.Screen name="Main" component={BottomNavigator} />
          {/* ProfileScreen sebagai layar terpisah */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          {/* EditProfileScreen */}
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          {/* MovieDetailScreen */}
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
          {/* SeatBookingScreen */}
          <Stack.Screen name="SeatBooking" component={SeatBookingScreen} />
          {/* BookingTicketScreen */}
          <Stack.Screen name="BookingTicket" component={BookingTicketScreen} />
          {/* Checkout Screen */}
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          {/* ConfirmationScreen */}
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
          {/* TicketDetailScreen */}
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        </Stack.Navigator>
      </TicketProvider>
    </ProfileProvider>
  );
}