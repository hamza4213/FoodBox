import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import CloseIcon from './../../assets/images/closeBlue.svg';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';
interface GeneralTremsProps {
  route: any;
  navigation: any;
}

const GeneralTerms = ({navigation}: GeneralTremsProps) => {
  const intl = useIntl();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            {translateText(intl, 'terms.heading')}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeading}>
          {translateText(intl, 'terms.definition')}
        </Text>
        <Text style={styles.termsTxt}>
          {translateText(intl, 'terms.paragraph1')}
          {'\n'}
          {'\n'}
          {translateText(intl, 'terms.paragraph2')}
          {'\n'}
          {'\n'}
          {translateText(intl, 'terms.paragraph3')}
          {'\n'}
          {'\n'}
          {translateText(intl, 'terms.paragraph4')}
          {'\n'}
          {'\n'}
          {translateText(intl, 'terms.paragraph5')}.
        </Text>
      </ScrollView>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  headerHeading: {
    color: '#182550',
    fontSize: 20,
  },
  subHeading: {
    fontSize: 16,
    marginTop: 20,
    color: '#182550',
  },
  termsTxt: {
    marginTop: 15,
    color: '#182550',
  },
});

export default GeneralTerms;
