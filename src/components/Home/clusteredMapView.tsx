import MapView from 'react-native-map-clustering';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import Map, {Callout, Marker} from 'react-native-maps';
import {API_ENDPOINT_PRODUCT_PHOTOS} from '../../network/Server';
import React, {useEffect, useRef, useState} from 'react';
import MyLocationButton from './myLocationButton';
import {useNavigation} from '@react-navigation/core';
import RestaurantSearch from './restaurantSearch';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
import {newFilterRestaurants} from '../../utils/filterRestaurants';
import Geolocation from '@react-native-community/geolocation';
import {RestaurantService} from '../../services/RestaurantService';
import {restaurantDistanceUpdateAction} from '../../redux/restaurant/actions';
import {RestaurantRepository} from '../../repositories/RestaurantRepository';
import {useAuth} from '../../providers/AuthProvider';
import {FoodBox} from '../../models/FoodBox';
import {userUpdateLocationAction} from '../../redux/user/actions';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
import {useAppState} from '@react-native-community/hooks';
import {showToastError} from '../../common/FBToast';
import {check as checkPermission, PERMISSIONS, request as requestPermission} from 'react-native-permissions';
import RNSettings from 'react-native-settings';

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

  const appState = useAppState();
  useEffect(() => {
    const isLocationServiceEnabled = async () => {
      const response = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);
      return response === 'ENABLED';
    };

    const getIOSLocation = async () => {
      const isLocationEnabled = await isLocationServiceEnabled();

      if (isLocationEnabled) {
        Geolocation.requestAuthorization();
        Geolocation.watchPosition(
          (position) => {
            const currentUserLocation = position.coords;
            
            // ensure restaurants are shown closest to last known location on first load until we have real location
            dispatch(userUpdateLocationAction({userLocation: currentUserLocation}));
            
            // update restaurants distance to user
            dispatch(restaurantDistanceUpdateAction({userLocation: currentUserLocation}));
            
            // since we have access to the location show it on the map
            setShowUserLocation(true);
          },
          () => {
            setShowUserLocation(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 100,
          },
        );

      } else {
        // TODO: show dialog explaining the issue and prompt for enabling
      }
    };
    
    if (appState === 'active') {
      if (Platform.OS === 'ios') {
        getIOSLocation();
      } else if (Platform.OS === 'android') {

      }
    }

    return () => {
      Geolocation.stopObserving();
    };
  }, [appState, dispatch]);

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
