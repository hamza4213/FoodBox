import React, {useEffect, useState} from 'react';
import {Image, Keyboard, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Utils} from '../../utils';
import Autocomplete from 'react-native-autocomplete-input';
import {FBRootState} from '../../redux/store';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {restaurantUpdateFiltersAction} from '../../redux/restaurant/actions';
import {filter} from 'lodash';
import {COLORS} from '../../constants';

export interface RestaurantSearchProps {
  toHide: boolean;
}

const RestaurantSearch = ({toHide}: RestaurantSearchProps) => {
  const restaurants = useSelector((state: FBRootState) => state.restaurantState.filteredRestaurants);
  const userInput = useSelector((state: FBRootState) => state.restaurantState.filters.search.userInput);
  
  const [suggestionsList, setSuggestionsList] = useState<RestaurantHomeListItem[]>([]);

  const styles = styleCreator({});
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(()=> {
    setSuggestionsList(restaurants);
  }, [restaurants]);

  if (toHide) {
    return null;
  }

  const searchRestaurants = (userInputQuery: string) => {
    userInputQuery = userInputQuery.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    
    dispatch(restaurantUpdateFiltersAction({
      filterCategory: 'search',
      filterCategoryProperty: 'userInput',
      newValue: userInputQuery,
    }));
  };

  return (
    <View style={styles.mainWrapper}>
      <View
        style={styles.autocompleteWrapper}>
        <Autocomplete
          data={suggestionsList}
          value={userInput}
          onChangeText={i => searchRestaurants(i)}
          flatListProps={{
            keyboardShouldPersistTaps: 'handled',
            keyExtractor: (r: RestaurantHomeListItem) => r.listIndex.toString(),
            renderItem: (item: ListRenderItemInfo<RestaurantHomeListItem>) => (
              <TouchableOpacity
                style={styles.autocompleteOptionText}
                onPress={() => {
                  Keyboard.dismiss();
                  
                  dispatch(restaurantUpdateFiltersAction({
                    filterCategory: 'search',
                    filterCategoryProperty: 'userInput',
                    newValue: item.item.name,
                  }));
                }}
              >
                <View style={{flexGrow: 1, flexDirection: 'row'}}>
                  <Text style={{flex: 1, width: 1, color: '#29455f'}}>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: '#29455f',
                    }}>{item.item.boxes[0].name}</Text>
                    <Text>{` ${translateText(intl, 'order.from')} `}</Text>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: '#29455f',
                    }}>{item.item.name}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ),
          }}
          placeholder={translateText(intl, 'home.find_object')}
          placeholderTextColor="grey"
          inputContainerStyle={styles.autocompleteInputWrapper}
          renderTextInput={(props: any) =>
            <TextInput
              {...props}
              style={styles.autocompleteInput}
            />
          }
          hideResults={!userInput}
        />
      </View>
      <TouchableOpacity
        style={[styles.autocompleteCloseButton]}
        onPress={() => {
          Keyboard.dismiss();
          searchRestaurants('');
        }}>
        <Image source={require('../../../assets/images/app_close_icon.png')}/>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantSearch;

const styleCreator = ({}: {}) => StyleSheet.create({
  mainWrapper: {flexDirection: 'row'},
  autocompleteWrapper: {
    position: 'absolute',
    top: 10,
    width: Utils.width - 20,
    left: 10,
  },
  autocompleteInputWrapper: {
    borderColor: '#fff',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowOffset: {height: 3, width: 0},
    elevation: 0,
  },
  autocompleteInput: {
    height: 40,
    color: '#000',
  },
  autocompleteOptionText: {
    fontSize: 15,
    padding: 10,
    margin: 2,
    borderRadius: 5,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  autocompleteCloseButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    elevation: 0,
    padding: 7
  },
});
