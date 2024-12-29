import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../context/ProfileContext";

const AddCardModal = React.memo(
  ({ isVisible, onClose, cardData, onCardInputChange, onAddCard }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>Add New Card</Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: 8,
                }}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.form}>
              <Text style={modalStyles.label}>CARDHOLDER NAME</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Cardholder Name"
                placeholderTextColor="#9CA3AF"
                value={cardData.cardholderName}
                onChangeText={(text) =>
                  onCardInputChange("cardholderName", text)
                }
              />

              <Text style={modalStyles.label}>CARD NUMBER</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="**** **** **** ****"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={cardData.cardNumber}
                onChangeText={(text) => {
                  const formatted = text
                    .replace(/\s/g, "")
                    .replace(/(\d{4})/g, "$1 ")
                    .trim();
                  onCardInputChange("cardNumber", formatted);
                }}
                maxLength={19}
              />

              <View style={modalStyles.row}>
                <View style={modalStyles.halfWidth}>
                  <Text style={modalStyles.label}>VALID DATE</Text>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={cardData.validDate}
                    onChangeText={(text) => {
                      if (
                        text.length === 2 &&
                        cardData.validDate.length === 1
                      ) {
                        text += "/";
                      }
                      onCardInputChange("validDate", text);
                    }}
                    maxLength={5}
                  />
                </View>
                <View style={modalStyles.halfWidth}>
                  <Text style={modalStyles.label}>CVV</Text>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="***"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    secureTextEntry
                    value={cardData.cvv}
                    onChangeText={(text) => onCardInputChange("cvv", text)}
                    maxLength={3}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={modalStyles.addButton} onPress={onAddCard}>
              <Text style={modalStyles.addButtonText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

const ConfirmModal = React.memo(
  ({ isVisible, onClose, selectedPayment, bookingData, onConfirm }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={modalStyles.centeredView}>
          <View style={[modalStyles.modalView, { paddingVertical: 24 }]}>
            <Text
              style={[
                modalStyles.modalTitle,
                { textAlign: "center", marginBottom: 16 },
              ]}
            >
              Confirm Transaction
            </Text>

            <View style={styles.transactionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SERVICE</Text>
                <Text style={styles.detailValue}>Theater Booking</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PAYMENT</Text>
                <Text style={styles.detailValue}>
                  {selectedPayment.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>TOTAL</Text>
                <Text style={styles.detailValue}>{bookingData.total}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity
                style={[
                  modalStyles.addButton,
                  { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" },
                ]}
                onPress={onClose}
              >
                <Text style={[modalStyles.addButtonText, { color: "white" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.addButton, { flex: 1 }]}
                onPress={onConfirm}
              >
                <Text style={modalStyles.addButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const PaymentOption = React.memo(
  ({ icon, title, value, selectedPayment, onSelect }) => (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selectedPayment === value && styles.selectedPayment,
      ]}
      onPress={() => onSelect(value)}
    >
      <View style={styles.paymentIconContainer}>
        <Ionicons
          name={icon}
          size={24}
          color={selectedPayment === value ? "#FFB800" : "#9CA3AF"}
        />
        <Text
          style={[
            styles.paymentText,
            selectedPayment === value && styles.selectedPaymentText,
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedPayment === value && styles.radioButtonSelected,
        ]}
      />
    </TouchableOpacity>
  )
);

const CheckoutScreen = ({ navigation, route }) => {
  const { bookingData } = route.params;
  const { profile, loading } = useProfile();
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    validDate: "",
    cvv: "",
  });
  const [savedCards, setSavedCards] = useState([]);

  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleConfirm = useCallback(() => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    setIsConfirmModalVisible(true);
  }, [customerInfo]);

  const handleCardInputChange = useCallback((field, value) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAddCard = useCallback(() => {
    if (
      !cardData.cardholderName ||
      !cardData.cardNumber ||
      !cardData.validDate ||
      !cardData.cvv
    ) {
      Alert.alert("Error", "Please fill in all card details");
      return;
    }

    if (cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Error", "Card number must be 16 digits");
      return;
    }

    const validDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!validDateRegex.test(cardData.validDate)) {
      Alert.alert("Error", "Invalid date format. Use MM/YY");
      return;
    }

    if (cardData.cvv.length !== 3) {
      Alert.alert("Error", "CVV must be 3 digits");
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      ...cardData,
      cardNumber: cardData.cardNumber.replace(/(\d{4})/g, "$1 ").trim(),
    };

    setSavedCards((prev) => [...prev, newCard]);
    setCardData({
      cardholderName: "",
      cardNumber: "",
      validDate: "",
      cvv: "",
    });
    setIsCardModalVisible(false);
    Alert.alert("Success", "New card has been added successfully");
  }, [cardData]);

  const handleConfirmTransaction = useCallback(() => {
    setIsConfirmModalVisible(false);
    navigation.navigate("Confirmation", {
      bookingData,
      customerInfo,
      paymentMethod: selectedPayment,
    });
  }, [bookingData, customerInfo, selectedPayment, navigation]);

  const handlePaymentSelect = useCallback((value) => {
    setSelectedPayment(value);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/screenBG.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check Out</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer information</Text>
          {loading ? (
            <Text style={styles.loadingText}>
              Loading profile information...
            </Text>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={customerInfo.name}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, name: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PHONE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={customerInfo.phone}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, phone: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  value={customerInfo.email}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, email: text })
                  }
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select payment method</Text>
          <View style={styles.paymentOptions}>
            <PaymentOption
              icon="card-outline"
              title="Card"
              value="card"
              selectedPayment={selectedPayment}
              onSelect={handlePaymentSelect}
            />
            <PaymentOption
              icon="business-outline"
              title="BRI"
              value="bri"
              selectedPayment={selectedPayment}
              onSelect={handlePaymentSelect}
            />
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => setIsCardModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addCardText}>Add new card</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction</Text>
          <View style={styles.transactionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SERVICE</Text>
              <Text style={styles.detailValue}>Theater Booking</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>RESERVE CODE</Text>
              <Text style={styles.detailValue}>MV/1002312</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>TOTAL</Text>
              <Text style={styles.detailValue}>{bookingData.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>

      <AddCardModal
        isVisible={isCardModalVisible}
        onClose={() => setIsCardModalVisible(false)}
        cardData={cardData}
        onCardInputChange={handleCardInputChange}
        onAddCard={handleAddCard}
      />

      <ConfirmModal
        isVisible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        selectedPayment={selectedPayment}
        bookingData={bookingData}
        onConfirm={handleConfirmTransaction}
      />
    </ImageBackground>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#1F1F1F",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginTop: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#FFB800",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  addButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  selectedPayment: {
    backgroundColor: "rgba(255, 184, 0, 0.1)",
    borderColor: "#FFB800",
    borderWidth: 1,
  },
  paymentIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  selectedPaymentText: {
    color: "#FFB800",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9CA3AF",
  },
  radioButtonSelected: {
    borderColor: "#FFB800",
    backgroundColor: "#FFB800",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  addCardText: {
    color: "white",
    fontSize: 16,
  },
  transactionDetails: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  detailValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#FFB800",
    margin: 26,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default CheckoutScreen;