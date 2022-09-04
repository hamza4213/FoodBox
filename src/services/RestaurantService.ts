import {BaseRestaurantRepository} from '../repositories/RestaurantRepository';
import {Restaurant, RestaurantHomeListItem} from '../models/Restaurant';
import {getDistance} from 'geolib';
import moment from 'moment';
import {FBGeoLocation} from '../models/FBGeoLocation';
import {FoodBox} from '../models/FoodBox';
import getDistanceToLocation from '../utils/getDistanceToLocation';

class RestaurantService {
  restaurantRepository: BaseRestaurantRepository;

  constructor(params: {
    restaurantRepository: BaseRestaurantRepository
  }) {
    this.restaurantRepository = params.restaurantRepository;
  }

  static formatPickUpWindowDate(date: number) {
    return moment(date).format('HH:mm');
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

  async getRestaurantsForHome(params: { userLocation: FBGeoLocation }): Promise<RestaurantHomeListItem[]> {
    const {userLocation} = params;

    const restaurants = await this.restaurantRepository.getAllWithProduct();
    console.log('restaurants ', restaurants.length);
    let index = 0;

    return restaurants.reduce((acc: RestaurantHomeListItem[], r: Restaurant) => {
      // Since atm we can not handle displaying of more than 1 box per restaurant
      // we will just create as many "restaurants" as there are boxes

      for (const box of r.boxes) {
        // skip if price is not set
        if (!box.price) {
          continue;
        }

        const restaurantHomeListItem: RestaurantHomeListItem = {
          ...r,
          
          priceAfaterDiscount: box.discountedPrice,
          distance: getDistanceToLocation({
            userLocation: userLocation,
            location: {latitude: r.latitude, longitude: r.longitude},
          }),

          pickUpTo: box.pickUpTo,
          pickUpFrom: box.pickUpFrom,
          boxesCount: box.boxesCount,
          openTime: box.pickUpFrom,
          closeTime: box.pickUpTo,
          openStatus: box.isOpen,

          photoCover: r.coverImage,
          photoAvatar: r.avatarImage,

          products: [box],
          listIndex: index,
        };

        acc.push(restaurantHomeListItem);
        index++;
      }

      return acc;
    }, []);
  }

}

export {
  RestaurantService,
};
