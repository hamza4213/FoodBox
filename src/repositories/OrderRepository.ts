import {FBBaseError} from '../common/FBBaseError';
import {AuthData} from '../models/AuthData';
import {FBUserVoucher} from '../models/FBUserVoucher';
import axiosClient from '../network/axiosClient';
import QueryString from 'query-string';
import {FBOrder, FBOrderMapper} from '../models/FBOrder';
import {analyticsCheckoutStepChange} from '../analytics';
import {FBUser} from '../models/User';
import axios from 'axios';
import {UserRepositoryError} from './UserRepository';

export interface CreateOrderParams {
  restaurantId: number,
  numberOfBoxesInBasket: number,
  boxId: number,
  userVoucher: FBUserVoucher
}

export interface BaseOrderRepository {
  createOrder(params: CreateOrderParams): Promise<{ isCreated: boolean, pin: string }>;

  getAll(params: {}): Promise<FBOrder[]>;

  cancelOrder(params: { orderId: number }): Promise<boolean>;

  confirmOrder(params: { orderId: number }): Promise<boolean>;
}

class OrderRepositoryError extends FBBaseError {
}

class OrderRepository implements BaseOrderRepository {
  private authData: AuthData;
  private user: FBUser;

  constructor(params: {
    authData: AuthData,
    user: FBUser
  }) {
    this.authData = params.authData;
    this.user = params.user;
  }

  async confirmOrder(params: { orderId: number }): Promise<boolean> {
    const url = '/user/confirm-order-completed/';
    try {
      const result: { success: boolean } = await axiosClient.patch(
        url,
        QueryString.stringify({
          orderId: params.orderId,
        }),
        {
          headers: {
            'x-access-token': this.authData.userToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return result.success;
    } catch (e) {
      throw new OrderRepositoryError();
    }
  }

  async cancelOrder(params: { orderId: number }): Promise<boolean> {
    const url = '/user/orders/' + params.orderId;
    try {
      const result: { success: boolean } = await axiosClient.delete(
        url,
        {
          headers: {
            'x-access-token': this.authData.userToken,
          },
        },
      );

      return result.success;
    } catch (e) {
      throw new OrderRepositoryError();
    }
  }

  async getAll(params: {}): Promise<FBOrder[]> {
    const url = '/user/orders';
    try {
      const result: { orders: any[] } = await axiosClient.get(
        url,
        {
          headers: {
            'x-access-token': this.authData.userToken,
          },
        },
      );

      return result.orders.map(o => FBOrderMapper.fromApi(o));
    } catch (e) {
      throw new OrderRepositoryError();
    }
  }

  async createOrder(params: CreateOrderParams): Promise<{ isCreated: boolean, pin: string }> {
    const url = '/user/order/' + params.restaurantId;

    try {
      const responseData: { success: boolean, orderId: number, pin: string } = await axiosClient.post(
        url,
        QueryString.stringify({
          quantity: params.numberOfBoxesInBasket,
          productId: params.boxId,
          voucherCode: params.userVoucher,
        }),
        {
          headers: {
            'x-access-token': this.authData.userToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      await analyticsCheckoutStepChange({
        userId: this.user.id,
        email: this.user.email,
        productId: params.boxId,
        quantity: params.numberOfBoxesInBasket,
        voucher: params.userVoucher,
        step: 'completed',
      });

      return {
        isCreated: responseData.success,
        pin: responseData.pin,
      };
    } catch (e: any) {
      
      console.log(e);

      await analyticsCheckoutStepChange({
        userId: this.user.id,
        email: this.user.email,
        productId: params.boxId,
        quantity: params.numberOfBoxesInBasket,
        voucher: params.userVoucher,
        step: 'failed',
        error: e.response?.data.message,
      });

      if (axios.isAxiosError(e)) {
        throw new UserRepositoryError(e.response?.data.message);
      } else {
        throw new UserRepositoryError();
      }

    }
  }

}

export {
  OrderRepository,
  OrderRepositoryError,
};
