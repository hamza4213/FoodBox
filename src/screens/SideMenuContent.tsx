import React from 'react';
import {Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Avatar} from 'react-native-elements';
import {
  CONTACT_US_FACTORY,
  FAQ_FACTORY, REGISTER_BUSINESS_FACTOR,
  TERMS_AND_CONDITIONS_FACTORY,
} from '../network/Server';
import {useAuth} from '../providers/AuthProvider';
import {useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {FBUser} from '../models/User';
// @ts-ignore
import CloseIcon from '../../assets/icons/close-icon.svg';
import {analyticsLinkOpened, analyticsSignOut} from '../analytics';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {COLORS} from '../constants';

const SideMenuContent = (props: any) => {
  const navigation = props.navigation;
  const {signOut} = useAuth();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState)=> state.userState.locale);
  const styles = stylesCreator();
  const intl = useIntl();
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.avatarWrapper}>
        {/*<Avatar*/}
        {/*  rounded*/}
        {/*  size="large"*/}
        {/*  title={user?.firstName && user.firstName[0]}*/}
        {/*  titleStyle={{color: '#000'}}*/}
        {/*  activeOpacity={0.7}*/}
        {/*  overlayContainerStyle={{backgroundColor: '#fff'}}*/}
        {/*/>*/}
        <Text style={styles.avatarNameText}>
          {user?.firstName} {user?.lastName}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.closeDrawer()}
          style={styles.closeIcon}
        >
          <CloseIcon/>
        </TouchableOpacity>
      </View>

      <View style={styles.listItemsWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Profile');
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_profile_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.profile')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = REGISTER_BUSINESS_FACTOR[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_REGISTER_BUSINESS',
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_hero_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.business')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = TERMS_AND_CONDITIONS_FACTORY[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_TERMS_OF_SERVICE',
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_privacy_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.privacy')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = FAQ_FACTORY[userLocale];
            analyticsLinkOpened({userId: user.id, email: user.email, link: link, linkName: 'WEBSITE_FAQ'});
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_faq_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.faq')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = CONTACT_US_FACTORY[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_CONTACT_US',
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_contact_us_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.contact')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            analyticsSignOut({userId: user.id, email: user.email});
            signOut();
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_logout_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.logout')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SideMenuContent;

const stylesCreator = () => StyleSheet.create({
  mainWrapper: {flex: 1, color: COLORS.black},
  avatarWrapper: {
    backgroundColor: '#2A4764',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },

  avatarNameText: {marginTop: 10, fontSize: 20, color: '#fff'},
  listItemsWrapper: {flex: 1, marginVertical: 20, marginHorizontal: 10},
  listItemWrapper: {flexDirection: 'row', borderRadius: 5},
  listItemContentWrapper: {flexDirection: 'row', padding: 10},
  listItemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  listItemText: {fontSize: 16, fontWeight: '400'},
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
