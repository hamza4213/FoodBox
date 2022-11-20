import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SettingIcon from './../../assets/images/setting.svg';
import ProfileIcon from './../../assets/images/profile.svg';
import TrashIcon from './../../assets/images/trash.svg';
import BoxIcon from './../../assets/images/BOX-open.svg';
import SmokeIcon from './../../assets/images/smoke.svg';
import BottomTabs from '../components/BottomTabs';

interface ProfileProps {
  route: any;
  navigation: any;
}

const ProfileScreen = ({navigation}: ProfileProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Профил</Text>
        <TouchableOpacity>
          <SettingIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.profileMain}>
        <ScrollView contentContainerStyle={{paddingBottom: 30}}>
          <View style={styles.profileIconMain}>
            <ProfileIcon />
          </View>
          <Text style={styles.userNameTxt}>Александра Желева</Text>
          <View style={{marginTop: 20}}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: '5%',
                paddingVertical: 10,
              }}>
              <TouchableOpacity style={styles.box}>
                <BoxIcon />
                <Text style={styles.boxTxt1}>Брой спасени кутии</Text>
                <Text style={styles.boxTxt2}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <TrashIcon />
                <Text style={styles.boxTxt1}>Количество спасена храна</Text>
                <Text style={styles.boxTxt2}>4 кг</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <SmokeIcon />
                <Text style={styles.boxTxt1}>Спестени СО2 емисии</Text>
                <Text style={styles.boxTxt2}>35 кг</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <BoxIcon />
                <Text style={styles.boxTxt1}>Спестени пари за храна</Text>
                <Text style={styles.boxTxt2}>6</Text>
              </TouchableOpacity>
            </ScrollView>
            <Text style={styles.levelTxt}>Достигнато ниво</Text>
            <Text style={styles.level}>Ангажиран милениъл</Text>
            <Text style={styles.openBoxTxt}>
              Спаси още 4 кутии, за да отключиш наградите, които{'\n'}те очакват
              на следващото ниво!
            </Text>
            <TouchableOpacity style={styles.exitBtn}>
              <Text style={styles.exitBtnTxt}>Изход</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, {marginTop: 25}]}>
              <Text style={styles.contactBtnTxt}>Свържи се с нас</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Text style={styles.contactBtnTxt}>Общи условия</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomTabs navigation={navigation} screenName="ProfileScreen" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  headerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // marginTop: 10,
  },
  profileIconMain: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  userNameTxt: {
    textAlign: 'center',
    fontSize: 20,
    color: '#182550',
    marginTop: 25,
  },
  box: {
    backgroundColor: '#182550',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 105,
    borderRadius: 12,
    marginRight: 5,
  },
  boxTxt1: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
  boxTxt2: {
    color: '#79C54A',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 7,
    fontWeight: '800',
  },
  levelTxt: {
    color: '#A6A6A6',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 20,
  },
  level: {
    color: '#79C54A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    // marginTop: 5,
  },
  openBoxTxt: {
    color: '#182550',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 10,
    // width: '80%',
    // alignSelf: 'center',
  },
  exitBtn: {
    alignSelf: 'center',
    marginTop: 50,
  },
  exitBtnTxt: {
    color: '#CF4F4F',
  },
  contactBtn: {
    alignSelf: 'center',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#182550',
  },
  contactBtnTxt: {
    color: '#182550',
    fontSize: 12,
  },
});

export default ProfileScreen;
