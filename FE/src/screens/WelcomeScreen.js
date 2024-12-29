import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const welcomeScreens = [
    {
      id: "1",
      title: "Welcome to MoviePass",
      subtitle:
        "The best movie booking app of the century to make your days great!",
      image: require("../../assets/images/welcomeBG.png"),
    },
    {
      id: "2",
      title: "Find your movie",
      subtitle:
        "The best movie booking app of the century to make your days great!",
      image: require("../../assets/images/welcomeBG.png"),
    },
    {
      id: "3",
      title: "Book your tickets",
      subtitle:
        "The best movie booking app of the century to make your days great!",
      image: require("../../assets/images/welcomeBG.png"),
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Animated.Image
          source={item.image}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={slideRef}
        data={welcomeScreens}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        showsHorizontalScrollIndicator={false}
      />

      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.paginationContainer}>
          {welcomeScreens.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[styles.paginationDot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  slide: {
    width: width,
    height: height,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    position: "absolute",
    top: height * 0.65,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.8,
    lineHeight: 24,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff50",
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;