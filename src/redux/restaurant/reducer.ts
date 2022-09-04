import {
  RestaurantAction,
  RestaurantActionType,
  RestaurantDistanceUpdateAction,
  RestaurantFetchAction,
  RestaurantUpdateFiltersAction,
  RestaurantUpdateQuantityAction,
  UpdateRestaurantSortOrderAction,
} from './actions';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {DietType, FoodType} from '../../models/FoodBox';
import {set} from 'lodash';
import getDistanceToLocation from '../../utils/getDistanceToLocation';

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
  (r1: RestaurantHomeListItem, r2: RestaurantHomeListItem): number
}

export const RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION: {[key in RESTAURANT_SORT_OPTION]: RestaurantSortFunction} = {
  [RESTAURANT_SORT_OPTION.LOWEST_PRICE_FIRST]: (r1, r2) => r1.priceAfaterDiscount - r2.priceAfaterDiscount,
  [RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST]: (r1, r2) => r1.distance - r2.distance,
  [RESTAURANT_SORT_OPTION.STARTING_SOONEST_FIRST]: (r1, r2) => r1.openTime - r2.openTime,
  [RESTAURANT_SORT_OPTION.CLOSING_SOONEST_FIRST]: (r1, r2) => r1.closeTime - r2.closeTime,
};

export interface RestaurantState {
  restaurant: RestaurantHomeListItem[],
  newFilters: FBRestaurantFilters,
  sortOrder: RESTAURANT_SORT_OPTION
}

export const restaurantInitialState: RestaurantState = {
  restaurant: [],
  newFilters: {
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
      isNotFinished: true,
    },
    canCheckout: {
      isEnabled: true,
      canCheckout: true,
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
};

interface RestaurantActionHandler {
  (state: RestaurantState, data: any): RestaurantState;
}

const handleRestaurantUpdateQuantityAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantUpdateQuantityAction['data']): RestaurantState => {
  let updatedBox;
  for (let restaurant of state.restaurant) {
    if (updatedBox) {
      break;
    }

    if (restaurant.id === data.restaurantId) {

      for (let box of restaurant.products) {
        if (updatedBox) {
          break;
        }

        if (box.id === data.boxId) {
          updatedBox = box;
        }
      }
    }
  }

  if (updatedBox) {
    updatedBox.quantity += data.quantityUpdate;
  }

  return {
    ...state,
    restaurant: state.restaurant,
  };
};

const handleUpdateRestaurantDistanceToUserAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantDistanceUpdateAction['data']): RestaurantState => {

  const restaurants = [];
  for (const restaurant of state.restaurant) {
    restaurant.distance = getDistanceToLocation({
      userLocation: data.userLocation,
      location: {latitude: restaurant.latitude, longitude: restaurant.longitude},
    });
    restaurants.push(restaurant);
  }

  return {
    ...state,
    restaurant: restaurants,
  };
};

const handleRestaurantFetchAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantFetchAction['data']): RestaurantState => {
  return {
    ...state,
    restaurant: data.restaurants,
  };
};

const handleRestaurantUpdateFiltersAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantUpdateFiltersAction['data']): RestaurantState => {
  set(state, `newFilters.${data.filterCategory}.${data.filterCategoryProperty}`, data.newValue);
  return {
    ...state,
  };
};

const handleUpdateRestaurantSortOrderAction: RestaurantActionHandler = (state: RestaurantState, data: UpdateRestaurantSortOrderAction['data']): RestaurantState => {
  return {
    ...state,
    sortOrder: data.sortOrder,
  };
};

const RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP: { [p in RestaurantActionType]: RestaurantActionHandler } = {
  [RestaurantActionType.RESTAURANT_UPDATE_QUANTITY]: handleRestaurantUpdateQuantityAction,
  [RestaurantActionType.UPDATE_RESTAURANT_DISTANCE_TO_USER]: handleUpdateRestaurantDistanceToUserAction,
  [RestaurantActionType.RESTAURANT_FETCH]: handleRestaurantFetchAction,
  [RestaurantActionType.RESTAURANT_UPDATE_FILTERS]: handleRestaurantUpdateFiltersAction,
  [RestaurantActionType.UPDATE_RESTAURANT_SORT_ORDER]: handleUpdateRestaurantSortOrderAction,
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
