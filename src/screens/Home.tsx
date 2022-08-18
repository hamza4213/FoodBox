import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import 'react-native-gesture-handler';
import {showToastError} from '../common/FBToast';
import {restaurantsFetchedAction} from '../redux/restaurant/actions';
import {RestaurantService} from '../services/RestaurantService';
import {RestaurantRepository} from '../repositories/RestaurantRepository';
import FBSpinner from '../components/common/spinner';
import RestaurantList from '../components/Home/restaurantList';

import RestaurantListSortOptions from '../components/Home/restaurantListSortOptions';
import ExpandListButton from '../components/Home/expandListButton';
import {FBRootState} from '../redux/store';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {userSetUserAction, userUpdateLocPermissionAction} from '../redux/user/actions';
import {useAuth} from '../providers/AuthProvider';
import FbModal from '../components/common/fbModal';
import {WebView} from 'react-native-webview';
import {TERMS_AND_CONDITIONS_FACTORY} from '../network/Server';
import {analyticsPageOpen, analyticsSetTC} from '../analytics';
import {FBUser} from '../models/User';
import {COLORS} from '../constants';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {UserRepository} from '../repositories/UserRepository';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {SystemPermissionStatus, UserPermissionAnswer} from '../redux/user/reducer';
// @ts-ignore
import RNSettings from 'react-native-settings';

export interface HomeProps {
  route: any;
  navigation: any;
}

// TODO: rename ot availableBoxes
const Home = ({navigation}: HomeProps) => {
  const {signOut} = useAuth();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const styles = stylesCreator({isFullScreen});
  const {authData} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [termsAndConditionsModal, setTermsAndConditionsModalVisible] = useState(false);

  const intl = useIntl();
  const user = useSelector((state: FBRootState) => state.user.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.user.locale);
  const userLocationPermission = useSelector((state: FBRootState) => state.user.locationPermission);
  const {location} = useSelector((state: FBRootState) => state.user);

  const dispatch = useDispatch();

  const refreshRestaurants = async () => {
    await fetchRestaurantList();
  };

  const fetchRestaurantList = async () => {
    setIsLoading(true);

    try {
      const restaurantRepository = new RestaurantRepository({authData: authData!});
      const restaurantService = new RestaurantService({restaurantRepository});
      const restaurantsListItems = await restaurantService.getRestaurantsForHome({userLocation: location});
      dispatch(restaurantsFetchedAction({restaurants: restaurantsListItems}));
    } catch (e) {
      showToastError(translateText(intl, 'backenderror.get_restaurant_error'));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: user.id, email: user.email, pageName: 'Home'});
    });
  }, [navigation]);

  const askForLocation = async () => {

    if (
      userLocationPermission.userAnswer === UserPermissionAnswer.NO ||
      userLocationPermission.systemPermission === SystemPermissionStatus.GRANTED
    ) {
      return;
    }

    // add loading
    const areLocationServicesEnabled = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);
    console.log('areLocationServicesEnabled ', areLocationServicesEnabled);

    if (areLocationServicesEnabled === RNSettings.ENABLED) {
      const locationPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      if (!locationPermission) {
        return;
      }

      const status = await check(locationPermission);

      if (status === 'granted') {
        dispatch(userUpdateLocPermissionAction({systemPermission: SystemPermissionStatus.GRANTED}));
      } else if (status === 'unavailable' || status === 'limited' || status === 'blocked') {
        dispatch(userUpdateLocPermissionAction({systemPermission: SystemPermissionStatus.UNAVAILABLE}));
      } else if (status === 'denied') {
        // ask if not already asked
        const result = await request(
          locationPermission,
          {
            title: translateText(intl, 'permission.request.location.title'),
            message: translateText(intl, 'permission.request.location.message'),
            buttonPositive: translateText(intl, 'ok'),
          },
        );

        if (result === 'granted') {
          dispatch(userUpdateLocPermissionAction({
            userAnswer: UserPermissionAnswer.YES,
            systemPermission: SystemPermissionStatus.GRANTED,
          }));
        } else {
          dispatch(userUpdateLocPermissionAction({
            userAnswer: UserPermissionAnswer.NO,
            systemPermission: SystemPermissionStatus.DENIED,
          }));
        }
      }
    } else {
      dispatch(userUpdateLocPermissionAction({systemPermission: SystemPermissionStatus.STOPPED}));
    }
  };

  useEffect(() => {
    console.log('user.acceptedTC ', user.acceptedTC);
    if (!user.acceptedTC) {
      setTermsAndConditionsModalVisible(true);
    } else {
      init();
    }
  }, []);

  const init = async () => {
    fetchRestaurantList();
    askForLocation();
  };

  const confirmTermsAndConditions = async () => {
    setTermsAndConditionsModalVisible(false);

    // start loading
    setIsLoading(true);

    // update TC
    const userRepository = new UserRepository({authData: authData!});
    await userRepository.acceptTC({userId: user.id, email: user.email});

    // fetch user again
    const newUser = await userRepository.checkMe({});
    dispatch(userSetUserAction({user: newUser}));

    // stop loading
    setIsLoading(false);

    // init
    init();
  };

  const declineTermsAndConditions = async () => {
    // TODO: add loading
    await analyticsSetTC({userId: user.id, email: user.email, action: 'decline'});
    setTermsAndConditionsModalVisible(false);
    signOut();
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.mainView}>
        <View style={styles.mapView}>
          <ClusteredMapView
            isFullScreen={isFullScreen}
          />
        </View>
        <View style={styles.restaurantsWrapper}>
          <View style={styles.restaurantsWrapperInner}>
            <ExpandListButton isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen}/>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <RestaurantListSortOptions/>

              <TouchableOpacity
                style={{
                  marginHorizontal: 2,
                  marginVertical: 10,
                  shadowColor: 'rgba(0,0,0, .4)', // IOS
                  shadowOffset: {height: 1, width: 1}, // IOS
                  shadowOpacity: 1, // IOS
                  shadowRadius: 1, //IOS
                  elevation: 2, // Android
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 20,
                  backgroundColor: COLORS.red,
                }}
                onPress={() => refreshRestaurants()}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                }}
                >
                  {translateText(intl, 'home.refresh')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: '700'}}>
                {translateText(intl, 'home.save_food')}
              </Text>
            </View>

            <RestaurantList
              isFullScreen={isFullScreen}
              userLocation={location}
              onRefreshTriggered={() => refreshRestaurants()}
            />

          </View>
        </View>
      </View>
      <FbModal
        contentContainerStyles={styles.termsConditionsContainerStyles}
        confirm={() => confirmTermsAndConditions()}
        modalVisible={termsAndConditionsModal}
        decline={() => declineTermsAndConditions()}
      >
        <WebView
          style={{marginBottom: 30, width: Dimensions.get('window').width}}
          source={{uri: TERMS_AND_CONDITIONS_FACTORY[userLocale]}}
          startInLoadingState={true}
          renderLoading={() => {
            return (<ActivityIndicator
              color="#bc2b78"
              size="large"
              hidesWhenStopped={true}
            />);
          }}
        />
      </FbModal>
      {/*<FbModal */}
      {/*  confirm={() => confirmLocation()} */}
      {/*  modalVisible={locationPromptModal}*/}
      {/*>*/}
      {/*  <Text>{translateText(intl,'prompts.location')}</Text>*/}
      {/*</FbModal>*/}
      <FBSpinner isVisible={isLoading}/>
    </SafeAreaView>
  );
};

export default Home;

const stylesCreator = ({isFullScreen}: { isFullScreen: boolean }) => StyleSheet.create({
  mainWrapper: {flex: 1, backgroundColor: '#fff'},
  mainView: {flex: 1},
  restaurantsWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: isFullScreen ? '100%' : '40%',
    opacity: 0.95,
  },
  restaurantsWrapperInner: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
    // backgroundColor: '#fff',
  },
  mapView: {
    flex: 1,
  },
  termsConditionsContainerStyles: {
    width: '80%',
    height: '70%',
    backgroundColor: '#fefaf2',
  },
});
