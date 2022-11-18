import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import BottomTabs from '../components/BottomTabs';

interface OrdersProps {
  route: any;
  navigation: any;
}

const Orders = ({navigation}: OrdersProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Orders</Text> */}
      <BottomTabs navigation={navigation} screenName="Orders" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Orders;
