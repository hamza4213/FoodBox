import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import {images} from '../constants';

const {height, width} = Dimensions.get('window');

const SelectLanguageScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.app_logo} style={styles.logo} />
      <Text style={styles.languageTxt}>
        Добре дошъл във Foodobox! Избери език:
      </Text>
      {/* <RNPickerSelect
        onValueChange={value => console.log(value)}
        items={[
          {label: 'Football', value: 'football'},
          {label: 'Baseball', value: 'baseball'},
          {label: 'Hockey', value: 'hockey'},
        ]}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
    alignItems: 'center',
  },
  logo: {
    width: 146,
    height: 52,
    marginTop: 40,
  },
  languageTxt: {
    color: '#fff',
    fontSize: 14,
    marginTop: height / 3.5,
  },
});

export default SelectLanguageScreen;
