import React, {useEffect} from 'react';

import {Platform, StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import CodePush from 'react-native-code-push';
import {useSelector} from 'react-redux';
import {FBAuthProvider} from './src/providers/AuthProvider';
import FBRouter from './src/providers/FBRouter';
import {IntlProvider} from 'react-intl';
import MessagesInEnglish from './src/lang/en';
import MessagesInBulgarian from './src/lang/bg';
import {FBLocale} from './src/redux/user/reducer';
import {FBRootState} from './src/redux/store';
import Toast from 'react-native-toast-message';
import {useAppState} from '@react-native-community/hooks';
import {check as checkPermission, PERMISSIONS, request as requestPermission} from 'react-native-permissions';
import {Settings as FBSettings} from 'react-native-fbsdk-next';

const messages = {
  [FBLocale.BG]: MessagesInBulgarian,
  [FBLocale.EN]: MessagesInEnglish,
};

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};

// initialize the FB sdk
FBSettings.initializeSDK();

let FBApp = () => {
  const selectedLocale = useSelector((state: FBRootState) => state.user.locale);

  const appState = useAppState();
  useEffect(() => {
    const setupFB = async (params: {attEnabled: boolean}) => {
      await FBSettings.setAdvertiserTrackingEnabled(params.attEnabled);
    };

    const checkAttPermission = async () => {
      const att_check = await checkPermission(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (att_check === 'granted' || att_check === 'unavailable') {
        await setupFB({attEnabled: true});
      } else if (att_check === 'blocked') {
        await setupFB({attEnabled: true});
      } else {
        const att_request = await requestPermission(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        if (att_request === 'granted' || att_request === 'unavailable') {
          await setupFB({attEnabled: true});
        } else {
          await setupFB({attEnabled: true});
        }
      }
    };

    if (appState === 'active' && Platform.OS === 'ios') {
      checkAttPermission();
    }
  }, [appState]);
  
  return (
    <>
      <IntlProvider messages={messages[selectedLocale]} locale={selectedLocale} defaultLocale={FBLocale.BG}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar
            barStyle={'dark-content'}
            animated={true}
            backgroundColor={'#fff'}
          />

          <FBAuthProvider>
            <FBRouter/>
          </FBAuthProvider>

        </SafeAreaProvider>
      </IntlProvider>
      <Toast/>
    </>
  );
};

if (!__DEV__) {
  FBApp = CodePush(CODE_PUSH_OPTIONS)(FBApp);
}

export default FBApp;
