import MapView from 'react-native-map-clustering';
import {AppState, Image, PermissionsAndroid, Platform, StyleSheet, Text, View} from 'react-native';
import {Callout, Marker} from 'react-native-maps';
import {API_ENDPOINT_PRODUCT_PHOTOS} from '../../network/Server';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import RestaurantSearch from './restaurantSearch';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
import {newFilterRestaurants} from '../../utils/filterRestaurants';
import Geolocation from '@react-native-community/geolocation';
import {RestaurantService} from '../../services/RestaurantService';
import {restaurantDistanceUpdateAction} from '../../redux/restaurant/actions';
import {FoodBox} from '../../models/FoodBox';
import {userUpdateLocationAction} from '../../redux/user/actions';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
import {useAppState} from '@react-native-community/hooks';
// @ts-ignore
import RNSettings from 'react-native-settings';
import {check as checkPermission, PERMISSIONS, request as requestPermission} from 'react-native-permissions';
import {FBGeoLocation} from '../../models/FBGeoLocation';

enum ZoomLevel {
  CLOSE,
  MEDIUM,
  HIGH
}

const zoomToDelta = {
  [ZoomLevel.CLOSE]: {latitudeDelta: 0.01, longitudeDelta: 0.01},
  [ZoomLevel.MEDIUM]: {latitudeDelta: 0.1, longitudeDelta: 0.1},
  [ZoomLevel.HIGH]: {latitudeDelta: 1, longitudeDelta: 1},
};

type ClusteredMapProps = {
  isFullScreen: boolean
};

const ClusteredMapView = ({isFullScreen}: ClusteredMapProps) => {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const intl = useIntl();

  const userLocation = useSelector((state: FBRootState) => state.user.userLocation);
  const [showUserLocation, setShowUserLocation] = useState(false);

  const restaurants = useSelector((state: FBRootState) => {
    return newFilterRestaurants(
      state.restaurant.restaurant,
      state.restaurant.newFilters,
    );
  });

  useEffect(() => {
    const isLocationServiceEnabled = async () => {
      const locationSettingStatus = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);
      const locationPermissionRequestStatus = await checkPermission(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      return locationSettingStatus === 'ENABLED' && locationPermissionRequestStatus !== 'unavailable';
    };

    const getUserLocation = async () => {
      const isLocationEnabled = await isLocationServiceEnabled();

      if (isLocationEnabled) {
        if (Platform.OS === 'ios') {
          await getIOSLocation();
        } else if (Platform.OS === 'android') {
          await getAndroidLocation();
        }
      } else {
        // TODO: show dialog explaining the issue and prompt for enabling
      }
    };
    
    const isAndroidLocationPermissionGranted = async () => {
      const locationPermissionStatus = await checkPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (locationPermissionStatus === 'granted' ) {
        // user has granted it
        return true;
      } else if (locationPermissionStatus === 'denied') {
        // must ask user
        const locationPermissionRequest = await requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (locationPermissionRequest === 'granted') {
          // user has granted it
          return true;
        }
      }
      
      return false;
    };
    
    const getAndroidLocation = async () => {
      if (await isAndroidLocationPermissionGranted()) {
        Geolocation.watchPosition(
          (position) => {
            handleUserLocationUpdate({currentUserLocation: position.coords});
          },
          () => {
            handleUserLocationError();
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 100,
          },
        );
      }
    };

    const getIOSLocation = async () => {

      Geolocation.requestAuthorization();
      Geolocation.watchPosition(
        (position) => {
          handleUserLocationUpdate({currentUserLocation: position.coords});
        },
        () => {
          handleUserLocationError();
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100,
        },
      );
    };
    
    const handleUserLocationError = () => {
      setShowUserLocation(false);
    };
    
    const handleUserLocationUpdate = (params: {currentUserLocation: FBGeoLocation}) => {
      const {currentUserLocation} = params;
      // ensure restaurants are shown closest to last known location on first load until we have real location
      dispatch(userUpdateLocationAction({userLocation: currentUserLocation}));

      // update restaurants distance to user
      dispatch(restaurantDistanceUpdateAction({userLocation: currentUserLocation}));

      // since we have access to the location show it on the map
      setShowUserLocation(true);
    };
    
    getUserLocation();  
    
    return () => {
      Geolocation.stopObserving();
    };
  }, [dispatch]);
  
  return (
    <>
      <MapView
        initialRegion={{
          ...userLocation,
          ...zoomToDelta[ZoomLevel.MEDIUM],
        }}
        showsUserLocation={showUserLocation}
        style={{
          ...StyleSheet.absoluteFillObject,
          width: '100%',
        }}>
        {
          restaurants.map(restaurant => {
            const box: FoodBox = restaurant.products[0];
            const canCheckout = RestaurantService.canCheckout(box);

            return (
              <Marker
                key={restaurant.listIndex}
                identifier={`${restaurant.listIndex}`}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}>
                <Image
                  source={{
                    uri: API_ENDPOINT_PRODUCT_PHOTOS + box.thumbnailPhoto,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    borderColor: canCheckout ? '#0bd53a' : '#cc0000',
                    overflow: 'hidden',
                    borderWidth: 2,
                  }}
                />
                <Callout
                  onPress={() => navigate('Offer', {
                    restaurant: restaurant,
                    box: box,
                  })}
                  style={{width: 100}}
                >
                  <View style={{flexGrow: 1, flexDirection: 'row'}}>
                    <Text style={{flex: 1, width: 1, color: '#29455f'}}>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: '#29455f',
                      }}>{box.name}</Text>
                      <Text>{` ${translateText(intl, 'order.from')} `}</Text>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: '#29455f',
                      }}>{restaurant.name}</Text>
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>
      {/*<MyLocationButton onPress={getCurrentLocation}/>*/}
      <RestaurantSearch toHide={isFullScreen}/>
    </>
  );
};

export default ClusteredMapView;
