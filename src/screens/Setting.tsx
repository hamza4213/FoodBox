import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import LeftIcon from './../../assets/images/chevron-left.svg';
import EditIcon from './../../assets/images/edit.svg';
import RightIcon from './../../assets/images/Chevron-right.svg';
import ShareIcon from './../../assets/images/external-link.svg';
import CloseIcon from './../../assets/images/close.svg';

interface SettingProps {
  route: any;
  navigation: any;
}
const Setting = ({navigation}: SettingProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const userData = [
    {
      value: 'Александра Желева',
      editAble: false,
    },
    {
      value: '+359 888 356590',
      editAble: false,
    },
    {
      value: 'alex.jeleva@gmail.com',
      editAble: false,
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <LeftIcon width={18} height={18} />
        <Text style={styles.backBtnTxt}>Настройки</Text>
      </TouchableOpacity>
      <View style={styles.settingMain}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>лични данни</Text>
          <View style={{marginTop: 20}}>
            {userData.map((val, i) => {
              return (
                <View key={i} style={styles.profileNameSec}>
                  <Text style={styles.profileName}>{val.value}</Text>
                  <EditIcon />
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.profileName}>Промени парола</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>Изтрий профила си</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.heading, {marginTop: 25}]}>
            настройки на апликацията
          </Text>
          <View style={{marginTop: 10}}>
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>Нотификации</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>
                Получаване на имейл известия
              </Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.heading, {marginTop: 25}]}>Информация</Text>
          <View style={{marginTop: 10}}>
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => navigation.navigate('FAQ')}>
              <Text style={styles.profileName}>Често задавани въпроси</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => navigation.navigate('GeneralTerms')}>
              <Text style={styles.profileName}>Общи условия</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>Регистрирай бизнеса си</Text>
              <ShareIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>Свържи се с нас</Text>
              <ShareIcon />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Смяна на парола</Text>
            <View style={styles.modalInputView}>
              <Text style={styles.inputLabel}>текуща парола</Text>
              <TextInput
                placeholder=""
                style={styles.modalInput}
                placeholderTextColor="#182550"
                secureTextEntry={true}
              />
            </View>
            <View style={styles.modalInputView}>
              <Text style={styles.inputLabel}>нова парола</Text>
              <TextInput
                placeholder=""
                style={styles.modalInput}
                placeholderTextColor="#182550"
                secureTextEntry={true}
              />
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.cancelBtnTxt}>Отмени</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.buttonTxt}>Запази</Text>
              </TouchableOpacity>
            </View>
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
  settingMain: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    paddingTop: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  backBtnTxt: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
  heading: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  profileNameSec: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
    borderRadius: 8,
    marginTop: 6,
    paddingHorizontal: 10,
  },
  profileName: {
    color: '#182550',
    fontSize: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
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
  emailSendTxt: {
    textAlign: 'center',
    color: '#000000',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    height: 30,
    borderColor: '#CCCCCC',
  },
  modalInputView: {
    marginTop: 15,
    width: '90%',
    alignSelf: 'center',
  },
  inputLabel: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
  },
  cancelBtnTxt: {
    color: '#CF4F4F',
    fontSize: 16,
  },
});

export default Setting;
