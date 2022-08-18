import {AuthData} from "../models/AuthData";
import {FBBaseError} from "../common/FBBaseError";
import axiosClient from "../network/axiosClient";
import QueryString from "query-string";
import {FBUserVoucher} from "../models/FBUserVoucher";

export interface BaseUserVoucherRepository {
  verify (params: {voucher: FBUserVoucher, numberOfBoxesInBasket: number, boxId: number}): Promise<{ isValid: boolean, discountedPrice: number }>;
}

class UserVoucherRepositoryError extends FBBaseError {}

class UserVoucherRepository implements BaseUserVoucherRepository {
  private authData: AuthData

  constructor(params: {
    authData: AuthData
  }) {
    this.authData = params.authData;
  }
  
  public async verify (params: {voucher: FBUserVoucher, numberOfBoxesInBasket: number, boxId: number}): Promise<{ isValid: boolean, discountedPrice: number }> {
    const url = '/voucher/apply';
    try {
      const response: { success: boolean, promoPrice: number } = await axiosClient.post(
        url,
        QueryString.stringify({
          voucherCode: params.voucher,
          quantity: params.numberOfBoxesInBasket,
          productId: params.boxId,
        }),
        {
          headers: {
            'x-access-token': this.authData.userToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      
      return {
        isValid: response.success,
        discountedPrice: response.promoPrice
      };
    } catch (e) {
      console.error(e);
      throw new UserVoucherRepositoryError()
    }
    
  }
}

export {
  UserVoucherRepository,
  UserVoucherRepositoryError
}
