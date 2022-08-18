import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

interface FBButtonProps {
  onClick: () => void,
  title: string,
  backgroundColor?: string
}

const FBButton = ({onClick, title, backgroundColor = '#0bd53a'}: FBButtonProps) => {

  return (
    <TouchableOpacity
      style={[fbButtonStyles.container, {backgroundColor: backgroundColor}]}
      onPress={onClick}>
      <View>
        <Text style={fbButtonStyles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};


const fbButtonStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 40,
    height: 44,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
  },
  title: {
    color: '#fff'
  }
});

export default FBButton;
