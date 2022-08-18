import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {RestaurantListSortOption} from "./restaurantListSortOptions";

export interface RestaurantSortButtonProps {
  sortOption: RestaurantListSortOption;
  isSelected: boolean;
  onSelect: (filterOption: RestaurantListSortOption) => void;
}

const RestaurantListSortButton = ({
  sortOption,
  isSelected,
  onSelect,
}: RestaurantSortButtonProps) => {
  const styles = stylesCreator({isSelected: isSelected});
  
  return (
    <TouchableOpacity
      style={styles.sortButton}
      key={sortOption.id}
      onPress={() => onSelect(sortOption)}
    >
      <Text style={styles.sortButtonText}>
        {sortOption.name}
      </Text>
    </TouchableOpacity>
  );
};

export default RestaurantListSortButton;

const stylesCreator = ( params: {
  isSelected: boolean
} ) => StyleSheet.create({
  sortButton: {
    marginHorizontal: 2,
    marginVertical: 10,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: params.isSelected ? "#0bd53a" : "#fff",
  },
  sortButtonText: {
    fontSize: 10,
    color: params.isSelected ? "#fff" : "#000",
  }
});
