import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import 'react-native-gesture-handler';
import {showToastError} from '../common/FBToast';
import {restaurantResetAction, restaurantsFetchedAction} from '../redux/restaurant/actions';
import {RestaurantService} from '../services/RestaurantService';
import {RestaurantRepository} from '../repositories/RestaurantRepository';
import RestaurantList from '../components/Home/restaurantList';
import ExpandListButton from '../components/Home/expandListButton';
import {FBRootState} from '../redux/store';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {userSetUserAction} from '../redux/user/actions';
import {useAuth} from '../providers/AuthProvider';
import FbModal from '../components/common/fbModal';
import {WebView} from 'react-native-webview';
import {TERMS_AND_CONDITIONS_FACTORY} from '../network/Server';
import {analyticsPageOpen, analyticsSetTC} from '../analytics';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {UserRepository} from '../repositories/UserRepository';
import {useFbLoading} from '../providers/FBLoaderProvider';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';

export interface HomeProps {
  route: any;
  navigation: any;
}

// TODO: rename ot availableBoxes
const Home = ({navigation}: HomeProps) => {
  const {signOut, authData} = useAuth();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const styles = stylesCreator({isFullScreen});

  const [termsAndConditionsModal, setTermsAndConditionsModalVisible] = useState(false);

  const {showLoading, hideLoading} = useFbLoading();
  const intl = useIntl();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);

  const dispatch = useDispatch();

  const refreshRestaurants = async () => {
    await fetchRestaurantList();
  };

  const fetchRestaurantList = async () => {
    showLoading('fetchRestaurants');

    try {
      const restaurantRepository = new RestaurantRepository({authData: authData!});
      const restaurantService = new RestaurantService({restaurantRepository});
      const restaurantsListItems = await restaurantService.getRestaurantsForHome({userLocation});
      dispatch(restaurantsFetchedAction({restaurants: restaurantsListItems}));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
      dispatch(restaurantResetAction());
    }
    
    hideLoading('fetchRestaurants');
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: user.id, email: user.email, pageName: 'Home'});
    });
  }, [navigation, user.email, user.id]);

  useEffect(() => {
    console.log('user.acceptedTC ', user.acceptedTC);
    if (!user.acceptedTC) {
      setTermsAndConditionsModalVisible(true);
    }
    fetchRestaurantList();
  }, []);

  const confirmTermsAndConditions = async () => {
    setTermsAndConditionsModalVisible(false);

    
    const userRepository = new UserRepository({authData: authData!});
    try {
      // update TC
      await userRepository.acceptTC({userId: user.id, email: user.email});

      // fetch user again
      const newUser = await userRepository.checkMe({});
      dispatch(userSetUserAction({user: newUser}));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }
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
        <View>
          <Text> OMG </Text>
        </View>
        <View style={styles.mapView}>
          <ClusteredMapView
            isFullScreen={isFullScreen}
          />
        </View>
        <View style={styles.restaurantsWrapper}>
          <View style={styles.restaurantsWrapperInner}>
            <ExpandListButton isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen}/>

            <RestaurantList
              isFullScreen={isFullScreen}
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
