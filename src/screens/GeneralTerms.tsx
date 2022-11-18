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

interface GeneralTremsProps {
  route: any;
  navigation: any;
}

const GeneralTerms = ({navigation}: GeneralTremsProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>Общи условия</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeading}>ДЕФИНИЦИИ</Text>
        <Text style={styles.termsTxt}>
          Фуудобокс – “Фуудобокс 2021 ЕООД”, ЕИК 2065757546, със седалище и
          адрес на управление: гр. София, 1000, ул. Неофит Рилски 57, ет2, ап4,
          представлявано от управителя Джейн Димитрова Димитрова, която
          притежава и администрира Сайта.{'\n'}
          {'\n'}
          Купувачи – физически лица, които желаят да използват Услугите,
          предоставяни чрез Мобилното приложение и които имат Профил в Мобилното
          приложение. Купувачи могат да бъдат дееспособни физически лица на
          възраст 14 години или повече. На малолетни лица не се позволява да
          използват Услугите, предлагани чрез Мобилното приложение. Лица, които
          не отговарят на изискванията за Купувач нямат право да ползват
          Услугите, предоставяни на Мобилното приложение.{'\n'}
          {'\n'}
          Мобилно приложение – мобилното приложение Foodobox, което е
          собственост на Фуудобокс. Мобилното приложение е предназначено за
          мобилни устройства, които използват операционната система Android и е
          достъпно за безплатно изтегляне в Google Play Store (Android) и от App
          store (iOS). Мобилното приложение предоставя на Купувачите информация
          за Услугите на Фуудобокс, изразяващи се в предоставяне на Купувачите
          на възможност за търсене и резервиране с цел покупка на Продукти,
          предлагани от Продавачи, при спазване от страна на Купувачите на
          настоящите Общи условия, на действащото българско и европейско
          законодателство, на всички общоприети в страната търговски практики,
          както и на допълнително посочените от Фуудобокс съответни изисквания
          за конкретните Услуги.{'\n'}
          {'\n'}
          Продавачи – юридически лица, които извършват дейности свързани с
          продажба и доставка на Продукти в търговски обекти като ресторанти,
          заведения за бързо хранене, сладкарници, пекарни, хранителни магазини
          и вериги и други. Продавачите имат възможност чрез Мобилното
          приложение да предлагат на Купувачи, които имат Профил в Мобилното
          приложение, излишък от напитки и нетрайни хранителни продукти,
          включително със скоро изтичащ срок на годност и/или с нарушена
          опаковка, и/или с козметични дефекти.
          {'\n'}
          {'\n'}
          Профил – личният профил на Купувача в Мобилното приложение, който
          позволява на Купувача да ползва Услугите, предлагани чрез Мобилното
          приложение и който съдържа информация относно Купувача и историята на
          някои от действията му в Мобилното приложение (резервации, генерирани
          кодове и други).
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