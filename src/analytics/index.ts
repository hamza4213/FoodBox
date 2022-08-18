import analytics from '@react-native-firebase/analytics';
import {FBRestaurantFilters} from '../redux/restaurant/reducer';
import {FBLocale} from '../redux/user/reducer';
import {ENVIRONMENT} from '../network/Server';
import {FBUserVoucher} from '../models/FBUserVoucher';
import {AppEventsLogger} from 'react-native-fbsdk-next';


const logEvent = async (name: string, data: any) => {
  try {
    data.env = ENVIRONMENT;

    console.log(name, data);
    
    if (data.data) {
      Object.assign(data, data.data);
      delete data.data;
    }

    if (data.email) {
      data.uEmail = data.email;
      delete data.email;
    }

    if (data.deviceId) {
      delete data.deviceId;
    }

    if (data.productId) {
      data.fbPId = data.productId;
      delete data.productId;
    }

    if (data.quantity) {
      data.fbQ = data.quantity;
      delete data.quantity;
    }

    if (data.voucher) {
      data.fbV = data.voucher;
      delete data.voucher;
    }
    
    if (data.step) {
      data.fbStep = data.step;
      delete data.step;
    }

    Object.keys(data).forEach((k) => {
      if (typeof data[k] === 'boolean') {
        data[k] = data[k] ? 1 : 0;
      }
      
      if (data[k] === null) {
        data[k] = '';
      }
    });

    console.log(name, data);


    if (name === 'BasketUpdated') {
      // await analytics().logAddToCart({
      //   items: [{item_id: '' + data.productId, quantity: data.quantity, price: data.value / data.quantity}],
      //   currency: 'BGN',
      //   value: data.value,
      // });
    }

    if (name === 'CheckoutStarted' && data.step === 'completed') {
      // await analytics().logPurchase({
      //   items: [{item_id: '' + data['productId'], quantity: data['quantity'], price: data['value'] / data['quantity']}],
      //   // currency: 'BGN',
      //   // value: data.value,
      // });
    }


    AppEventsLogger.logEvent(name, data);
    await analytics().logEvent(name, data);
  } catch (e) {
    console.log(e);
  }
};

export const analyticsRegistration = async(params: {email: string, step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any } }) => {
  await logEvent('ManualRegistration', {...params});
};

export const analyticsEmailLogin = async (params: {email: string, step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any }}) => {
  await logEvent('EmailLogin', {...params});
};

export const analyticsSocialLogin = async(params: { type: 'fb' | 'google' | 'apple', step: 'initiated' | 'external_completed' | 'failed' | 'refused' | 'completed', data?: { [key: string]: any }}) => {
  await logEvent('SocialLogin', { ...params});
};

export const analyticsResetPassword = async (params: {step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any }}) => {
  await logEvent('ResetPassword', {...params});
};

export const analyticsPageOpen = async (params: { userId: number, email: string, pageName: string, data?: { [key: string]: any } }) => {
  await logEvent('PageOpen', { ...params});
};

export const analyticsOrderStatusChange = async (params: { userId: number, email: string, orderId: number, status: 'confirmed' | 'cancelled' }) => {
  await logEvent('OrderStatusChange', { ...params});
};

export const analyticsBasketUpdated = async (params: { userId: number, email: string, productId: number, quantity: number, voucher: FBUserVoucher | null, value: number }) => {
  await logEvent('BasketUpdated', { ...params});
};

export const analyticsCheckoutStepChange = async (params: { userId: number, email: string, productId: number, quantity: number, voucher: FBUserVoucher | null, step: 'initiated' | 'confirmed' | 'paymentConfirm' | 'completed' | 'failed', error?: any }) => {
  await logEvent('CheckoutStarted', { ...params});
};

export const analyticsLinkOpened = async (params: { userId: number; email: string; link: string; linkName: string }) => {
  await logEvent('LinkOpened', { ...params});
};

export const analyticsSignOut = async (params: { userId: number; email: string }) => {
  await logEvent('SignOut', { ...params});
};

export const analyticsFilterChange = async (params: { userId: number; email: string; filters: FBRestaurantFilters }) => {
  await logEvent('FilterChange', { ...params});
};

export const analyticsSetLocale = async (params: { userId: number; email: string; locale: FBLocale }) => {
  await logEvent('SetLocale', { ...params});
};

export const analyticsSetTC = async (params: { userId: number; email: string; action: 'accept' | 'decline' }) => {
  await logEvent('SetTC', { ...params});
};

