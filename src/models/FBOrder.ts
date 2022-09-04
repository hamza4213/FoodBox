import {FBUserVoucher} from './FBUserVoucher';
import {scheduleFloatToDate} from '../utils/scheduleFloatToDate';
import moment from 'moment';
import roundToDecimal from '../utils/roundToDecimal';

export interface FBOrder {
  id: number;
  boxId: number;
  boxName: string;
  boxPickUpFrom: number;
  boxPickUpTo: number;
  boxPhoto: string;
  boxOriginalPrice: number;
  boxDiscount: number;
  restaurantName: string;
  restaurantId: number;
  restaurantAddress: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
  restaurantPhoneNumber: string;
  createdAt: number;
  status: number; // TODO: refactor
  numberOfCheckoutBoxes: number;
  pin: string;
  totalAmount: number;
  promoCode: FBUserVoucher | null;
  promoAmount: number | null;
  promoDetails: string | null;
  pickUpTo: number;
  pickUpFrom: number;
}

export const FBOrderSortKey: keyof FBOrder = 'createdAt';

export const FBOrderMapper = {
  fromApi: (fborder: any): FBOrder => {
    return {
      id: fborder.orderId,
      boxId: fborder.productId,
      boxName: fborder.productName,
      boxPickUpFrom: scheduleFloatToDate(fborder.todaysSchedule.pickUpFrom),
      boxPickUpTo: scheduleFloatToDate(fborder.todaysSchedule.pickUpTo),
      boxPhoto: fborder.productPhoto,
      boxOriginalPrice: fborder.boxOriginalPrice,
      boxDiscount: fborder.boxDiscount,
      numberOfCheckoutBoxes: fborder.quantity,
      status: fborder.status,
      pin: fborder.pin,
      totalAmount: roundToDecimal(fborder.totalPrice),
      createdAt: moment(fborder.createdAt).toDate().getTime(),
      restaurantName: fborder.restaurantName,
      restaurantId: fborder.restaurantId,
      restaurantAddress: fborder.restaurantAddress,
      restaurantLongitude: fborder.restaurantLongitude,
      restaurantLatitude: fborder.restaurantLatitude,
      restaurantPhoneNumber: fborder.restaurantPhoneNumber,
      promoCode: fborder.voucherCode,
      promoAmount: fborder.discountedPrice,
      promoDetails: fborder.voucherDetails,
      pickUpTo: scheduleFloatToDate(fborder.todaysSchedule.pickUpTo),
      pickUpFrom: scheduleFloatToDate(fborder.todaysSchedule.pickUpFrom),
    };
  },
};
