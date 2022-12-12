import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {images} from '../constants';
import RomaniaFlag from './../../assets/flags/ro.svg';
import EnglishFlag from './../../assets/flags/us.svg';
import BelgarianFlag from './../../assets/flags/bg.svg';
const {height, width} = Dimensions.get('window');
interface language {
  label: string;
  value: string;
  icon: () => JSX.Element;
}
const data = [
  {label: 'English', value: 'English', icon: () => <EnglishFlag />},
  {label: 'Български', value: 'СБългарски', icon: () => <BelgarianFlag />},
  {label: 'Română', value: 'Română', icon: () => <RomaniaFlag />},
];

const SelectLanguageScreen = (props: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState<language>();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.app_logo} style={styles.logo} />
      <Text style={styles.languageTxt}>
        Добре дошъл във Foodobox! Избери език:
      </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="София-град"
        searchPlaceholder="Search..."
        value={selectedLanguage?.value}
        renderRightIcon={selectedLanguage?.icon}
        onChange={item => {
          setSelectedLanguage(item);
        }}
      />
      <TouchableOpacity
        disabled={!selectedLanguage}
        style={styles.nextbtn}
        onPress={() =>
          props.navigation.navigate('LoginScreen', {
            selectedLanguage: selectedLanguage,
          })
        }>
        <Text style={styles.selectedTextStyle}>Next</Text>
      </TouchableOpacity>
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
    fontWeight: '700',
    width: '60%',
    alignSelf: 'center',
    textAlign: 'center',
  },

  dropdown: {
    height: 36,
    backgroundColor: '#182550',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 30,
    width: 144,
    borderWidth: 0.5,
    borderColor: '#FFFFFF80',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  nextbtn: {
    marginTop: 80,
    width: '30%',
    height: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FFFFFF80',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectLanguageScreen;
