import React, {useState} from 'react';
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
import PlusIcon from './../../assets/images/plusIcon.svg';
import MinusIcon from './../../assets/images/minus.svg';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';

interface FAQProps {
  route: any;
  navigation: any;
}

const FAQ = ({navigation}: FAQProps) => {
  const intl = useIntl();
  const [faqContent, setFaqContent] = useState([
    {
      title: translateText(intl, 'faq.title1'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title2'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title3'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title4'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title5'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title6'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title7'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title8'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
    {
      title: translateText(intl, 'faq.title9'),
      open: false,
      content: translateText(intl, 'faq.content1'),
    },
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 30, paddingHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            {translateText(intl, 'faq.heading')}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          {faqContent.map((val, i) => {
            return (
              <View key={i} style={styles.accordian}>
                <TouchableOpacity
                  style={styles.accordianHeader}
                  activeOpacity={0.8}
                  onPress={() => {
                    faqContent[i].open = !faqContent[i].open;
                    setFaqContent([...faqContent]);
                  }}>
                  <Text style={styles.accordianTitle}>{val.title}</Text>
                  {val.open ? <MinusIcon /> : <PlusIcon />}
                </TouchableOpacity>
                {val.open ? (
                  <Text style={styles.termsTxt}>{val.content}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
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
  accordianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    // marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  accordian: {
    marginTop: 15,
  },
  accordianTitle: {
    flex: 1,
    fontWeight: '700',
    color: '#182550',
    fontSize: 14,
    marginRight: 5,
  },
});

export default FAQ;
