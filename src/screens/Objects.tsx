import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  TabBarIOSItem,
} from 'react-native';
import BottomTabs from '../components/BottomTabs';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {RestaurantHomeListItem, RestaurantMapper} from '../models/Restaurant';
import ArrowIcon from './../../assets/images/arrow.svg';
import FilterIcon from './../../assets/images/filterIcon.svg';
import SearchIcon from './../../assets/images/search.svg';
import RefreshIcon from './../../assets/images/refresh.svg';
import HeartIcon from './../../assets/images/heart.svg';
import BoxIcon from './../../assets/images/box.svg';
import AsyncStorage from '@react-native-community/async-storage';
import axiosClient from '../network/axiosClient';
import {useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {API_ENDPOINT_RESTAURANT_PHOTOS} from '../network/Server';
import moment from 'moment';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';
interface ObjectsProps {
  route: any;
  navigation: any;
}
interface getRestaurantsWithProductResponse {
  success: boolean;
  restaurants: object[];
}

const Objects = ({navigation}: ObjectsProps) => {
  const intl = useIntl();

  const [activeTab, setActiveTab] = useState(
    translateText(intl, 'active.tab1'),
  );
  const [selectedType, setSelectedType] = useState<string>();
  const [activeFilter, setActiveFilter] = useState('около мен');
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantHomeListItem | undefined
  >(undefined);
  const userLocation = useSelector(
    (state: FBRootState) => state.userState.userLocation,
  );
  const [restaurants, setRestaurants] = useState([]);
  const [resturantsarray, setResturantsarray] = useState([]);
  const filters = ['около мен', 'активни сега', 'любими', 'печива и сладкиши'];
  const productsList = [1, 2, 3, 4, 5, 6];
  const [loading, setLoading] = useState(false);
  const getRestaurants = async () => {
    try {
      console.log('inside Objects');
      setLoading(true);
      const url = '/user/restaurants?getProducts=true';
      const userToken = await AsyncStorage.getItem('AUTH_DATA_KEY');

      const response: getRestaurantsWithProductResponse = await axiosClient.get(
        url,
        {
          headers: {
            'x-access-token': userToken,
          },
        },
      );
      let restaurantList = [];
      response.restaurants.map((r: any, i: any) => {
        if (i === 0 || i == 7) {
          console.log(r);
        }
        restaurantList.push(RestaurantMapper.fromApi(r));
      });
      setRestaurants(restaurantList);
      setResturantsarray(restaurantList);
      setLoading(false);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  useEffect(() => {
    getRestaurants();
  }, []);
  const Search = (text: string) => {
    if (text) {
      const newData = restaurants.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setRestaurants(newData);
    } else {
      setLoading(true);
      setRestaurants(resturantsarray);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab(translateText(intl, 'active.tab1'))}
          style={[
            activeTab === translateText(intl, 'active.tab1')
              ? styles.activeTab
              : styles.tab,
          ]}>
          <Text
            style={[
              styles.tabTxt,
              activeTab === translateText(intl, 'active.tab1')
                ? {color: '#182550'}
                : {color: '#A6A6A6'},
            ]}>
            {translateText(intl, 'active.tab1')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(translateText(intl, 'active.tab2'))}
          style={[
            activeTab === translateText(intl, 'active.tab2')
              ? styles.activeTab
              : styles.tab,
          ]}>
          <Text
            style={[
              styles.tabTxt,
              activeTab === translateText(intl, 'active.tab2')
                ? {color: '#182550'}
                : {color: '#A6A6A6'},
            ]}>
            {translateText(intl, 'active.tab2')}
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === translateText(intl, 'active.tab2') ? (
        <View style={{flex: 1, marginTop: 3}}>
          <View style={styles.filterSec}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{paddingHorizontal: 10}}>
              <TouchableOpacity
                onPress={() => setSelectedType()}
                style={styles.filterBtn}>
                <FilterIcon />
              </TouchableOpacity>
              {restaurants.map((val, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedType(val.name)}
                    style={[
                      styles.filterTab,
                      {
                        backgroundColor:
                          selectedType === val.name ? '#79C54A' : '#fff',
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: selectedType === val.name ? '#fff' : '#000',
                      }}>
                      {val.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <ClusteredMapView
            zoomOnRestaurant={restaurants}
            selectedType={selectedType}
          />
          <View style={styles.selectedCityMain}>
            <TouchableOpacity style={styles.selectedCityBtn}>
              <ArrowIcon />
              <Text style={styles.selectedCityBtnTxt}>
                {translateText(intl, 'sofia.city')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedCityBtn}>
              <Text style={styles.selectedCityBtnTxt}>
                {translateText(intl, 'sofia.city')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {activeTab === translateText(intl, 'active.tab1') ? (
        <View style={styles.listsMain}>
          <View style={styles.listSecMain}>
            <View style={styles.searchInput}>
              <SearchIcon />
              <TextInput
                returnKeyType="search"
                placeholder={translateText(intl, 'search.restaurant')}
                style={styles.input}
                // onChangeText={text => Search(text)}
                onSubmitEditing={e => Search(e.nativeEvent.text)}
              />
            </View>
            <TouchableOpacity
              style={styles.listSearchBtn}
              onPress={() => navigation.navigate('FilterScreen')}>
              <FilterIcon height={21} width={21} />
            </TouchableOpacity>
          </View>
          <View style={styles.lists}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 50}}>
              <TouchableOpacity onPress={getRestaurants} style={styles.results}>
                <RefreshIcon width={12} height={12} />
                <Text style={styles.resulTxt}>
                  {translateText(intl, 'refresh.restaurant')}
                </Text>
              </TouchableOpacity>
              {loading && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#79C54A" />
                </View>
              )}
              {restaurants?.map((val, i) => {
                return (
                  <TouchableOpacity
                    style={styles.listProduct}
                    onPress={() =>
                      navigation.navigate('Offer', {
                        restaurant: val,
                        userLocation: userLocation,
                        box: val.boxes[0],
                      })
                    }>
                    <TouchableOpacity style={styles.discountBtn}>
                      <Text style={styles.discountBtnTxt}>
                        -{val?.boxes[0]?.discount}%
                      </Text>
                    </TouchableOpacity>
                    <ImageBackground
                      style={styles.listImageBackground}
                      borderTopLeftRadius={16}
                      borderTopRightRadius={16}
                      source={{
                        uri:
                          API_ENDPOINT_RESTAURANT_PHOTOS +
                          val.thumbnailCoverImage,
                      }}>
                      {/* // require('./../../assets/images/productImage1.png') */}

                      <View style={styles.listTopSec}>
                        <TouchableOpacity style={styles.favouritesIcon}>
                          <HeartIcon width={15} height={14} />
                        </TouchableOpacity>
                        <Text style={styles.productName}>{val.name}</Text>
                      </View>
                      <View style={styles.productItems}>
                        {val.boxes.map((box: any, index: any) => {
                          return (
                            <View style={styles.productItemsBox}>
                              <Text style={styles.productItemsBoxTxt}>
                                {box.foodType}
                              </Text>
                            </View>
                          );
                        })}
                        {/* <View style={styles.productItemsBox}>
                          <Text style={styles.productItemsBoxTxt}>
                            сандвичи
                          </Text>
                        </View>
                        <View style={styles.productItemsBox}>
                          <Text style={styles.productItemsBoxTxt}>кафе</Text>
                        </View> */}
                      </View>
                      <View style={styles.priceSec}>
                        <Text style={styles.oldPriceTxt}>
                          12.50
                          {translateText(intl, 'price.currency')}
                        </Text>
                        {/* {val.boxes?.map((box: any, index: any) => {
                          return ( */}
                        <Text style={styles.newPriceTxt}>
                          {val.boxes[0].price}
                          {translateText(intl, 'price.currency')}
                        </Text>
                        {/* );
                        })} */}
                      </View>
                    </ImageBackground>
                    {/* {val.boxes.map((item: any, index: any) => {
                      return ( */}
                    <View style={styles.listProductBottomSec}>
                      <Text style={styles.timeTxt}>
                        {`${translateText(intl, 'get.from')} ${moment(
                          val.boxes[0].pickUpFrom,
                        ).format('HH:mm')}${translateText(
                          intl,
                          'time.h',
                        )}. ${translateText(intl, 'time.to')} ${moment(
                          val.boxes[0].pickUpTo,
                        ).format('HH:mm')}${translateText(intl, 'time.h')}.`}
                      </Text>
                      <View style={styles.timeSec}>
                        <BoxIcon />
                        <Text style={styles.timeToOpenTxt}>
                          {val.boxes[0].isOpen
                            ? `${translateText(
                                intl,
                                'open.from',
                              )} 2 ${translateText(intl, 'open.till')}`
                            : 'Closed'}
                        </Text>
                      </View>
                    </View>
                    {/* );
                    })} */}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      ) : null}
      <BottomTabs navigation={navigation} screenName="Objects" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 1,
    bottom: 100,
    backgroundColor: '#fff',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  activeTab: {
    width: '50%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
    elevation: 5,
    borderRadius: 6,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 37,
  },
  tabTxt: {
    fontSize: 14,
  },

  selectedCityBtn: {
    backgroundColor: '#79C54A',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectedCityBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  selectedCityMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 10,
  },
  filterSec: {
    position: 'absolute',
    zIndex: 1,
    top: 60,
  },
  filterBtn: {
    width: 34,
    height: 30,
    backgroundColor: '#182550',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34 / 2,
  },
  filterTab: {
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: '#182550',
    marginLeft: 10,
  },
  filterTabTxt: {
    // color: '#182550',
    fontSize: 14,
  },
  listsMain: {
    flex: 1,
    backgroundColor: '#182550',
  },
  listSecMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '85%',
    alignSelf: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  input: {
    flex: 1,
    marginLeft: 5,
  },
  listSearchBtn: {},
  lists: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingHorizontal: '3%',
  },
  results: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  resulTxt: {
    color: '#182550',
    fontSize: 12,
  },
  listImageBackground: {
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listProduct: {
    backgroundColor: '#FFFFFF',
    height: 175,
    elevation: 5,
    borderRadius: 16,
    marginTop: 35,
  },
  favouritesIcon: {
    backgroundColor: '#00000070',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25 / 2,
  },
  listTopSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
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
    marginTop: 20,
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
  listProductBottomSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  timeSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeTxt: {
    color: '#182550',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 8,
  },
  timeToOpenTxt: {
    color: '#182550',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 5,
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
});

export default Objects;
