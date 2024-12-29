import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategoryList = ({
  categories = ["Now Playing", "Upcoming", "Popular"],
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => setSelectedCategory(category)}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  categoryButton: {
    marginRight: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    color: "#666",
    fontSize: 16,
  },
  selectedCategory: {
    borderBottomWidth: 0,
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "600",
  },
});

export default CategoryList;