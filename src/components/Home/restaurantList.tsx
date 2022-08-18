import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo, RefreshControl} from 'react-native';
import RestaurantListItem from './restaurantListItem';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {FBRootState} from '../../redux/store';
import RestaurantListItemEmpty from './restaurantListItemEmpty';
import {useSelector} from 'react-redux';
import {newFilterRestaurants} from '../../utils/filterRestaurants';
import {FBGeoLocation} from '../../models/FBGeoLocation';

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

  const restaurants = useSelector((state: FBRootState) => {
    const r = newFilterRestaurants(
      state.restaurant.restaurant,
      state.restaurant.newFilters,
    );

    return r;
  });

  const renderItem = (item: ListRenderItemInfo<RestaurantHomeListItem>) => {
    return <RestaurantListItem
      restaurant={item.item}
      isFullscreen={isFullScreen}
      userLocation={userLocation}
    />;
  };

  const onRefresh = () => {
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
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.listIndex.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  }
};

export default RestaurantList;
