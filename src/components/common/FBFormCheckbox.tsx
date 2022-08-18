import React from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {Controller} from "react-hook-form";
import {Text} from 'react-native';
import CheckBox from "@react-native-community/checkbox";
import {Utils} from "../../utils";
import {WEBSITE_TERMS_OF_SERVICE} from "../../network/Server";
import {COLORS} from "../../constants";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

interface FBFormCheckboxProps {
  control: any;
  name: string;
  rules?: object
}

const FBFormCheckbox = (props: FBFormCheckboxProps) => {
  const {
    control, name, rules = {}
  } = props;
  
  const intl = useIntl();

  return (
    <Controller
      control={control}
      rules={rules}
      render={({field: {value, onChange }, fieldState: {error}}) => (
        <>
          <View style={styles.tcWrapper}>
            <View>
              <CheckBox
                boxType={'square'}
                lineWidth={1}
                style={{width: 20, height: 20, marginRight: 10}}
                tintColors={{false: COLORS.white}}
                onFillColor={'#0bd53a'}
                value={value}
                onValueChange={onChange}
              />
            </View>
  
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Text style={{color: '#fff', fontSize: Utils.ios ? 13 : 12}}>
                  {translateText(intl,'signup.agree_with')}
                </Text>
              </View>
  
              <TouchableOpacity onPress={() => Linking.openURL(WEBSITE_TERMS_OF_SERVICE)}>
                <Text
                  style={{color: '#0bd53a', fontSize: Utils.ios ? 13 : 12}}>
                  {translateText(intl,'signup.conditionals')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          { error &&
            <Text style={styles.errorMsg}> {error?.message || 'omg'}</Text>
          }
        </>
      )}
      name={name}
    />
  )
}

export default FBFormCheckbox;

const styles = StyleSheet.create({
  tcWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  errorMsg: {
    color: COLORS.red,
    fontSize: 12
  }
});
