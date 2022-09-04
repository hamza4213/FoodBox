import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {Utils} from '../utils';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {RestaurantUpdateFiltersAction, restaurantUpdateFiltersAction} from '../redux/restaurant/actions';
import {FBRootState} from '../redux/store';
import DatePicker from 'react-native-date-picker';
import {DietType, FoodType} from '../models/FoodBox';
import FilterButton from '../components/Filters/filterButton';
import {icons} from '../constants';
import {analyticsFilterChange, analyticsPageOpen} from '../analytics';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';

const Filter = ({navigation}: { navigation: any }) => {

  const dispatch = useDispatch();

  const newFilters = useSelector((state: FBRootState) => state.restaurantState.filters);

  const [isRestaurantOpen, setIsRestaurantOpen] = useState(newFilters.isRestaurantOpen.isOpen);
  const [hasRestaurantAvailableBoxes, setHasRestaurantAvailableBoxes] = useState(newFilters.hasRestaurantAvailableBoxes.hasAvailableBoxes);
  const [isNotFinished, setIsNotFinished] = useState(newFilters.isNotFinished.isNotFinished);
  const [canCheckout, setCanCheckout] = useState(newFilters.canCheckout.canCheckout);

  const [pickUpStartTimeLowerLimit, setPickUpStartTimeLowerLimit] = useState(moment(newFilters.pickUpPeriod.pickUpStartTimeLowerLimit).toDate());
  const [pickUpStartTimeLowerLimitOpen, setPickUpStartTimeLowerLimitOpen] = useState(false);

  const [pickUpEndTimeUpperLimit, setPickUpEndTimeUpperLimit] = useState(moment(newFilters.pickUpPeriod.pickUpEndTimeUpperLimit).toDate());
  const [pickUpEndTimeUpperLimitOpen, setPickUpEndTimeUpperLimitOpen] = useState(false);

  const [dietTypes, setDietTypes] = useState(newFilters.dietType.types);
  const [foodTypes, setFoodTypes] = useState(newFilters.foodType.types);

  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const intl = useIntl();

  const newApplyFilter = (data: RestaurantUpdateFiltersAction['data']) => {
    dispatch(restaurantUpdateFiltersAction(data));
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: user.id, email: user.email, pageName: 'Filter'});
    });
  }, [navigation]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    analyticsFilterChange({userId: user.id, email: user.email, filters: newFilters});
  }, [newFilters]);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            borderRadius: 10,
            shadowOpacity: 0.2,
            shadowOffset: {height: 1, width: 1},
            backgroundColor: '#fff',
            marginTop: 20,
          }}
        >

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.restaurant_open')}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{false: 'grey', true: '#9ede9c'}}
                thumbColor={isRestaurantOpen ? '#10D53A' : '#f4f3f4'}
                ios_backgroundColor="grey"
                onValueChange={(newValue) => {
                  newApplyFilter({filterCategory: 'isRestaurantOpen', filterCategoryProperty: 'isOpen', newValue});
                  setIsRestaurantOpen(newValue);
                }}
                value={isRestaurantOpen}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.has_available_boxes')}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{false: 'grey', true: '#9ede9c'}}
                thumbColor={hasRestaurantAvailableBoxes ? '#10D53A' : '#f4f3f4'}
                ios_backgroundColor="grey"
                onValueChange={(newValue) => {
                  newApplyFilter({
                    filterCategory: 'hasRestaurantAvailableBoxes',
                    filterCategoryProperty: 'hasAvailableBoxes',
                    newValue,
                  });
                  setHasRestaurantAvailableBoxes(newValue);
                }}
                value={hasRestaurantAvailableBoxes}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.is_not_finished')}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{false: 'grey', true: '#9ede9c'}}
                thumbColor={isNotFinished ? '#10D53A' : '#f4f3f4'}
                ios_backgroundColor="grey"
                onValueChange={(newValue) => {
                  newApplyFilter({filterCategory: 'isNotFinished', filterCategoryProperty: 'isNotFinished', newValue});
                  setIsNotFinished(newValue);
                }}
                value={isNotFinished}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.can_checkout')}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{false: 'grey', true: '#9ede9c'}}
                thumbColor={canCheckout ? '#10D53A' : '#f4f3f4'}
                ios_backgroundColor="grey"
                onValueChange={(newValue) => {
                  newApplyFilter({filterCategory: 'canCheckout', filterCategoryProperty: 'canCheckout', newValue});
                  setCanCheckout(newValue);
                }}
                value={canCheckout}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.time_range_start')}
              </Text>
            </View>
            <View style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: 30,
              width: 100,
              paddingRight: 5,
            }}>
              <TouchableOpacity
                onPress={() => setPickUpStartTimeLowerLimitOpen(true)}
              >
                <Text>{moment(pickUpStartTimeLowerLimit).format('HH:mm')}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={pickUpStartTimeLowerLimitOpen}
                date={pickUpStartTimeLowerLimit}
                mode="time"
                onConfirm={(date) => {
                  setPickUpStartTimeLowerLimitOpen(false);
                  setPickUpStartTimeLowerLimit(date);
                  newApplyFilter({
                    filterCategory: 'pickUpPeriod',
                    filterCategoryProperty: 'pickUpStartTimeLowerLimit',
                    newValue: date.getTime(),
                  });
                }}
                onCancel={() => {
                  setPickUpStartTimeLowerLimitOpen(false);
                }}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.time_range_end')}
              </Text>
            </View>
            <View style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: 30,
              width: 100,
              paddingRight: 5,
            }}>
              <TouchableOpacity
                onPress={() => setPickUpEndTimeUpperLimitOpen(true)}
              >
                <Text>{moment(pickUpEndTimeUpperLimit).format('HH:mm')}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={pickUpEndTimeUpperLimitOpen}
                date={pickUpEndTimeUpperLimit}
                mode="time"
                onConfirm={(date) => {
                  setPickUpEndTimeUpperLimitOpen(false);
                  setPickUpEndTimeUpperLimit(date);
                  newApplyFilter({
                    filterCategory: 'pickUpPeriod',
                    filterCategoryProperty: 'pickUpEndTimeUpperLimit',
                    newValue: date.getTime(),
                  });
                }}
                onCancel={() => {
                  setPickUpEndTimeUpperLimitOpen(false);
                }}
              />
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.food_type')}
              </Text>
            </View>
            <View style={{
              maxWidth: 200,
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
              {Object.keys(FoodType).map((key) => {
                if (isNaN(Number(key))) {
                  // the key is a FoodType not an index
                  const filterName = key.toString().toLocaleLowerCase();
                  // @ts-ignore
                  const value = FoodType[key];
                  const isActive = foodTypes.includes(value);
                  return (
                    <FilterButton
                      key={value}
                      onPress={() => {
                        let newFoodTypes = [...foodTypes];
                        if (isActive) {
                          newFoodTypes = newFoodTypes.filter(i => i !== value);
                        } else {
                          newFoodTypes.push(value);
                        }
                        setFoodTypes(newFoodTypes);
                        newApplyFilter({
                          filterCategory: 'foodType',
                          filterCategoryProperty: 'types',
                          newValue: newFoodTypes,
                        });
                      }}
                      // @ts-ignore
                      icon={icons[filterName]}
                      title={translateText(intl, `filter.${filterName}`)}
                      active={isActive}
                    />
                  );
                }
              })}
            </View>
          </View>

          <View style={styles.activeFilterWrapper}>
            <View>
              <Text style={styles.filterHeadingText}>
                {translateText(intl, 'filter.diet_type')}
              </Text>
            </View>
            <View style={{
              maxWidth: 200,
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
              {Object.keys(DietType).map((key) => {
                if (isNaN(Number(key))) {
                  // the key is a FoodType not an index
                  const filterName = key.toString().toLocaleLowerCase();
                  // @ts-ignore
                  const value = DietType[key];
                  const isActive = dietTypes.includes(value);
                  return (
                    <FilterButton
                      key={value}
                      onPress={() => {
                        let newDietTypes = [...dietTypes];
                        if (isActive) {
                          newDietTypes = newDietTypes.filter(i => i !== value);
                        } else {
                          newDietTypes.push(value);
                        }
                        setDietTypes(newDietTypes);
                        newApplyFilter({
                          filterCategory: 'dietType',
                          filterCategoryProperty: 'types',
                          newValue: newDietTypes,
                        });
                      }}
                      // @ts-ignore
                      icon={icons[filterName]}
                      title={translateText(intl, `filter.${filterName}`)}
                      active={isActive}
                    />
                  );
                }
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {flex: 1, marginHorizontal: 10},
  activeFilterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingBottom: 4,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  text_time: {
    alignSelf: 'center',
    paddingVertical: 20,
    fontWeight: '500',
    color: '#29455f',
    fontSize: 20,
  },
  filter: {
    borderRadius: Utils.width / 3,
    shadowOpacity: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Utils.width / 3,
    height: Utils.width / 3,
    backgroundColor: '#fff',
  },
  filterHeadingText: {
    fontWeight: '500',
    color: '#29455f',
  },
});

export default Filter;
