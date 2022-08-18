import {RestaurantHomeListItem} from "../models/Restaurant";
import {FBRestaurantFilters} from "../redux/restaurant/reducer";
import moment from "moment";
import {RestaurantService} from "../services/RestaurantService";

export const newFilterRestaurants = (restaurants: RestaurantHomeListItem[], filters: FBRestaurantFilters): RestaurantHomeListItem[] => {
  // console.log('newFilterRestaurants', filters);
  return restaurants.filter(r => {
    let passesFilters = true;
    const box = r.products[0];
    // console.log('restaurant ', r.id);
    
    for (const [filterCategoryName, filterCategoryConfig] of Object.entries(filters)) {
      if (filterCategoryConfig.isEnabled) {
        
        switch (filterCategoryName) {
          case 'isRestaurantOpen': {
            passesFilters = filterCategoryConfig.isOpen ? passesFilters && RestaurantService.isOpen(box) : passesFilters;
            // console.log(`isRestaurantOpen ${box.isOpen}`);
            break;
          }
          
          case 'hasRestaurantAvailableBoxes': {
            passesFilters = filterCategoryConfig.hasAvailableBoxes ? passesFilters && RestaurantService.hasAvailability(box) : passesFilters;
            // console.log(`hasRestaurantAvailableBoxes ${box.quantity > 0}`);
            break;
          }
          
          case 'isNotFinished': {
            passesFilters = filterCategoryConfig.isNotFinished ? passesFilters && !RestaurantService.isFinished(box) : passesFilters;
            break;
          }
            
          case 'canCheckout': {
            passesFilters = filterCategoryConfig.canCheckout ? passesFilters && RestaurantService.canCheckout(box): passesFilters;
            break;
          }
          
          case 'pickUpPeriod': {
            const pickUpFrom = moment(box.pickUpFrom);
            const pickUpTo = moment(box.pickUpTo);
            const lowerLimitFilter = moment(filterCategoryConfig.pickUpStartTimeLowerLimit);
            const upperLimitFilter = moment(filterCategoryConfig.pickUpEndTimeUpperLimit);
            
            const lowerLimit = moment().set({hour: lowerLimitFilter.hour(), minute: lowerLimitFilter.minute()});
            const upperLimit = moment().set({hour: upperLimitFilter.hour(), minute: upperLimitFilter.minute()});
            
            // console.log('pickUpPeriod ', pickUpFrom, pickUpTo, lowerLimit, upperLimit, pickUpTo.isBefore(lowerLimit), pickUpFrom.isAfter(upperLimit));
            if (pickUpTo.isBefore(lowerLimit) || pickUpFrom.isAfter(upperLimit)) {
              passesFilters = passesFilters && false;
            } else {
              passesFilters = passesFilters && true
            }
            break;
          }
          
          case 'foodType': {
            if (box.foodType && filterCategoryConfig.types.length) {
              // console.log(`foodtype ${box.foodType} in ${filterCategoryConfig.types}`);
              passesFilters = passesFilters && filterCategoryConfig.types.includes(box.foodType);
              
            }
            break;
          }
          
          case 'dietType': {
            if (box.dietType && filterCategoryConfig.types.length) {
              // console.log(`dietType ${box.dietType} in ${filterCategoryConfig.types}`);
              passesFilters = passesFilters && filterCategoryConfig.types.includes(box.dietType);
            }
            break;
          }
          
          case 'search': {
            if (filterCategoryConfig.searchTerm) {
              passesFilters = passesFilters && r.name.search(new RegExp(filterCategoryConfig.searchTerm, 'i')) >= 0;
            }
            break;
          }

        }
      }
    }
    
    return passesFilters;
  })
};
