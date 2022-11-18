import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import BottomTabs from '../components/BottomTabs';

interface LovedOnesProps {
  route: any;
  navigation: any;
}

const LovedOnes = ({navigation}: LovedOnesProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>LovedOnes</Text>
      <BottomTabs navigation={navigation} screenName="LovedOnes" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LovedOnes;
