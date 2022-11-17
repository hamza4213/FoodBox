import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import AppleIcon from './../../assets/images/apple.svg';
import FacebookIcon from './../../assets/images/facebook.svg';
import GoogleIcon from './../../assets/images/google.svg';
import CloseIcon from './../../assets/images/close.svg';
import {images} from '../constants';

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.app_logo} style={styles.logo} />
      <TouchableOpacity style={styles.languageBtn}>
        <Text style={styles.languageBtnTxt}>Български</Text>
        <Image source={images.flagImage} />
      </TouchableOpacity>
      <View style={styles.loginMain}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%'}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Имейл</Text>
            <TextInput
              placeholder="alexandra.j@gmail.com"
              style={styles.input}
              placeholderTextColor="#182550"
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Парола</Text>
            <TextInput
              placeholder="*************"
              style={styles.input}
              placeholderTextColor="#182550"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.forgotBtnTxt}>Забравена парола?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnTxt}>Вход</Text>
          </TouchableOpacity>
          <View style={styles.registerSec}>
            <Text style={styles.registerSecTxt}>Нямаш акаунт?</Text>
            <TouchableOpacity style={styles.registerBtn}>
              <Text style={styles.registerBtnTxt}>Регистрирай се</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.continueTxt}>или продължи с</Text>
          <TouchableOpacity
            style={[styles.facebookBtn, {backgroundColor: '#2C4698'}]}>
            <FacebookIcon />
            <Text style={styles.fbTxt}>Вход с Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.facebookBtn, {backgroundColor: '#882525'}]}>
            <GoogleIcon />
            <Text style={styles.fbTxt}>Вход с Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.facebookBtn, {backgroundColor: '#000000'}]}>
            <AppleIcon />
            <Text style={styles.fbTxt}>Вход с Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn}>
            <Text style={styles.registerTxt}>Продължи без регистрация</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeBtn}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Забравена парола</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textStyle}>Нова парола</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
  },
  logo: {
    width: 146,
    height: 52,
    marginTop: 40,
    alignSelf: 'center',
  },
  languageBtn: {
    borderWidth: 1,
    width: 116,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#FFFFFF80',
    padding: 5,
    borderRadius: 4,
    marginTop: 30,
    alignSelf: 'center',
  },

  languageBtnTxt: {
    color: '#fff',
  },
  loginMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
    // paddingHorizontal: '5%',
  },
  inputView: {
    marginTop: 30,
  },
  inputLabel: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginTop: 5,
    borderColor: '#CCCCCC',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loginBtn: {
    height: 48,
    backgroundColor: '#79C54A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 25,
  },
  loginBtnTxt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  registerSec: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  registerSecTxt: {
    color: '#182550',
    fontSize: 16,
  },
  registerBtn: {
    marginLeft: 5,
  },
  registerBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueTxt: {
    textAlign: 'center',
    marginTop: 30,
    color: '#182550',
  },
  facebookBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 15,
  },
  fbTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomBtn: {
    alignSelf: 'center',
  },
  registerTxt: {
    color: '#CF4F4F',
    fontSize: 16,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    paddingVertical: 15,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalHeading: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
});

export default LoginScreen;
