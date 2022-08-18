import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

export interface MyLocationButtonProps {
  onPress: () => void;
}

const MyLocationButton = ({onPress}: MyLocationButtonProps) => {
  // TODO: can not see button
  // TODO: check on press it goes to my current location

  const styles = styleCreator({});
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.mainWrapper}>
      <Image
        source={require('../../../assets/icons/user_location_icon.png')}
        style={styles.image}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

export default MyLocationButton;

const styleCreator = ({}: {}) => StyleSheet.create({
  mainWrapper: {
    position: 'absolute',
    bottom: '41%',
    alignSelf: 'flex-end',
    right: 10,
  },
  image: {width: 30, height: 30},
});
