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
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {Settings as FBSettings} from 'react-native-fbsdk-next';

const messages = {
  [FBLocale.BG]: MessagesInBulgarian,
  [FBLocale.EN]: MessagesInEnglish,
};

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};

let FBApp = () => {
  // const {signOut} = useAuth();
  // const dispatch = useDispatch();
  const selectedLocale = useSelector((state: FBRootState) => state.user.locale);

  /** Intercept any unauthorized request.
   * dispatch logout action accordingly **/
    // const UNAUTHORIZED = 401;
    // axiosClient.interceptors.response.use(
    //   response => {
    //     if (response && response.data) {
    //       return response.data;
    //     }
    //     return response;
    //   },
    //   error => {
    //     if (error && error.response) {
    //       const status = error.response?.status;
    //       if (status === UNAUTHORIZED) {
    //         // signOut();
    //         return
    //       }
    //
    //       throw error.response.data;
    //     }
    //
    //     throw error;
    //   }
    // );

    // useEffect(() => {
    //   CodePush.sync(
    //     {installMode: CodePush.InstallMode.IMMEDIATE},
    //     (status) => {
    //       console.log('codepush status', status);
    //     },
    //   );
    // }, []);

  const state = useAppState();
  useEffect(() => {
    const checkAttPermissions = async () => {
      console.log('checkAttPermissions');
      const att_check = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      console.log('att_check ', att_check);
      if (att_check === 'granted' || att_check === 'unavailable') {
        await setupFB(true);
      } else {
        const att_request = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        console.log('att_request ', att_request);

        if (att_request === 'granted') {
          await setupFB(true);
        } else {
          await setupFB(false);
        }
      }

    };

    const setupFB = async (attEnabled: boolean) => {
      console.log('setupFB ', attEnabled);

      FBSettings.setAppID('1532703837120978');
      FBSettings.initializeSDK();

      await FBSettings.setAdvertiserTrackingEnabled(attEnabled);
    };

    if (state === 'active' && Platform.OS === 'ios') {
      console.log('state ', state);
      checkAttPermissions();
    }
    return () => {
    };
  }, [state]);


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
