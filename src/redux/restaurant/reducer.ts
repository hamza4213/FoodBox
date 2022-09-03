import {
  RESTAURANT_DISTANCE_UPDATE,
  RESTAURANT_FETCH,
  RESTAURANT_SORT,
  RESTAURANT_UPDATE_FILTERS,
  RESTAURANT_UPDATE_QUANTITY,
  RestaurantAction,
  RestaurantDistanceUpdateAction,
  RestaurantFetchAction,
  RestaurantSortAction,
  RestaurantUpdateFiltersAction,
  RestaurantUpdateQuantityAction,
} from './actions';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {DietType, FoodType} from '../../models/FoodBox';
import {orderBy, set} from 'lodash';
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

export interface RestaurantFilters {
  active: {
    activeOffers: boolean;
  },
  primary: {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  },
  secondary: {
    5: boolean;
    6: boolean;
  },
  time: {
    timeInterval: number[]
  }
}

export interface RestaurantState {
  restaurant: RestaurantHomeListItem[],
  filters: RestaurantFilters,
  newFilters: FBRestaurantFilters
}

export const restaurantInitialState: RestaurantState = {
  restaurant: [],
  filters: {
    active: {
      activeOffers: true,
    },
    primary: {
      2: false,
      3: false,
      1: false,
      4: false,
    },
    secondary: {
      6: false,
      5: false,
    },
    time: {
      timeInterval: [0.0, 24.0],
    },
  },
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
};

const handleRestaurantUpdateQuantityAction = (state: RestaurantState, data: RestaurantUpdateQuantityAction['data']): RestaurantState => {
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

const handleRestaurantDistanceUpdateAction = (state: RestaurantState, data: RestaurantDistanceUpdateAction['data']): RestaurantState => {
  
  const restaurants = state.restaurant.map(restaurant => {
    return {
      ...restaurant,
      distance: getDistanceToLocation({
        userLocation: data.userLocation,
        location: {latitude: restaurant.latitude, longitude: restaurant.longitude},
      }),
    };
  });

  return {
    ...state,
    restaurant: restaurants,
  };
};

const handleRestaurantFetchAction = (state: RestaurantState, data: RestaurantFetchAction['data']): RestaurantState => {
  return {
    ...state,
    restaurant: data.restaurants,
  };
};

const handleRestaurantUpdateFiltersAction = (state: RestaurantState, data: RestaurantUpdateFiltersAction['data']): RestaurantState => {
  set(state, `newFilters.${data.filterCategory}.${data.filterCategoryProperty}`, data.newValue);
  return {
    ...state,
  };
};

const handleRestaurantSortAction = (state: RestaurantState, data: RestaurantSortAction['data']): RestaurantState => {
  let restaurants = [...state.restaurant];
  restaurants = orderBy(restaurants, data.sortOption.id, 'asc');

  return {
    ...state,
    restaurant: restaurants,
  };
};


const restaurantReducer = (
  state: RestaurantState = restaurantInitialState,
  action: RestaurantAction,
): RestaurantState => {
  switch (action.type) {
    case RESTAURANT_UPDATE_QUANTITY: {
      return handleRestaurantUpdateQuantityAction(state, action.data);
    }
    case RESTAURANT_DISTANCE_UPDATE: {
      return handleRestaurantDistanceUpdateAction(state, action.data);
    }
    case RESTAURANT_FETCH: {
      return handleRestaurantFetchAction(state, action.data);
    }
    case RESTAURANT_SORT: {
      return handleRestaurantSortAction(state, action.data);
    }
    case RESTAURANT_UPDATE_FILTERS:
      return handleRestaurantUpdateFiltersAction(state, action.data);
    default: {
      return state;
    }
  }
};

export default restaurantReducer;
