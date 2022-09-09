import {RestaurantHomeListItem} from '../models/Restaurant';
import {FBRestaurantFilters} from '../redux/restaurant/reducer';
import moment from 'moment';
import {RestaurantService} from '../services/RestaurantService';

export const toShowRestaurant = (restaurant: RestaurantHomeListItem, filters: FBRestaurantFilters): boolean => {
  let passesFilters = true;
  const box = restaurant.products[0];
  console.log('filtering ', restaurant.name);
  
  for (const [filterCategoryName, filterCategoryConfig] of Object.entries(filters)) {
    // console.log(filterCategoryName, filterCategoryConfig.isEnabled);
    if (filterCategoryConfig.isEnabled) {
      switch (filterCategoryName) {
        case 'isRestaurantOpen': {
          console.log('isRestaurantOpen', RestaurantService.isOpen(box), passesFilters);
          passesFilters = filterCategoryConfig.isOpen ? passesFilters && RestaurantService.isOpen(box) : passesFilters;
          break;
        }

        case 'hasRestaurantAvailableBoxes': {
          console.log('hasRestaurantAvailableBoxes', RestaurantService.hasAvailability(box), passesFilters);
          passesFilters = filterCategoryConfig.hasAvailableBoxes ? passesFilters && RestaurantService.hasAvailability(box) : passesFilters;
          break;
        }

        case 'isNotFinished': {
          console.log('isNotFinished', !RestaurantService.isFinished(box), passesFilters);
          passesFilters = filterCategoryConfig.isNotFinished ? passesFilters && !RestaurantService.isFinished(box) : passesFilters;
          break;
        }

        case 'canCheckout': {
          console.log('canCheckout', !RestaurantService.canCheckout(box), passesFilters);
          passesFilters = filterCategoryConfig.canCheckout ? passesFilters && RestaurantService.canCheckout(box) : passesFilters;
          break;
        }

        case 'pickUpPeriod': {
          const pickUpFrom = moment(box.pickUpFrom);
          const pickUpTo = moment(box.pickUpTo);
          const lowerLimitFilter = moment(filterCategoryConfig.pickUpStartTimeLowerLimit);
          const upperLimitFilter = moment(filterCategoryConfig.pickUpEndTimeUpperLimit);

          const lowerLimit = moment().set({hour: lowerLimitFilter.hour(), minute: lowerLimitFilter.minute()});
          const upperLimit = moment().set({hour: upperLimitFilter.hour(), minute: upperLimitFilter.minute()});

          console.log('pickUpPeriod ', pickUpFrom, pickUpTo, lowerLimit, upperLimit, pickUpTo.isBefore(lowerLimit), pickUpFrom.isAfter(upperLimit), passesFilters);
          if (pickUpTo.isBefore(lowerLimit) || pickUpFrom.isAfter(upperLimit)) {
            passesFilters = passesFilters && false;
          } else {
            passesFilters = passesFilters && true;
          }
          break;
        }

        case 'foodType': {
          console.log(`foodtype ${box.foodType} in ${filterCategoryConfig.types} ${passesFilters}`);
          if (box.foodType && filterCategoryConfig.types.length) {
            passesFilters = passesFilters && filterCategoryConfig.types.includes(box.foodType);
          }
          break;
        }

        case 'dietType': {
          console.log(`dietType ${box.dietType} in ${filterCategoryConfig.types} ${passesFilters}`);
          if (box.dietType && filterCategoryConfig.types.length) {
            passesFilters = passesFilters && filterCategoryConfig.types.includes(box.dietType);
          }
          break;
        }

        case 'search': {
          console.log('search', filterCategoryConfig);
          if (filterCategoryConfig.userInput) {
            const regex = new RegExp(`${filterCategoryConfig.userInput}`, 'gmi');
            const doesMatch = restaurant.name.search(regex) >= 0;
            
            // console.log('search doesMatch', restaurant.name, regex, passesFilters);
            passesFilters = passesFilters && doesMatch;
          }
          break;
        }

      }
    }
  }

  return passesFilters;
  
};
