import React, {useState} from 'react';
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

export interface RestaurantSearchProps {
  toHide: boolean;
}

const RestaurantSearch = ({toHide}: RestaurantSearchProps) => {
  const userSearch = useSelector((state: FBRootState) => state.restaurantState.filters.search);
  const [userInput, setUserInput] = useState<string>(userSearch.userInput);

  const [suggestionsList, setSuggestionsList] = useState<RestaurantHomeListItem[]>([]);

  const styles = styleCreator({});
  const intl = useIntl();
  const dispatch = useDispatch();

  // TODO: zoom to location after user clicks
  // TODO: zoom out on cancel search
  
  const restaurants = useSelector((state: FBRootState) => state.restaurantState.filteredRestaurants);

  if (toHide) {
    return null;
  }

  const filterRestaurant = (userInputQuery: string) => {
    userInputQuery = userInputQuery.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    setUserInput(userInputQuery);

    let searchQueryRegex: null | string = null;
    if (!userInputQuery) {
      setSuggestionsList([]);
    } else {
      searchQueryRegex = `${userInputQuery}`;
      console.log('searchQueryRegex', searchQueryRegex, restaurants.length);
      const suggestions = filter(restaurants, r => r.name.search(new RegExp(searchQueryRegex!, 'i')) >= 0);

      setSuggestionsList(suggestions);
    }

    dispatch(restaurantUpdateFiltersAction({
      filterCategory: 'search',
      filterCategoryProperty: 'searchTerm',
      newValue: searchQueryRegex,
    }));
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
          onChangeText={i => filterRestaurant(i)}
          flatListProps={{
            keyboardShouldPersistTaps: 'handled',
            keyExtractor: (r: RestaurantHomeListItem) => r.listIndex.toString(),
            renderItem: (item: ListRenderItemInfo<RestaurantHomeListItem>) => (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setUserInput(item.item.name);

                  dispatch(restaurantUpdateFiltersAction({
                    filterCategory: 'search',
                    filterCategoryProperty: 'searchTerm',
                    newValue: item.item.name,
                  }));
                  dispatch(restaurantUpdateFiltersAction({
                    filterCategory: 'search',
                    filterCategoryProperty: 'userInput',
                    newValue: item.item.name,
                  }));
                }}>
                <Text style={styles.autocompleteOptionText}>{item.item.name}</Text>
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
          // hideResults={toHideResults}
        />
      </View>
      <TouchableOpacity
        style={styles.autocompleteCloseButton}
        onPress={() => {
          Keyboard.dismiss();
          filterRestaurant('');
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
    top: 30,
    elevation: 0,
  },
});
