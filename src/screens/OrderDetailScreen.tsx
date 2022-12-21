import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ClockIcon from './../../assets/images/clockOutline.svg';
import GiftIcon from './../../assets/images/gift.svg';
import DollarIcon from './../../assets/images/dollar.svg';
import PartyHorn from './../../assets/images/party-horn.svg';
import CloseIcon from './../../assets/images/close.svg';
import JumpingIcon from './../../assets/images/jumpingMascot.svg';
import ExcitedIcon from './../../assets/images/excitedMascot.svg';
import CameraIcon from './../../assets/images/camera.svg';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';
interface OrderDetailProps {
  route: any;
  navigation: any;
}

const OrderDetailScreen = ({navigation}: OrderDetailProps) => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState(
    translateText(intl, 'active.content'),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [fourthModal, setFourthModal] = useState(false);
  const [fifthModal, setFifthModal] = useState(false);
  const [sixthModal, setSixthModal] = useState(false);
  const [seventhModal, setSeventhModal] = useState(false);
  const [cashPayment, setCashPayment] = useState(false);
  const [secondRadioBtn, setSecondRadioBtn] = useState(false);
  const [thirdRaddioBtn, setThirdRaddioBtn] = useState(false);
  const [fourthRadioBtn, setFourthRadioBtn] = useState(false);
  const [fifthRadioBtn, setFifthRadioBtn] = useState(false);
  const [cancelOrderSatus, setCancelOrderSatus] = useState(false);

  const foodPhotos = [1, 2, 3, 4, 5, 6];

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo', cameraType: 'back'});
    console.log(result);
    navigation.navigate('SaveOrderScreen', result.assets[0]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listsMain}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            {translateText(intl, 'order.fromDetails')} 12/06/2022{' '}
            {translateText(intl, 'order.in')} 14:30
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>
            {translateText(intl, 'heading.food.corner')}
          </Text>
          <Text style={styles.addressTxt1}>
            {translateText(intl, 'address.location')}:{'   '}
            <Text
              style={[styles.addressTxt1, {textDecorationLine: 'underline'}]}>
              {translateText(intl, 'address.street')}
            </Text>
          </Text>
          <Text style={styles.addressTxt1}>
            {translateText(intl, 'order.phone')}:{'   '}
            <Text
              style={[styles.addressTxt1, {textDecorationLine: 'underline'}]}>
              +359 885 00 42 43
            </Text>
          </Text>
          <View
            style={[
              styles.orderDetailsSec,
              cancelOrderSatus ? {backgroundColor: '#FFE5E5'} : null,
            ]}>
            {cancelOrderSatus ? (
              <Text style={[styles.orderDetailsHeading, {color: '#CF4F4F'}]}>
                {translateText(intl, 'order.cancel')}
              </Text>
            ) : (
              <Text style={styles.orderDetailsHeading}>
                {translateText(intl, 'order.pin')}: 559821
              </Text>
            )}

            <View style={[styles.clockSec, {marginTop: 10}]}>
              <ClockIcon fill={'#fff'} />
              <Text style={styles.clockTxt2}>
                {translateText(intl, 'time.from')} 16:30{' '}
                {translateText(intl, 'time.to')} 17:30
              </Text>
            </View>
            <View style={[styles.clockSec, {marginTop: 15}]}>
              <GiftIcon />
              <Text style={styles.clockTxt1}>
                {translateText(intl, 'order.boxes')}
                <Text style={styles.clockTxt2}>
                  2 {translateText(intl, 'order.quantity')}
                </Text>
              </Text>
            </View>
            <View style={[styles.clockSec, {marginTop: 15}]}>
              <DollarIcon />
              <Text style={styles.clockTxt1}>
                {translateText(intl, 'payment.amount')}:
                <Text style={styles.clockTxt2}>
                  14.00{translateText(intl, 'price.currency')}
                </Text>
              </Text>
            </View>
            <View style={[styles.clockSec, {marginTop: 15}]}>
              <PartyHorn />
              <Text style={styles.clockTxt1}>
                {translateText(intl, 'money.saved')}:{' '}
                <Text style={styles.clockTxt2}>
                  12.00{translateText(intl, 'price.currency')}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.tabsBox}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  setActiveTab(translateText(intl, 'active.content'))
                }>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === translateText(intl, 'active.content')
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  {translateText(intl, 'active.content')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  setActiveTab(translateText(intl, 'active.allergens'))
                }>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === translateText(intl, 'active.allergens')
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  {translateText(intl, 'active.allergens')}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab('Снимки')}>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === 'Снимки'
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  Снимки
                </Text>
              </TouchableOpacity> */}
            </View>
            {activeTab === translateText(intl, 'active.content') ? (
              <View>
                <Text style={styles.tabContentTxt}>
                  {translateText(intl, 'content.lines1')}.{'\n'}
                  {'\n'} {translateText(intl, 'content.lines2')} :)
                </Text>
              </View>
            ) : null}
            {activeTab === translateText(intl, 'active.allergens') ? (
              <View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.3')}
                  </Text>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.13')}
                  </Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.5')}
                  </Text>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.14')}
                  </Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.6')}
                  </Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>
                    {translateText(intl, 'allergens.9')}
                  </Text>
                </View>
              </View>
            ) : null}
            {/* {activeTab === 'Снимки' ? (
              <View>
                <View style={styles.productPhotoSec}>
                  {foodPhotos.map((val, i) => {
                    return (
                      <Image
                        source={require('./../../assets/images/foodPhoto.png')}
                        style={styles.productPhoto}
                        key={i}
                      />
                    );
                  })}
                </View>
              </View>
            ) : null} */}
          </View>

          <TouchableOpacity
            style={styles.toTheResultBtn}
            onPress={() => setFourthModal(true)}>
            <Text style={styles.toTheResultBtnTXt}>
              {translateText(intl, 'box.saved')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.foodPriceTxt}>
              {translateText(intl, 'order.cancel')}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => setSixthModal(true)}
            style={styles.cancelTheOrderBtn}>
            <Text style={styles.cancelTheOrderBtnTxt}>Отмени поръчката</Text>
            <InformationIcon />
          </TouchableOpacity> */}
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
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={[styles.modalHeading, {color: '#CF4F4F'}]}>
              {translateText(intl, 'order.cancellation')}
            </Text>
            <Text style={styles.desTxt}>
              {translateText(intl, 'order.sure.cancel')}
            </Text>
            <View style={styles.firstModalBtns}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  setModalVisible(false);
                  setSecondModal(true);
                }}>
                <Text style={styles.backBtnTxt}>
                  {translateText(intl, 'back.btn')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnTxt}>
                  {translateText(intl, 'password.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModal}
        onRequestClose={() => {
          setSecondModal(!secondModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSecondModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={[styles.modalHeading, {color: '#CF4F4F'}]}>
              {translateText(intl, 'order.cancellation')}
            </Text>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setCashPayment(!cashPayment)}>
              <View style={styles.cashPaymentCheck}>
                {cashPayment ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
              <Text style={styles.cashPaymentTxt}>
                {translateText(intl, 'order.cancellaton.radio1')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setSecondRadioBtn(!secondRadioBtn)}>
              <View style={styles.cashPaymentCheck}>
                {secondRadioBtn ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
              <Text style={styles.cashPaymentTxt}>
                {translateText(intl, 'order.cancellaton.radio2')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setThirdRaddioBtn(!thirdRaddioBtn)}>
              <View style={styles.cashPaymentCheck}>
                {thirdRaddioBtn ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
              <Text style={styles.cashPaymentTxt}>
                {translateText(intl, 'order.cancellaton.radio3')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setFifthRadioBtn(!fourthRadioBtn)}>
              <View style={styles.cashPaymentCheck}>
                {fourthRadioBtn ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
              <Text style={styles.cashPaymentTxt}>
                {translateText(intl, 'order.cancellaton.radio4')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setFifthRadioBtn(!fifthRadioBtn)}>
              <View style={styles.cashPaymentCheck}>
                {fifthRadioBtn ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
              <Text style={styles.cashPaymentTxt}>
                {translateText(intl, 'order.cancellaton.radio5')}
              </Text>
            </TouchableOpacity>
            <View style={styles.firstModalBtns}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  setSecondModal(false);
                  setCancelOrderSatus(true);
                }}>
                <Text style={styles.backBtnTxt}>
                  {translateText(intl, 'back.btn')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnTxt}>
                  {translateText(intl, 'password.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={thirdModal}
        onRequestClose={() => {
          setThirdModal(!thirdModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setThirdModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <JumpingIcon />
            <Text style={[styles.modalHeading, {marginTop: 10}]}>
              Успешна поръчка!
            </Text>
            <Text style={styles.desTxt}>
              Благодаря ти, че избра да спасиш храна с FoodOBox! Вземи кутията
              изненада на място в обекта.
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={fourthModal}
        onRequestClose={() => {
          setFourthModal(!fourthModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setFourthModal(false);
                setFifthModal(true);
              }}>
              <CloseIcon />
            </TouchableOpacity>
            <JumpingIcon />
            <Text
              style={[styles.modalHeading, {marginTop: 10, color: '#79C54A'}]}>
              {translateText(intl, 'rating.modal1.heading')}!
            </Text>
            <Text style={styles.desTxt}>
              {translateText(intl, 'rate.description')}?
            </Text>
            <Rating
              type="custom"
              readonly={false}
              ratingColor="#79C54A"
              startingValue={0}
              ratingBackgroundColor="#fff"
              ratingTextColor="#000"
              ratingCount={5}
              imageSize={25}
              style={{paddingVertical: 0, width: '100%', marginTop: 20}}
            />
          </View>
        </View>
      </Modal>

      {/* RATING MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fifthModal}
        onRequestClose={() => {
          setFifthModal(!fourthModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFifthModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text
              style={[styles.modalHeading, {marginTop: 10, color: '#79C54A'}]}>
              {translateText(intl, 'tell.us')}
            </Text>
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              {translateText(intl, 'rate.food.quality')}
            </Text>
            <Rating
              type="custom"
              ratingColor="#79C54A"
              startingValue={0}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={25}
              // fullSt
              style={{paddingVertical: 0, width: '100%', marginTop: 5}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              {translateText(intl, 'rate.attitude.staff')}
            </Text>
            <Rating
              type="custom"
              ratingColor="#79C54A"
              startingValue={0}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={25}
              style={{paddingVertical: 0, width: '100%', marginTop: 10}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              {translateText(intl, 'rate.food.amount')}
            </Text>
            <Rating
              type="custom"
              ratingColor="#79C54A"
              startingValue={0}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={25}
              style={{paddingVertical: 0, width: '100%', marginTop: 10}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              {translateText(intl, 'rate.service.time')}
            </Text>
            <Rating
              type="custom"
              readonly
              ratingColor="#79C54A"
              startingValue={0}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={25}
              style={{paddingVertical: 0, width: '100%', marginTop: 10}}
            />

            <View style={styles.firstModalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setFifthModal(false)}>
                <Text style={styles.cancelBtnTxt}>
                  {translateText(intl, 'back.btn')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  setFifthModal(false);
                  setSeventhModal(true);
                }}>
                <Text style={styles.backBtnTxt}>
                  {translateText(intl, 'rate.apply.it')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CANCEl ORDER INFORMATION MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sixthModal}
        onRequestClose={() => {
          setSixthModal(!sixthModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSixthModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={[styles.modalHeading, {color: '#CF4F4F'}]}>
              Изтекъл срок за отмяна
            </Text>
            <Text style={styles.desTxt}>
              Според общите условия, имаш право да отмениш поръчка не по-малко
              от 90 минути преди края на прозореца за вземане, за да има време
              друг клиент да спаси храната.
            </Text>
          </View>
        </View>
      </Modal>

      {/* SEVENTH MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={seventhModal}
        onRequestClose={() => {
          setSeventhModal(!seventhModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setSeventhModal(false);
              }}>
              <CloseIcon />
            </TouchableOpacity>
            <ExcitedIcon />
            <Text
              style={[styles.modalHeading, {marginTop: 10, color: '#79C54A'}]}>
              {translateText(intl, 'thanks.for')}
              {'\n'} {translateText(intl, 'thanks.feedback')}!
            </Text>
            <Text style={styles.desTxt}>
              {translateText(intl, 'rate.description')}?
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openCamera()}>
              <CameraIcon />
              <Text style={styles.buttonTxt}>
                {translateText(intl, 'thanks.takeoff.box')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar
        backgroundColor="#ffff"
        translucent={false}
        barStyle="dark-content"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listsMain: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  heading: {
    color: '#182550',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
    width: '90%',
  },
  orderDetailsSec: {
    backgroundColor: '#E6F1E0',
    padding: 20,
    borderRadius: 8,
    marginTop: 30,
  },
  orderDetailsHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#182550',
  },
  clockSec: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 15,
  },
  clockTxt1: {
    color: '#182550',
    fontSize: 14,
    marginLeft: 10,
  },
  clockTxt2: {
    color: '#182550',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
  tabsBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  tab: {
    // borderWidth: 1,
    paddingHorizontal: 5,
    width: '40%',
  },
  tabContentTxt: {
    marginTop: 10,
    color: '#182550',
    fontSize: 12,
  },
  toTheResultBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#79C54A',
    height: 48,
    borderRadius: 8,
    marginTop: 30,
    flexDirection: 'row',
  },
  toTheResultBtnTXt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 5,
  },
  initialPriceTxt: {
    color: '#A6A6A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
  },
  initialPriceValue: {
    color: '#A6A6A6',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  foodPriceTxt: {
    textAlign: 'center',
    color: '#CF4F4F',
    fontSize: 18,
    marginTop: 10,
  },
  allergensContentSec: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  allergensContentTxt: {
    fontSize: 12,
    color: '#182550',
    width: '35%',
  },
  productPhoto: {
    width: 94,
    height: 92,
  },
  productPhotoSec: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
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
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    flexDirection: 'row',
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalHeading: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 16,
    fontWeight: '800',
    width: '70%',
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  addressLabel: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addressTxt: {
    fontSize: 14,
    color: '#182550',
    fontWeight: '700',

    marginTop: 5,
  },
  seeloctionBtn: {
    backgroundColor: '#1E1E1E80',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
    right: 5,
    height: 19,
    width: 96,
    borderRadius: 4,
  },
  seeloctionTxt: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  secondModalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  incAndDecSec: {
    backgroundColor: '#F3F3F3',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 172,
    justifyContent: 'space-between',
    height: 43,
    borderRadius: 172 / 2,
    elevation: 5,
    marginTop: 25,
  },
  increaseBtn: {
    backgroundColor: '#79C54A',
    height: 43,
    width: 41,
    borderTopLeftRadius: 43 / 2,
    borderBottomLeftRadius: 43 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseBtn: {
    backgroundColor: '#A6A6A6',
    height: 43,
    width: 41,
    borderTopRightRadius: 43 / 2,
    borderBottomRightRadius: 43 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusTxt: {
    fontSize: 25,
    color: '#fff',
  },
  itemNumberTxt: {
    fontSize: 18,
    color: '#182550',
    fontWeight: '800',
  },
  totalPaymentSec: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    marginTop: 3,
  },
  totalPaymentLabel: {
    fontSize: 11,
    color: '#182550',
    fontWeight: '600',
  },
  totalPayment: {
    color: '#79C54A',
    fontSize: 18,
    fontWeight: '800',
  },
  saveTxt: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: '700',
  },
  cashPaymentSec: {
    width: '70%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 15,
  },
  cashPaymentTxt: {
    fontSize: 14,
    color: '#182550',
    marginLeft: 10,
  },
  cashPaymentCheck: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#15171F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashPaymentCheckFilled: {
    width: 10,
    height: 10,
    backgroundColor: '#15171F',
    borderRadius: 10 / 2,
  },
  voucherSec: {
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A6A6A6',
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: 40,
  },
  voucherBtn: {
    backgroundColor: '#A6A6A6',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 15,
  },
  voucherInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  voucherBtnTxt: {
    color: '#fff',
    fontSize: 14,
  },
  desTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#182550',
    marginTop: 14,
    width: '80%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerHeading: {
    color: '#182550',
    fontSize: 14,
  },
  addressTxt1: {
    color: '#182550',
    fontSize: 12,
    marginTop: 5,
  },
  firstModalBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  backBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#182550',
    width: '47%',
  },
  backBtnTxt: {
    fontSize: 16,
    color: '#182550',
  },
  cancelBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '47%',
  },
  cancelBtnTxt: {
    fontSize: 16,
    color: '#CF4F4F',
  },
  cancelTheOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTheOrderBtnTxt: {
    fontSize: 16,
    color: '#A6A6A6',
    marginRight: 5,
  },
});

export default OrderDetailScreen;
