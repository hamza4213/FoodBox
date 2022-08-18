import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

export interface RestaurantListItemEmptyProps {}

const RestaurantListItemEmpty = ({}:RestaurantListItemEmptyProps) => {
  
  const intl = useIntl();
  const styles = stylesCreator()
  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.emptyMsg}>
        {translateText(intl,'restaurantslist.empty')}
      </Text>
    </View>
  )
}

export default RestaurantListItemEmpty;

const stylesCreator = () => StyleSheet.create({
  mainWrapper: {
    flex: 1
  },
  emptyMsg : {
    fontSize: 12, 
    color: 'grey', 
    fontWeight: '700'
  }
});
