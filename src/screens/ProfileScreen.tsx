import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import BottomTabs from '../components/BottomTabs';

interface ProfileProps {
  route: any;
  navigation: any;
}

const ProfileScreen = ({navigation}: ProfileProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ProfileScreen</Text>
      <BottomTabs navigation={navigation} screenName="ProfileScreen" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
