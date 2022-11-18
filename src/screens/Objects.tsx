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
} from 'react-native';
import BottomTabs from '../components/BottomTabs';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {RestaurantHomeListItem} from '../models/Restaurant';
import ArrowIcon from './../../assets/images/arrow.svg';
import FilterIcon from './../../assets/images/filterIcon.svg';
import SearchIcon from './../../assets/images/search.svg';
import RefreshIcon from './../../assets/images/refresh.svg';
import HeartIcon from './../../assets/images/heart.svg';

interface ObjectsProps {
  route: any;
  navigation: any;
}

const Objects = ({navigation}: ObjectsProps) => {
  const [activeTab, setActiveTab] = useState('списък');
  const [activeFilter, setActiveFilter] = useState('около мен');
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantHomeListItem | undefined
  >(undefined);

  const filters = ['около мен', 'активни сега', 'любими', 'печива и сладкиши'];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('карта')}
          style={[activeTab === 'карта' ? styles.activeTab : styles.tab]}>
          <Text
            style={[
              styles.tabTxt,
              activeTab === 'карта' ? {color: '#182550'} : {color: '#A6A6A6'},
            ]}>
            карта
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('списък')}
          style={[activeTab === 'списък' ? styles.activeTab : styles.tab]}>
          <Text
            style={[
              styles.tabTxt,
              activeTab === 'списък' ? {color: '#182550'} : {color: '#A6A6A6'},
            ]}>
            списък
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'карта' ? (
        <View style={{flex: 1, marginTop: 3}}>
          <View style={styles.filterSec}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{paddingHorizontal: 10}}>
              <TouchableOpacity style={styles.filterBtn}>
                <FilterIcon />
              </TouchableOpacity>
              {filters.map((val, i) => {
                return (
                  <TouchableOpacity key={i} style={styles.filterTab}>
                    <Text style={styles.filterTabTxt}>{val}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <ClusteredMapView zoomOnRestaurant={selectedRestaurant} />
          <View style={styles.selectedCityMain}>
            <TouchableOpacity style={styles.selectedCityBtn}>
              <ArrowIcon />
              <Text style={styles.selectedCityBtnTxt}>София-град</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedCityBtn}>
              <Text style={styles.selectedCityBtnTxt}>София-град</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {activeTab === 'списък' ? (
        <View style={styles.listsMain}>
          <View style={styles.listSecMain}>
            <View style={styles.searchInput}>
              <SearchIcon />
              <TextInput placeholder="Търси" style={styles.input} />
            </View>
            <TouchableOpacity style={styles.listSearchBtn}>
              <FilterIcon height={21} width={21} />
            </TouchableOpacity>
          </View>
          <View style={styles.lists}>
            <TouchableOpacity style={styles.results}>
              <RefreshIcon width={12} height={12} />
              <Text style={styles.resulTxt}> поднови резултатите</Text>
            </TouchableOpacity>
            <View style={styles.listProduct}>
              <ImageBackground
                style={styles.listImageBackground}
                borderTopLeftRadius={16}
                borderTopRightRadius={16}
                source={{
                  uri: 'https://media.houseandgarden.co.uk/photos/62977da831afd4e1e7dd7930/3:2/w_3401,h_2267,c_limit/JubileeRecipessandwiches_.jpg',
                }}>
                <View style={styles.listTopSec}>
                  <TouchableOpacity style={styles.favouritesIcon}>
                    <HeartIcon width={15} height={14} />
                  </TouchableOpacity>
                  <Text>Food Corner</Text>
                </View>
              </ImageBackground>
            </View>
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
    marginTop: 20,
  },
  activeTab: {
    width: '50%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    elevation: 5,
    borderRadius: 6,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
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
    bottom: 95,
  },
  filterSec: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
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
    backgroundColor: '#fff',
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
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listProduct: {
    backgroundColor: '#FFFFFF',
    height: 113,
    elevation: 10,
    borderRadius: 16,
    marginTop: 20,
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
});

export default Objects;
