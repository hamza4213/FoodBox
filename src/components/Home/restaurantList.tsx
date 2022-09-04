import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import RestaurantListItem from './restaurantListItem';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {FBRootState} from '../../redux/store';
import RestaurantListItemEmpty from './restaurantListItemEmpty';
import {useDispatch, useSelector} from 'react-redux';
import {newFilterRestaurants} from '../../utils/filterRestaurants';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
import {COLORS} from '../../constants';
import {RESTAURANT_SORT_OPTION, RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION} from '../../redux/restaurant/reducer';
import {updateRestaurantSortOrderAction} from '../../redux/restaurant/actions';
import {useFbLoading} from '../../providers/FBLoaderProvider';

export interface RestaurantListProps {
  isFullScreen: boolean,
  userLocation: FBGeoLocation,
  onRefreshTriggered: () => any
}

const RestaurantList = ({
                          isFullScreen,
                          userLocation,
                          onRefreshTriggered,
                        }: RestaurantListProps) => {

  const [isRefreshing, setIsRefreshing] = useState(false);
  const intl = useIntl();
  const {showLoading, hideLoading} = useFbLoading();
  const dispatch = useDispatch();
  const [rerenderRestaurantsList, setRerenderRestaurantsList] = useState(false);
  const sortOrder = useSelector((state: FBRootState) => state.restaurant.sortOrder);
  const restaurants = useSelector((state: FBRootState) => {
    return state.restaurant.restaurant
    
    // const r = newFilterRestaurants(
    //   state.restaurant.restaurant,
    //   state.restaurant.newFilters,
    // );
    //
    // return r;
  });

  useEffect(() => {
    if (restaurants.length) {
      showLoading('sortingRestaurants');
      restaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[sortOrder]);
      setRerenderRestaurantsList(r => !r);
      hideLoading('sortingRestaurants');
    }
  }, [sortOrder, restaurants, showLoading, hideLoading]);
  
  
  
  const renderRestaurantItem = (item: ListRenderItemInfo<RestaurantHomeListItem>) => {
    return <RestaurantListItem
      restaurant={item.item}
      isFullscreen={isFullScreen}
      userLocation={userLocation}
    />;
  };

  const renderSortOptionListItem = (item: ListRenderItemInfo<RESTAURANT_SORT_OPTION>) => {
    const sortOption = item.item;
    const isSelected = sortOption === sortOrder;
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 2,
          marginVertical: 10,
          shadowColor: 'rgba(0,0,0, .4)', // IOS
          shadowOffset: {height: 1, width: 1}, // IOS
          shadowOpacity: 1, // IOS
          shadowRadius: 1, //IOS
          elevation: 2, // Android
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 20,
          backgroundColor: isSelected ? '#0bd53a' : '#fff',
        }}
        onPress={() => {
          console.log('sortOPtion clicked', sortOption);
          dispatch(updateRestaurantSortOrderAction({sortOrder: sortOption}));
        }}
      >
        <Text style={{
          fontSize: 10,
          color: isSelected ? '#fff' : '#000',
        }}>
          {translateText(intl, `sort.${sortOption}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRestaurantListRefresh = () => {
    setIsRefreshing(true);
    onRefreshTriggered();
    setIsRefreshing(false);
  };

  if (restaurants.length === 0) {
    return (
      <RestaurantListItemEmpty/>
    );
  } else {
    return (
      <View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>

          <TouchableOpacity
            style={{
              marginHorizontal: 2,
              marginVertical: 10,
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS
              elevation: 2, // Android
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 20,
              backgroundColor: COLORS.red,
            }}
            onPress={() => {
              console.log('refresh list');
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
            }}
            >
              {translateText(intl, 'home.refresh')}
            </Text>
          </TouchableOpacity>

          <View>
            <FlatList
              data={Object.values(RESTAURANT_SORT_OPTION)}
              horizontal
              keyExtractor={(item) => item}
              renderItem={renderSortOptionListItem}
            />
          </View>


        </View>

        <FlatList
          data={restaurants}
          extraData={rerenderRestaurantsList}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.listIndex.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRestaurantListRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
};

export default RestaurantList;


