import {Restaurant, RestaurantMapper} from "../models/Restaurant";
import axiosClient from "../network/axiosClient";
import {FBBaseError} from "../common/FBBaseError";
import {AuthData} from "../models/AuthData";

interface getRestaurantsWithProductResponse {
  success: boolean,
  restaurants: object[]
}

class RestaurantRepositoryError extends FBBaseError {}

export interface BaseRestaurantRepository {
  getAllWithProduct (): Promise<Restaurant[]>;
}

class RestaurantRepository implements BaseRestaurantRepository {
  private authData: AuthData;
  
  constructor(params: {
    authData: AuthData
  }) {
    this.authData = params.authData;
  }
  
  public async getAllWithProduct ( ): Promise<Restaurant[]> {
    const url = '/user/restaurants?getProducts=true';
    try {
      const response: getRestaurantsWithProductResponse = await axiosClient.get(url, {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      });

      const restaurants = response.restaurants.map((r: any) => RestaurantMapper.fromApi(r));
      
      return restaurants;
    } catch (e) {
      throw new RestaurantRepositoryError()
    }
  }
}

export {
  RestaurantRepositoryError,
  RestaurantRepository
}
