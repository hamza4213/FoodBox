import {RestaurantHomeListItem} from "../../models/Restaurant";
import {RestaurantListSortOption} from "../../components/Home/restaurantListSortOptions";

export type RestaurantActionType = string;
export interface RestaurantAction {
  type: RestaurantActionType;
  data: any;
}

export const RESTAURANT_UPDATE_FILTERS: RestaurantActionType = 'UPDATE_FILTERS';
export interface RestaurantUpdateFiltersAction extends RestaurantAction {
  data: {filterCategory: string; filterCategoryProperty: string; newValue: any;} 
}
export const restaurantUpdateFiltersAction = (params: RestaurantUpdateFiltersAction['data']): RestaurantUpdateFiltersAction => {
  return {
    type: RESTAURANT_UPDATE_FILTERS,
    data: params
  }
}

export const RESTAURANT_SORT: RestaurantActionType = 'RESTAURANT_SORT';
export interface RestaurantSortAction extends RestaurantAction {
  data: {sortOption: RestaurantListSortOption}
}
export const restaurantSortAction = (params: RestaurantSortAction['data']): RestaurantSortAction => {
  return {
    type: RESTAURANT_SORT,
    data: params
  }
}


export const RESTAURANT_FETCH: RestaurantActionType = 'RESTAURANT_FETCHED';
export interface RestaurantFetchAction extends RestaurantAction {
  data: {restaurants : RestaurantHomeListItem[] }
}
export const restaurantsFetchedAction = (params: RestaurantFetchAction['data'] ): RestaurantFetchAction => {
  return {
    type: RESTAURANT_FETCH,
    data: params
  }
}


export const RESTAURANT_UPDATE_QUANTITY: RestaurantActionType = 'RESTAURANT_UPDATE_QUANTITY';
export interface RestaurantUpdateQuantityAction extends RestaurantAction { 
  data: {restaurantId: number; boxId: number; quantityUpdate: number}
}
export const restaurantUpdateQuantityAction = (params: RestaurantUpdateQuantityAction['data']): RestaurantUpdateQuantityAction => {
  return {
    type: RESTAURANT_UPDATE_QUANTITY,
    data: params
  }
}

export const RESTAURANT_DISTANCE_UPDATE:  RestaurantActionType = 'RESTAURANT_DISTANCE_UPDATE';
export interface RestaurantDistanceUpdateAction extends RestaurantAction {
  data: { restaurants : RestaurantHomeListItem[]}
}
export const restaurantDistanceUpdateAction = (params: RestaurantDistanceUpdateAction['data']) : RestaurantDistanceUpdateAction => {
  return {
    type: RESTAURANT_DISTANCE_UPDATE,
    data: params
  }
}


