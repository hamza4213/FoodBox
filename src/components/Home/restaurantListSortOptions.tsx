import React, {useEffect, useState} from "react";
import RestaurantListSortButton from "./restaurantListSortButton";
import {FlatList, ListRenderItemInfo, View} from "react-native";
import {useDispatch} from "react-redux";
import {restaurantSortAction} from "../../redux/restaurant/actions";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

export interface RestaurantListSortOption {
  id: string;
  name: string
}

export interface RestaurantListSortProps {}

const RestaurantListSortOptions = ({}: RestaurantListSortProps) => {

  const dispatch = useDispatch();
  const [selectedSortOption, setSelectedSortOption] = useState('');
  
  const intl = useIntl();

  const availableSortingOptions: RestaurantListSortOption[] = [
    {
      id: 'priceAfaterDiscount',
      name: `${translateText(intl,'sort.lowest_price_first')}`,
    },
    {
      id: 'distance',
      name: `${translateText(intl,'sort.closest_first')}`,
    },
    {
      id: 'openTime',
      name: `${translateText(intl,'sort.starting_soonest_first')}`,
    },
    {
      id: 'closeTime',
      name: `${translateText(intl,'sort.closing_soonest_first')}`,
    },
  ];

  const defaultSortingOption = availableSortingOptions[1];

  const onSelectSortOption = (sortOption: RestaurantListSortOption) => {
    dispatch(restaurantSortAction({sortOption: sortOption}));
    
    // set selectedSortOption
    setSelectedSortOption(sortOption.id);
  }
  
  useEffect(() => {
    onSelectSortOption(defaultSortingOption);
  }, [])
  
  
  const renderItem = (item: ListRenderItemInfo<RestaurantListSortOption>) => {
    const isSelected = item.item.id === selectedSortOption;
    return (
      <RestaurantListSortButton 
        sortOption={item.item} 
        isSelected={isSelected} 
        onSelect={onSelectSortOption} 
      />
    )
  };
  
  return (
    <View>
      <FlatList
        data={availableSortingOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
  
}

export default RestaurantListSortOptions;
