import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  StatusBar,
} from 'react-native';
import HeartIcon from './../../assets/images/heart.svg';
import BackIcon from './../../assets/images/chevron-left.svg';

interface ProductDetailProps {
  route: any;
  navigation: any;
}

const ProductDetail = ({navigation}: ProductDetailProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity style={styles.discountBtn}>
        <Text style={styles.discountBtnTxt}>-40%</Text>
      </TouchableOpacity> */}
      <ImageBackground
        style={styles.listImageBackground}
        source={require('./../../assets/images/productIMage.png')}>
        <View style={styles.listTopSec}>
          <TouchableOpacity style={styles.backBtn}>
            <BackIcon />
            <Text style={styles.backBtnTxt}>Назад</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favouritesIcon}>
            <HeartIcon width={15} height={14} />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>Food Corner</Text>
        <View style={styles.timerBtn}>
          <Text style={styles.timerBtnTxt1}>Офертата започва след</Text>
          <Text style={styles.timerBtnTxt2}> 04:46:07</Text>
        </View>
        <View style={styles.productItems}>
          <View style={styles.productItemsBox}>
            <Text style={styles.productItemsBoxTxt}>палачинки</Text>
          </View>
          <View style={styles.productItemsBox}>
            <Text style={styles.productItemsBoxTxt}>сандвичи</Text>
          </View>
          <View style={styles.productItemsBox}>
            <Text style={styles.productItemsBoxTxt}>кафе</Text>
          </View>
        </View>
        <View style={styles.priceSec}>
          <Text style={styles.oldPriceTxt}>12.50лв</Text>
          <Text style={styles.newPriceTxt}>7.00лв</Text>
        </View>
      </ImageBackground>

      <View style={styles.listsMain}></View>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listsMain: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    marginTop: -120,
  },

  listImageBackground: {
    height: 309,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listProduct: {
    backgroundColor: '#FFFFFF',
    elevation: 10,
    borderRadius: 16,
  },
  favouritesIcon: {
    backgroundColor: '#00000070',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42 / 2,
  },
  listTopSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  productItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  productItemsBox: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  productItemsBoxTxt: {
    color: '#fff',
    fontSize: 10,
  },
  priceSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
    alignSelf: 'center',
    marginTop: 10,
  },
  oldPriceTxt: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '200',
  },
  newPriceTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  discountBtn: {
    backgroundColor: '#79C54A',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 22,
    borderRadius: 55 / 2,
    position: 'absolute',
    zIndex: 1,
    right: 30,
    top: -11,
  },
  discountBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backBtnTxt: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBtn: {
    backgroundColor: '#182550',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    height: 25,
    marginTop: 10,
  },
  timerBtnTxt1: {
    color: '#fff',
  },
  timerBtnTxt2: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ProductDetail;
