import {RestaurantHomeListItem} from '../../models/Restaurant';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {RESTAURANT_SORT_OPTION} from './reducer';

export enum RestaurantActionType {
  RESTAURANT_UPDATE_FILTERS,
  RESTAURANT_FETCH,
  RESTAURANT_UPDATE_QUANTITY,
  UPDATE_RESTAURANT_DISTANCE_TO_USER,
  UPDATE_RESTAURANT_SORT_ORDER
}

export interface RestaurantAction {
  type: RestaurantActionType;
  data: any;
}

export interface RestaurantUpdateFiltersAction extends RestaurantAction {
  data: { filterCategory: string; filterCategoryProperty: string; newValue: any; };
}

export const restaurantUpdateFiltersAction = (params: RestaurantUpdateFiltersAction['data']): RestaurantUpdateFiltersAction => {
  return {
    type: RestaurantActionType.RESTAURANT_UPDATE_FILTERS,
    data: params,
  };
};

export interface RestaurantFetchAction extends RestaurantAction {
  data: { restaurants: RestaurantHomeListItem[] };
}

export const restaurantsFetchedAction = (params: RestaurantFetchAction['data']): RestaurantFetchAction => {
  return {
    type: RestaurantActionType.RESTAURANT_FETCH,
    data: params,
  };
};

export interface RestaurantUpdateQuantityAction extends RestaurantAction {
  data: { restaurantId: number; boxId: number; quantityUpdate: number };
}

export const restaurantUpdateQuantityAction = (params: RestaurantUpdateQuantityAction['data']): RestaurantUpdateQuantityAction => {
  return {
    type: RestaurantActionType.RESTAURANT_UPDATE_QUANTITY,
    data: params,
  };
};

export interface RestaurantDistanceUpdateAction extends RestaurantAction {
  data: { userLocation: FBGeoLocation };
}

export const restaurantDistanceUpdateAction = (params: RestaurantDistanceUpdateAction['data']): RestaurantDistanceUpdateAction => {
  return {
    type: RestaurantActionType.UPDATE_RESTAURANT_DISTANCE_TO_USER,
    data: params,
  };
};

export interface UpdateRestaurantSortOrderAction extends RestaurantAction {
  data: { sortOrder: RESTAURANT_SORT_OPTION };
}

export const updateRestaurantSortOrderAction = (params: UpdateRestaurantSortOrderAction['data']): UpdateRestaurantSortOrderAction => {
  return {
    type: RestaurantActionType.UPDATE_RESTAURANT_SORT_ORDER,
    data: params,
  };
};
