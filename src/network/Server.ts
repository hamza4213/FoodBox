import {FBLocale} from '../redux/user/reducer';

export const ENVIRONMENT = 'stage'; // 'stage', 'live', 'dev'

export const API_ENDPOINT_ENV = 'https://foodobox-stage.com/';
export const API_ENDPOINT_RESTAURANT_PHOTOS = `${API_ENDPOINT_ENV}restaurants/`;
export const API_ENDPOINT_PRODUCT_PHOTOS = `${API_ENDPOINT_ENV}products/`;


export const WEBSITE_ENDPOINT = 'https://foodobox.com/';

export const CONTACT_US_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}contact-us`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/contact-us/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/contact-us/`,
};

export const REGISTER_BUSINESS_FACTOR = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}for-busines`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/for-busines/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/for-busines/`,
};

export const TERMS_AND_CONDITIONS_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}terms-of-service.html`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}terms-of-service-en.html`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}terms-of-service-ro.html`,
};

export const FAQ_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}faq`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/faq/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/faq/`,
};
