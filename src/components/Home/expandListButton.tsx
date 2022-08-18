import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import {icons} from "../../constants";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

export interface ExpandListButtonProps {
  isFullScreen: boolean,
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>
}

const ExpandListButton = ({isFullScreen, setIsFullScreen}: ExpandListButtonProps) => {
  
  // TODO: make touchable area bigger so that its easier to press
  const intl = useIntl();
  const styles = styleCreator({});
  
  return (
    <TouchableOpacity style={styles.mainWrapper} onPress={() => {
      setIsFullScreen(!isFullScreen);
    }}>
      {!isFullScreen ? (
        <Text style={styles.text}>
          {translateText(intl,'home.list_object')}
        </Text>
      ) : (
        <Text style={styles.text}>
          {translateText(intl,'home.list_expand')}
        </Text>
      )}

      {!isFullScreen ? (
        <Image
          source={icons.arrow_up}
          style={styles.image}
        />
      ) : (
        <Image
          source={icons.arrow_down}
          style={styles.image}
        />
      )}
    </TouchableOpacity>
  )
}

export default ExpandListButton;

const styleCreator = ({}:{}) => StyleSheet.create({
  mainWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {fontSize: 12, fontWeight: '700'},
  image: {width: 10, height: 10, marginLeft: 5}
});
