import React from "react";
import {ActivityIndicator, Modal, SafeAreaView, StyleSheet, View} from "react-native";

export interface FBSpinnerProps {
  isVisible: boolean
}

const FBSpinner = ({isVisible}:FBSpinnerProps ) => {
  const styles = stylesCreator();
  return (
    <Modal visible={isVisible} transparent={true}>
      <SafeAreaView
        style={styles.mainWrapper}>
        <View
          style={styles.indicatorWrapper}>
          <View style={styles.indicator}>
            <ActivityIndicator 
              animating={isVisible}
              size="large" 
              color="#10D53A" 
              hidesWhenStopped={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default FBSpinner;

const stylesCreator = () => StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  indicatorWrapper: {
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  indicator: {
    flex: 1, 
    alignSelf: 'center',
  }
});
