import MapView from 'react-native-map-clustering';
import {AppState, Image, Platform, StyleSheet, Text, View} from 'react-native';
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
import {SystemPermissionStatus} from '../../redux/user/reducer';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
import {useAppState} from '@react-native-community/hooks';
import {showToastError} from '../../common/FBToast';

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
  const mapRef = useRef<Map>();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const {authData} = useAuth();
  const appState = useRef(AppState.currentState);
  const intl = useIntl();

  const userLocation = useSelector((state: FBRootState) => state.user.location);
  const locPermission = useSelector((state: FBRootState) => state.user.locationPermission);

  const [showUserLocation, setShowUserLocation] = useState(false);

  const restaurants = useSelector((state: FBRootState) => {
    return newFilterRestaurants(
      state.restaurant.restaurant,
      state.restaurant.newFilters,
    );
  });

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        console.log('getCurrentPosition ', location);

        dispatch(userUpdateLocationAction({location: location}));
        const restaurantRepository = new RestaurantRepository({authData: authData!});
        const restaurantService = new RestaurantService({restaurantRepository});
        const restaurantsListItems = restaurantService.updateRestaurantsDistance(location, restaurants);
        dispatch(restaurantDistanceUpdateAction({restaurants: restaurantsListItems}));

        zoomToRegion({location: location, zoomLevel: ZoomLevel.CLOSE});

      },
      (error) => {
        // See error code charts below.
        console.log('getCurrentPosition error ', error.code, error.message);
        if (error.code === 1 ) {
          showToastError(translateText(intl, 'backenderror.no_loc_permission'));
        } else {
          showToastError(translateText(intl, 'backenderror.location_error'));
        }
      },
      {enableHighAccuracy: true},
    );
  };


  const state = useAppState();

  useEffect(() => {
    if (state === 'active') {
      console.log('state ', state);
      // getCurrentLocation();
    }
  }, [state]);

  const zoomToRegion = (params: { location: FBGeoLocation, zoomLevel: ZoomLevel }) => {
    let region = {
      latitude: params.location.latitude,
      longitude: params.location.longitude,
      ...zoomToDelta[params.zoomLevel],
    };

    mapRef?.current?.animateToRegion(region, 800);
  };

  useEffect(() => {
    const isGrantedAccess = locPermission.systemPermission === SystemPermissionStatus.GRANTED;
    setShowUserLocation(isGrantedAccess);

    if (isGrantedAccess) {

      console.log('creating watcher');

      getCurrentLocation();

      const watchId = Geolocation.watchPosition(
        ({coords}) => {
          const location: FBGeoLocation = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };

          console.log('update location', location);

          dispatch(userUpdateLocationAction({location: location}));
          const restaurantRepository = new RestaurantRepository({authData: authData!});
          const restaurantService = new RestaurantService({restaurantRepository});
          const restaurantsListItems = restaurantService.updateRestaurantsDistance(location, restaurants);
          dispatch(restaurantDistanceUpdateAction({restaurants: restaurantsListItems}));
        },
        (e) => {
          console.error(e);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 1000,
          distanceFilter: 150,
          useSignificantChanges: true,
        });

      return () => {
        Geolocation.clearWatch(watchId);
      };
    }
  }, [locPermission]);

  return (
    <>
      <MapView
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922,
        }}
        // followsUserLocation={locationPermission}
        showsUserLocation={showUserLocation}
        // @ts-ignore
        ref={mapRef}
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
      <MyLocationButton onPress={getCurrentLocation}/>
      <RestaurantSearch toHide={isFullScreen}/>
    </>
  );
};

export default ClusteredMapView;
