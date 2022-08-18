import axios from 'axios';
import {API_ENDPOINT_ENV} from '../Server';

const axiosClient = axios.create({
  baseURL: API_ENDPOINT_ENV,
  //timeout: 35000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
});
axiosClient.interceptors.request.use(async config => {
  // Handle token here ...
  return config;
});
axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  error => {

    if (error && error.response) {
      if (error.response.status === 401) {
        // TODO: sign-out
        
      }
    }


    throw error;
  },
);
export default axiosClient;
