import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {API_ENDPOINT_RESTAURANT_PHOTOS} from '../../network/Server';
import {Utils} from '../../utils';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {RestaurantService} from '../../services/RestaurantService';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {FoodBox} from '../../models/FoodBox';
import {COLORS} from '../../constants';

export type RestaurantListItemProps = {
  restaurant: RestaurantHomeListItem;
  isFullscreen: boolean;
  userLocation: FBGeoLocation
}

const RestaurantListItem = (componentProps: RestaurantListItemProps) => {
  const {
    restaurant,
    isFullscreen,
    userLocation,
  } = componentProps;

  const navigation = useNavigation();
  const box = restaurant.products[0];

  const canCheckout = RestaurantService.canCheckout(box);
  const isOpen = RestaurantService.isOpen(box);
  const borderColor = canCheckout ? COLORS.green : COLORS.red;
  const boxQuantityBackgroundColor = canCheckout ? COLORS.green : COLORS.red;

  const intl = useIntl();

  const onClickHandler = () => {
    navigation.navigate('Offer', {restaurant: restaurant, userLocation: userLocation, box: box});
  };

  const styles = stylesCreator({
    borderColor: borderColor,
    isFullscreen: isFullscreen,
    boxQuantityBackgroundColor: boxQuantityBackgroundColor,
    width: Utils.width,
  });

  const renderFullScreenImage = (isFullScreen: boolean) => {
    if (isFullScreen) {
      return (
        <View>
          <Image
            source={{uri: API_ENDPOINT_RESTAURANT_PHOTOS + box.photo}}
            resizeMode={'contain'}
            style={styles.fullScreenImage}
            blurRadius={canCheckout ? 0 : 10}
          />
        </View>
      );
    }
  };

  const renderPickUpTime = (b: FoodBox) => {
    const pickUpStart = RestaurantService.formatPickUpWindowDate(b.pickUpFrom);
    const pickUpEnd = RestaurantService.formatPickUpWindowDate(b.pickUpTo);
    
    if (!canCheckout) {
      return null;
    }

    return (
      <Text style={styles.pickUpInfo}>
        {translateText(intl, 'offer.today')}:{' '}{pickUpStart}{' '}-{''}{pickUpEnd}!
      </Text>
    );
  };

  const renderRestaurantName = (restaurantName: string, boxName: string) => {
    return (
      <View style={{flexGrow: 1, flexDirection: 'row'}}>
        <Text style={{flex: 1, width: 1, color: '#29455f'}}>
          <Text style={[styles.restaurantInfoName]}>{boxName}</Text>
          <Text>{` ${translateText(intl, 'order.from')} `}</Text>
          <Text style={[styles.restaurantInfoName]}>{restaurantName}</Text>
        </Text>
      </View>
    );
  };

  const renderRestaurantAvatar = (avatar: string) => {
    const restaurantAvatarSource = {uri: API_ENDPOINT_RESTAURANT_PHOTOS + avatar};
    return (
      <Image
        source={restaurantAvatarSource}
        style={styles.restaurantInfoAvatar}
        resizeMode={'contain'}
        blurRadius={canCheckout ? 0 : 10}
      />
    );
  };

  const renderRestaurantType = (businessType: string) => {
    return (
      <Text style={styles.restaurantInfoBusinessType}>
        {businessType}
      </Text>
    );
  };

  const renderDistance = (distance: number) => {
    return (
      <Text
        style={styles.restaurantInfoDistance}
      >
        {distance}
        {translateText(intl, 'distance_unit')}
      </Text>
    );
  };

  const renderStatus = (boxQuantity: number) => {
    
    let text = `${boxQuantity} ${boxQuantity === 1 ? translateText(intl, 'box') : translateText(intl, 'boxes')}`;
    
    if (!isOpen) {
      text = translateText(intl, 'restaurant.status.closed');
    }

    return (
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>
          {text}
        </Text>
      </View>
    );
  };

  const renderBoxInfoPrice = (boxPrice: number) => {
    return (
      <Text style={styles.boxInfoPrice}>
        {boxPrice.toFixed(2)}{translateText(intl, 'price_unit')}
      </Text>
    );
  };

  const renderBoxInfoDiscountedPrice = (boxDiscount: number, boxPrice: number) => {
    const discountAmount = boxPrice * (boxDiscount / 100);
    const discountedPrice = boxPrice - discountAmount;
    return (
      <Text style={styles.boxInfoDiscountedPrice}>
        {discountedPrice.toFixed(2)}{translateText(intl, 'price_unit')}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.tile}
      key={restaurant.id}
      onPress={onClickHandler}
    >
      {renderFullScreenImage(isFullscreen)}

      <View style={styles.mainWrapper}>
        {/*AvatarImg*/}
        <View style={{width: 70}}>
          {renderRestaurantAvatar(box.thumbnailPhoto)}
        </View>

        {/*RestaurantInfo*/}
        <View style={{flex: 1}}>
          {renderRestaurantName(restaurant.name, box.name)}
          {renderRestaurantType(restaurant.businessType)}
          {renderPickUpTime(box)}
          {renderDistance(restaurant.distance)}
        </View>

        {/*BoxInfo*/}
        <View style={{width: 70}}>
          {renderStatus(box.quantity)}
          {renderBoxInfoPrice(box.price)}
          {renderBoxInfoDiscountedPrice(box.discount, box.price)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantListItem;

const stylesCreator = (props: {
  borderColor: string,
  isFullscreen: boolean,
  boxQuantityBackgroundColor: string,
  width: number
}) => StyleSheet.create({
  tile: {
    shadowColor: 'rgba(0,0,0, .3)', // IOS
    shadowOffset: {height: 5, width: 5}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 2, // Android
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: props.borderColor,
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    paddingTop: props.isFullscreen ? 0 : 10,
  },
  fullScreenImage: {
    width: '100%',
    aspectRatio: 2,
  },
  mainWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restaurantInfoWrapper: {
    flexDirection: 'row',
  },
  restaurantInfoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 200,
    marginRight: 10,
  },
  restaurantInfoName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29455f',
  },
  restaurantInfoBusinessType: {
    fontSize: 12,
    color: '#c5ced3',
    fontWeight: '500',
    width: props.width / 2,
    marginRight: 5,
    marginTop: 10,
  },
  pickUpInfo: {
    fontSize: 12,
    color: '#c5ced3',
    fontWeight: '500',
    marginTop: 5,
  },
  restaurantInfoDistance: {
    fontSize: 10,
    color: '#c5ced3',
    fontWeight: '500',
    marginTop: 5,
  },
  statusWrapper: {
    borderRadius: 5,
    backgroundColor: props.boxQuantityBackgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  statusText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 12,
  },
  boxInfoPrice: {
    fontSize: 10,
    color: '#afbbc4',
    fontWeight: '700',
    textDecorationLine: 'line-through',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  boxInfoDiscountedPrice: {
    fontSize: 13,
    color: 'red',
    fontWeight: '700',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});
