import React from 'react';

import {StatusBar} from 'react-native';
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
