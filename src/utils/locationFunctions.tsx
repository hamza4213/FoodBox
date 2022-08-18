import {Alert, Linking, PermissionsAndroid, Platform, ToastAndroid} from "react-native";
import Geolocation from "react-native-geolocation-service";

const hasPermissionIOS = async () => {
  const status = await Geolocation.requestAuthorization('whenInUse');
  
  if (status === 'granted') {
    return true;
  }
  
  return false;
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return await hasPermissionIOS();
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  return false;
};


