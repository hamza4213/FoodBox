import {BaseRestaurantRepository} from "../repositories/RestaurantRepository";
import {Restaurant, RestaurantHomeListItem} from "../models/Restaurant";
import {getDistance} from "geolib";
import moment from "moment";
import {FBGeoLocation} from "../models/FBGeoLocation";
import {FoodBox} from "../models/FoodBox";

class RestaurantService {
  restaurantRepository: BaseRestaurantRepository;
  
  constructor(params: {
    restaurantRepository : BaseRestaurantRepository
  }) {
    this.restaurantRepository = params.restaurantRepository;
  }
  
  static formatPickUpWindowDate(date: number) {
    return moment(date).format('HH:mm');
  }
  
  private _getDistanceToRestaurant(params: {userLocation: FBGeoLocation, restaurantLocation: FBGeoLocation}): number {
    const {userLocation, restaurantLocation} = params;
    return getDistance(userLocation, restaurantLocation);
  }
  
  updateRestaurantsDistance = (userLocation: FBGeoLocation, restaurants:  RestaurantHomeListItem[]) => {
    return restaurants.map(restaurant => {
      return {
        ...restaurant,
        distance: this._getDistanceToRestaurant({
          userLocation: userLocation, 
          restaurantLocation: {latitude:restaurant.latitude, longitude: restaurant.longitude}
        }),
      }
    })  
  }
  
  static isFinished(foodobox: FoodBox): boolean {
    const now = new Date().getTime();
    return now > foodobox.pickUpTo;
  }
  
  static isStarted(foodobox: FoodBox): boolean {
    const now = new Date().getTime();
    return now > foodobox.pickUpFrom;
  }
  
  static hasAvailability(foodobox: FoodBox): boolean {
    return foodobox.quantity > 0;
  }
  
  static isOpen(foodobox: FoodBox): boolean {
    return foodobox.isOpen;
  }
  
  static canCheckout(foodobox: FoodBox): boolean {
    return !RestaurantService.isFinished(foodobox) && RestaurantService.hasAvailability(foodobox) && RestaurantService.isOpen(foodobox);
  }
  
  async getRestaurantsForHome (params: {userLocation: FBGeoLocation}) : Promise<RestaurantHomeListItem[]> {
    // const {userLocation} = params;
    
    const userLocation = {
      latitude: 42.697572,
      longitude: 23.321806,
    };
    
    const restaurants = await this.restaurantRepository.getAllWithProduct();
    let index = 0;
    
    return restaurants.reduce((acc: RestaurantHomeListItem[], r:Restaurant) => {
      // Since atm we can not handle displaying of more than 1 box per restaurant
      // we will just create as many "restaurants" as there are boxes
      
      for (const box of r.boxes) {
        // skip if price is not set
        if (!box.price) {
          continue;
        }

        const restaurantHomeListItem : RestaurantHomeListItem = {
          ...r,
          
          priceAfaterDiscount: box.discountedPrice,
          distance: this._getDistanceToRestaurant({userLocation: userLocation, restaurantLocation: {latitude:r.latitude, longitude: r.longitude}}),

          pickUpTo: box.pickUpTo,
          pickUpFrom: box.pickUpFrom,
          boxesCount: box.boxesCount,
          openTime: box.pickUpFrom,
          closeTime: box.pickUpTo,
          openStatus: box.isOpen,

          photoCover: r.coverImage,
          photoAvatar: r.avatarImage,

          products: [box],
          listIndex: index
        };

        acc.push(restaurantHomeListItem);
        index ++;
      }
      
      return acc;
    }, []);
  }
  
}

export {
  RestaurantService
}
