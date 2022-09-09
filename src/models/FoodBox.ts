import {scheduleFloatToDate} from '../utils/scheduleFloatToDate';
import roundToDecimal from '../utils/roundToDecimal';

enum FoodType {
  PASTRIES = 1,
  GROCERIES = 2,
  MEALS = 3,
  OTHERS = 4
}

enum DietType {
  VEGAN = 1,
  VEGETARIAN = 2
}

export interface FoodBox {
  id: number;
  restaurantId: number;

  name: string;
  summary: string;
  isActive: boolean;

  price: number;
  discount: number;
  quantity: number; // available boxes for offer
  discountedPrice: number; // TODO: this should not be on the interface

  thumbnailPhoto: string;
  photo: string;

  foodType: null | FoodType;
  dietType: null | DietType;
  allergenes: string; // TODO: fix typo and add type

  // schedule
  isOpen: boolean;
  pickUpTo: number;
  pickUpFrom: number;
  boxesCount: number; // total boxes
}

const FoodBoxMapper = {
  fromApi: (fb: any): FoodBox => {
    let foodType = null;
    if (fb.foodType in FoodType) {
      foodType = fb.foodType;
    }

    let dietType = null;
    if (fb.dietType in DietType) {
      dietType = fb.dietType;
    }

    const defaultPickUpTo = new Date();
    defaultPickUpTo.setHours(23, 59);
    const defaultPickUpFrom = new Date();
    defaultPickUpFrom.setHours(0, 0);

    const box = {
      id: fb.id,
      restaurantId: fb.restaurantId,

      name: fb.name,
      summary: fb.summary,
      isActive: !!fb.isActive,

      price: fb.price,
      discount: fb.discount,
      quantity: fb.quantity,
      discountedPrice: roundToDecimal(fb.price - fb.price * fb.discount / 100),

      thumbnailPhoto: fb.photo,
      photo: fb.originalPhoto,

      foodType: foodType,
      dietType: dietType,
      allergenes: fb.allergenes,

      isOpen: fb.todaysSchedule.open,
      pickUpTo: fb.todaysSchedule.pickUpTo ? scheduleFloatToDate(fb.todaysSchedule.pickUpTo) : defaultPickUpTo.getTime(),
      pickUpFrom: fb.todaysSchedule.pickUpFrom ? scheduleFloatToDate(fb.todaysSchedule.pickUpFrom) : defaultPickUpFrom.getTime(),
      boxesCount: fb.todaysSchedule.boxesCount,
      
    };

    return box;
  },
};

export {
  FoodType,
  DietType,
  FoodBoxMapper,
};
