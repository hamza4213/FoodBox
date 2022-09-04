import {
  RestaurantAction,
  RestaurantActionType,
  RestaurantDistanceUpdateAction,
  RestaurantFetchAction,
  RestaurantUpdateFiltersAction,
  UpdateRestaurantSortOrderAction,
} from './actions';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {DietType, FoodType} from '../../models/FoodBox';
import getDistanceToLocation from '../../utils/getDistanceToLocation';
import {toShowRestaurant} from '../../utils/toShowRestaurant';

export interface FBRestaurantFilters {
  isRestaurantOpen: {
    isEnabled: boolean;
    isOpen: boolean;
  };
  hasRestaurantAvailableBoxes: {
    isEnabled: boolean;
    hasAvailableBoxes: boolean;
  };
  isNotFinished: {
    isEnabled: boolean;
    isNotFinished: boolean;
  };
  canCheckout: {
    isEnabled: boolean;
    canCheckout: boolean;
  };
  pickUpPeriod: {
    isEnabled: boolean;
    pickUpStartTimeLowerLimit: number;
    pickUpEndTimeUpperLimit: number;
  };
  foodType: {
    isEnabled: boolean;
    types: FoodType[];
  };
  dietType: {
    isEnabled: boolean;
    types: DietType[];
  };
  search: {
    isEnabled: boolean;
    searchTerm: string | null;
    userInput: string;
  };
}

export enum RESTAURANT_SORT_OPTION {
  LOWEST_PRICE_FIRST = 'lowest_price_first',
  CLOSEST_DISTANCE_FIRST = 'closest_distance_first',
  STARTING_SOONEST_FIRST = 'starting_soonest_first',
  CLOSING_SOONEST_FIRST = 'closing_soonest_first'
}

export interface RestaurantSortFunction {
  (r1: RestaurantHomeListItem, r2: RestaurantHomeListItem): number;
}

export const RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION: { [key in RESTAURANT_SORT_OPTION]: RestaurantSortFunction } = {
  [RESTAURANT_SORT_OPTION.LOWEST_PRICE_FIRST]: (r1, r2) => r1.priceAfaterDiscount - r2.priceAfaterDiscount,
  [RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST]: (r1, r2) => r1.distance - r2.distance,
  [RESTAURANT_SORT_OPTION.STARTING_SOONEST_FIRST]: (r1, r2) => r1.openTime - r2.openTime, // TODO: this should take into account current hour
  [RESTAURANT_SORT_OPTION.CLOSING_SOONEST_FIRST]: (r1, r2) => r1.closeTime - r2.closeTime,// TODO: this should take into account current hour
};

export interface RestaurantState {
  allRestaurants: RestaurantHomeListItem[],
  filters: FBRestaurantFilters,
  sortOrder: RESTAURANT_SORT_OPTION,
  filteredRestaurants: RestaurantHomeListItem[],
  controls: {
    isFetching: boolean,
  }
}

export const restaurantInitialState: RestaurantState = {
  controls: {
    isFetching: false,
  },
  allRestaurants: [],
  filters: {
    isRestaurantOpen: {
      isEnabled: true,
      isOpen: true,
    },
    hasRestaurantAvailableBoxes: {
      isEnabled: true,
      hasAvailableBoxes: true,
    },
    isNotFinished: {
      isEnabled: true,
      isNotFinished: false,
    },
    canCheckout: {
      isEnabled: true,
      canCheckout: false,
    },
    pickUpPeriod: {
      isEnabled: true,
      pickUpStartTimeLowerLimit: new Date(new Date().setHours(1, 0, 1)).getTime(),
      pickUpEndTimeUpperLimit: new Date(new Date().setHours(23, 59, 59)).getTime(),
    },
    foodType: {
      isEnabled: true,
      types: [FoodType.GROCERIES, FoodType.OTHERS, FoodType.MEALS, FoodType.PASTRIES],
    },
    dietType: {
      isEnabled: true,
      types: [],
    },
    search: {
      isEnabled: true,
      searchTerm: null,
      userInput: '',
    },
  },
  sortOrder: RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST,
  filteredRestaurants: [],
};

interface RestaurantActionHandler {
  (state: RestaurantState, data: any): RestaurantState;
}

const handleUpdateRestaurantDistanceToUserAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantDistanceUpdateAction['data']): RestaurantState => {

  const allRestaurants: RestaurantHomeListItem[] = [];
  const filteredRestaurants: RestaurantHomeListItem[] = [];
  
  // update distance to all restaurants
  for (const restaurant of state.allRestaurants) {
    restaurant.distance = getDistanceToLocation({
      userLocation: data.userLocation,
      location: {latitude: restaurant.latitude, longitude: restaurant.longitude},
    });
    allRestaurants.push(restaurant);
    
    if (toShowRestaurant(restaurant, state.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);

  return {
    ...state,
    allRestaurants: allRestaurants,
    filteredRestaurants: filteredRestaurants,
  };
};

const handleRestaurantFetchedAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantFetchAction['data']): RestaurantState => {

  const filteredRestaurants: RestaurantHomeListItem[] = [];

  for (const restaurant of data.restaurants) {
    if (toShowRestaurant(restaurant, state.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);

  return {
    ...state,
    allRestaurants: data.restaurants,
    filteredRestaurants: filteredRestaurants,
  };
};

const handleRestaurantUpdateFiltersAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantUpdateFiltersAction['data']): RestaurantState => {
  // update filters
  state.filters[data.filterCategory][data.filterCategoryProperty] = data.newValue;
  
  // find new filtered restaurants
  const filteredRestaurants: RestaurantHomeListItem[] = [];
  for (const restaurant of state.allRestaurants) {
    if (toShowRestaurant(restaurant, state.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  // sort them
  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);

  return {
    ...state,
    filteredRestaurants: filteredRestaurants,
  };
};

const handleUpdateRestaurantSortOrderAction: RestaurantActionHandler = (state, data: UpdateRestaurantSortOrderAction['data']): RestaurantState => {

  // resort restaurants
  const filteredRestaurants = [...state.filteredRestaurants];
  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);
  
  return {
    ...state,
    filteredRestaurants: filteredRestaurants,
    sortOrder: data.sortOrder,
  };
};

const handleRestaurantResetAction: RestaurantActionHandler = (state, _data: any) => {
  state.allRestaurants = [];
  state.filteredRestaurants = [];
  
  return {...state};
};

const RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP: { [p in RestaurantActionType]: RestaurantActionHandler } = {
  [RestaurantActionType.UPDATE_RESTAURANT_DISTANCE_TO_USER]: handleUpdateRestaurantDistanceToUserAction,
  [RestaurantActionType.RESTAURANT_FETCHED]: handleRestaurantFetchedAction,
  [RestaurantActionType.RESTAURANT_UPDATE_FILTERS]: handleRestaurantUpdateFiltersAction,
  [RestaurantActionType.UPDATE_RESTAURANT_SORT_ORDER]: handleUpdateRestaurantSortOrderAction,
  [RestaurantActionType.RESET]: handleRestaurantResetAction,
};

const restaurantReducer = (
  state: RestaurantState = restaurantInitialState,
  action: RestaurantAction,
): RestaurantState => {
  if (RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP[action.type]) {
    return RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP[action.type](state, action.data);
  }

  return state;
};

export default restaurantReducer;
