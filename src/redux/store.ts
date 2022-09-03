import {combineReducers} from 'redux';
import userReducer, {UserState} from './user/reducer';
import restaurantReducer, {RestaurantState} from './restaurant/reducer';
import ordersReducer, {OrdersState} from './order/reducer';

export interface FBRootState {
  user: UserState,
  restaurant: RestaurantState,
  orders: OrdersState
}

const allReducer = combineReducers<FBRootState>({
  user: userReducer,
  restaurant: restaurantReducer,
  orders: ordersReducer,
});

export default allReducer;
