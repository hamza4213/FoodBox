import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {FoodBox} from "../models/FoodBox";
import {RestaurantService} from "../services/RestaurantService";
import {FBUserVoucher} from "../models/FBUserVoucher";
import messaging from "@react-native-firebase/messaging";
import {UserRepository} from "../repositories/UserRepository";
import FbModal from "../components/common/fbModal";
import {useAuth} from "../providers/AuthProvider";
import {checkNotifications, requestNotifications} from "react-native-permissions";
import {translateText} from "../lang/translate";
import {useIntl} from "react-intl";
import {SystemPermissionStatus, UserPermissionAnswer} from "../redux/user/reducer";
import {useDispatch, useSelector} from "react-redux";
import {FBRootState} from "../redux/store";
import {userUpdateNotificationPermissionAction} from "../redux/user/actions";
import {RestaurantRepository} from '../repositories/RestaurantRepository';
import {restaurantResetAction, restaurantsFetchedAction} from '../redux/restaurant/actions';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import {showToastError} from '../common/FBToast';
import {useFbLoading} from '../providers/FBLoaderProvider';

interface OrderFinalizedProps {
  route: any;
  navigation: any;
}

const OrderFinalized = ({route, navigation}: OrderFinalizedProps) => {
  const orderPin = route.params.orderPin;
  const foodBox: FoodBox = route.params.foodBox;
  const userVoucher: FBUserVoucher = route.params.userVoucher;
  const {authData} = useAuth();
  const userNotificationPermission = useSelector((state: FBRootState) => state.userState.notificationPermission);
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const [toShowNotificationPermissionModal, setToShowNotificationPermissionModal] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useFbLoading();
  
  const askForNotificationPermission = async () => {
    console.log('askForNotificationPermission ')
    if (
      userNotificationPermission.userAnswer === UserPermissionAnswer.NO ||
      userNotificationPermission.systemPermission === SystemPermissionStatus.GRANTED
    ) {
      const communicationId = await messaging().getToken();
      const userRepository = new UserRepository({authData: authData!});
      await userRepository.setCommunicationId({communicationId});
      return 
    }

    const notificationPermissionStatusResult = await checkNotifications();
    console.log('notificationPermissionStatusResult.status ', notificationPermissionStatusResult.status);
    switch (notificationPermissionStatusResult.status) {
      case 'granted': 
        const communicationId = await messaging().getToken();
        const userRepository = new UserRepository({authData: authData!});
        await userRepository.setCommunicationId({communicationId});
        // console.log('granted by default communicationId ', communicationId);
        
        dispatch(userUpdateNotificationPermissionAction({systemPermission: SystemPermissionStatus.GRANTED}));
        break;
      case 'unavailable':
      case 'limited':
      case 'blocked':
        // console.log('unavailable by default');
        dispatch(userUpdateNotificationPermissionAction({systemPermission: SystemPermissionStatus.UNAVAILABLE}));
        break;
      case 'denied':
        // console.log('denied by default');
        setToShowNotificationPermissionModal(true);
        break;
    }
  };
  
  const handleConfirmNotificationPermissionModal = async () => {
    const notificationPermissionRequestResult = await requestNotifications(['alert', 'sound', 'badge']);
    // console.log('notificationPermissionRequestResult.status ', notificationPermissionRequestResult.status);
    switch (notificationPermissionRequestResult.status) {
      case "granted":
        const communicationId = await messaging().getToken();
        const userRepository = new UserRepository({authData: authData!});
        await userRepository.setCommunicationId({communicationId});
        // console.log('granted by user communicationId ', communicationId);

        dispatch(userUpdateNotificationPermissionAction({userAnswer: UserPermissionAnswer.YES, systemPermission: SystemPermissionStatus.GRANTED}));
        break;
      case 'unavailable':
      case 'limited':
      case 'blocked':
        // console.log('unavailable by user');
        dispatch(userUpdateNotificationPermissionAction({systemPermission: SystemPermissionStatus.UNAVAILABLE}));
        break;
      case 'denied':
        // console.log('denied by user');
        dispatch(userUpdateNotificationPermissionAction({userAnswer: UserPermissionAnswer.NO, systemPermission: SystemPermissionStatus.DENIED}));
        break;
    }
  }
  
  const confirmNotifications = () => {
    setToShowNotificationPermissionModal(false);
    handleConfirmNotificationPermissionModal();
  }
  
  useEffect(()=>{
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

    fetchRestaurantList();
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#10D53A'}}>
        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          <View
            style={{
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>{translateText(intl,'order.congratulation')}</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>{translateText(intl,'order.confirm_from_app')}</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>
              {translateText(intl,'order.confirm_pin')} {orderPin}
            </Text>
          </View>
          <View style={{marginTop: 30, marginHorizontal: 20}}>
            <Text style={styles.text}>
              {`${translateText(intl,'order.time')} ${translateText(intl,'offer.from')} ${RestaurantService.formatPickUpWindowDate(foodBox.pickUpFrom)} ${translateText(intl,'offer.to')} ${RestaurantService.formatPickUpWindowDate(foodBox.pickUpTo)}`}
            </Text>
          </View>

          {!!userVoucher && (
            <View style={{marginTop: 30, marginHorizontal: 20}}>
              <Text style={styles.text}>
                {translateText(intl,'offer.promo_code')} {userVoucher}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.back}
            onPress={() => {
              navigation.navigate('HomeTabs', {refreshRestaurants: true});
            }}>
            <Text style={{color: '#fff', fontWeight: '500'}}>
              {translateText(intl,'back')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FbModal
        confirm={confirmNotifications}
        modalVisible={toShowNotificationPermissionModal}
      >
        <Text>{translateText(intl,'prompts.location')}</Text>
      </FbModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
  },
  back: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'grey',
    padding: 10,
    marginHorizontal: 20,
    shadowOpacity: 0.1,
  },
});

export default OrderFinalized;
