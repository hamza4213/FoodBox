// export const API_ENDPOINT_ENV = 'http://foodobox-stage.com/'; //_Dev
//export const API_ENDPOINT_ENV = 'https://foodobox.com/'; // _Release
import {FBLocale} from '../redux/user/reducer';

export const API_ENDPOINT_ENV = 'https://foodobox-stage.com/'; // _Release
//const API_ENDPOINT_ENV = "https://f16298b819c3.ngrok.io/";  //
export const ENVIRONMENT = 'dev'; // 'stage', 'live', 'dev'

export const API_ENDPOINT = `${API_ENDPOINT_ENV}user/`;
export const API_ENDPOINT_RESTAURANT_PHOTOS = `${API_ENDPOINT_ENV}restaurants/`;
export const API_ENDPOINT_PRODUCT_PHOTOS = `${API_ENDPOINT_ENV}products/`;
export const WEBSITE_ENDPOINT = 'https://foodobox.com/';

export const WEBSITE_CAUSE = `${API_ENDPOINT_ENV}мисия-и-визия`;
export const WEBSITE_TERMS_OF_SERVICE = `${WEBSITE_ENDPOINT}terms-of-service.html`;
export const WEBSITE_FAQ = `${API_ENDPOINT_ENV}често-задавани-въпроси-2`;
export const WEBSITE_CONTACT_US = `${WEBSITE_ENDPOINT}contact-us`;
export const WEBSITE_ABOUT_US = `${WEBSITE_ENDPOINT}who-are-we-bg`;
export const TERMS_AND_CONDITIONS_BG = `${WEBSITE_ENDPOINT}terms-of-service.html`;
export const TERMS_AND_CONDITIONS_EN = `${WEBSITE_ENDPOINT}terms-of-service-en.html`;
export const TERMS_AND_CONDITIONS_RO = `${WEBSITE_ENDPOINT}terms-of-service-ro.html`;
export const WEBSITE_REGISTER_BUSINESS = `${WEBSITE_ENDPOINT}for-busines`;

export const TERMS_AND_CONDITIONS_FACTORY = {
  [FBLocale.EN]: TERMS_AND_CONDITIONS_EN,
  [FBLocale.BG]: TERMS_AND_CONDITIONS_BG,
  [FBLocale.RO]: TERMS_AND_CONDITIONS_RO,
};
