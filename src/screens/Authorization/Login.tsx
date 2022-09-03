import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, images} from '../../constants';
import {Utils} from '../../utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {AccessToken, LoginButton, LoginManager} from 'react-native-fbsdk-next';
import {showToast, showToastError} from '../../common/FBToast';
import {appleAuth, AppleButton} from '@invertase/react-native-apple-authentication';
import FBButton from '../../components/common/button';
import FBSpinner from '../../components/common/spinner';
import ForgotPasswordDialog from '../../components/login/ForgotPasswordDialog';
import {NotAuthenticatedUserRepository} from '../../repositories/UserRepository';
import {useAuth} from '../../providers/AuthProvider';
import {analyticsPageOpen, analyticsSocialLogin} from '../../analytics';
import {FormattedMessage, useIntl} from 'react-intl';
import RNPickerSelect from 'react-native-picker-select';
import {useForm} from 'react-hook-form';
import FBFormInput from '../../components/common/FBFormInput';
import {FBLocale} from '../../redux/user/reducer';
import {userUpdateLocaleAction} from '../../redux/user/actions';
import {translateText} from '../../lang/translate';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
// @ts-ignore
import CloseIcon from '../../../assets/icons/close-icon.svg';
// @ts-ignore
import BGFlag from '../../../assets/flags/bg.svg';
// @ts-ignore
import ENFLag from '../../../assets/flags/us.svg';
// @ts-ignore
import ROFLag from '../../../assets/flags/ro.svg';


interface LoginProps {
  route: any;
  navigation: any;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login = ({navigation}: LoginProps) => {
  const {signIn} = useAuth();
  const [showForgetPasswordDialog, setShowForgetPasswordDialog] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const userLocale = useSelector((state: FBRootState) => state.user.locale);
  const intl = useIntl();
  const dispatch = useDispatch();

  const {control, handleSubmit} = useForm<LoginFormData>({
    defaultValues: {
      email: 'mp3por12@gmail.com',
      password: 'Foodobox2k23',
    },
  });

  GoogleSignin.configure({
    scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '378104807990-kf7eh44l746m88am2mcjl3mt13ouiiuq.apps.googleusercontent.com',
    // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    forceCodeForRefreshToken: true, // [Android] specifies an account name on the device that should be used
    iosClientId:
      '378104807990-n6n7c6m3eal3c3sd5ja1thum91kljinv.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });

  const doLogin = async (data: LoginFormData) => {
    let {
      email, password,
    } = data;

    email = email.trim();
    password = password.trim();

    setVisibleLoading(true);

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      const res = await userRepo.login({email, password, locale: userLocale});
      await signIn(res);
    } catch (error: any) {
      if (error?.message !== '') {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'backenderror.login_error'));
      }
    }

    setVisibleLoading(false);
  };

  const googleLogin = async () => {
    setVisibleLoading(true);
    await analyticsSocialLogin({type: 'google', step: 'initiated'});
    try {
      const result = await GoogleSignin.signIn();
      let tt = await GoogleSignin.getTokens();

      const isAuthorized = !!tt.accessToken;
      await analyticsSocialLogin({
        type: 'google',
        step: 'external_completed',
        data: {isAuthorized, isCancelled: false},
      });

      if (tt.accessToken) {
        let email = result.user.email;
        let googleToken = tt.accessToken;
        let lastName = result.user.familyName;
        let firstName = result.user.givenName;

        const userRepo = new NotAuthenticatedUserRepository();
        const res = await userRepo.loginSocial({email, googleToken, lastName, firstName, locale: userLocale});
        await signIn(res);
      } else {
        showToastError(translateText(intl, 'login.social_refused'));
        await analyticsSocialLogin({type: 'google', step: 'refused'});
      }
    } catch (error) {
      await analyticsSocialLogin({type: 'google', step: 'failed'});

      showToastError(translateText(intl, 'backenderror.user_login_social_error'));
    }
    setVisibleLoading(false);
  };

  const onFacebookLogin = async () => {
    console.log('onFacebookLogin 1');
    setVisibleLoading(true);
    await analyticsSocialLogin({type: 'fb', step: 'initiated'});
    console.log('onFacebookLogin 2');
    try {
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('native_with_fallback');
      }

      console.log('onFacebookLogin 3');

      LoginManager.logOut();
      console.log('onFacebookLogin 4');
      const loginResult = await LoginManager.logInWithPermissions(['email', 'public_profile']);
      console.log('onFacebookLogin 5', loginResult);
      if (loginResult.isCancelled) {
        await analyticsSocialLogin({type: 'fb', step: 'completed', data: {isAuthorized: false, isCancelled: true}});
        showToastError(translateText(intl, 'login.social_refused'));
      } else {
        const fbAccessToken = await AccessToken.getCurrentAccessToken();
        const isAuthorized = !!fbAccessToken;
        await analyticsSocialLogin({type: 'fb', step: 'external_completed', data: {isAuthorized, isCancelled: false}});

        if (fbAccessToken) {
          const response = await fetch(
            `https://graph.facebook.com/${fbAccessToken.userID}?fields=id,first_name,last_name,email,name&access_token=` +
            fbAccessToken.accessToken,
          );
          const accountInfo: { first_name: string, last_name: string, name: string, email: string } = await response.json();
          let email = accountInfo.email;
          let firstName = accountInfo.first_name;
          let lastName = accountInfo.last_name;
          let fbToken = fbAccessToken.accessToken;

          const userRepo = new NotAuthenticatedUserRepository();
          const res = await userRepo.loginSocial({email, firstName, lastName, fbToken, locale: userLocale});
          await signIn(res);
        } else {
          showToastError(translateText(intl, 'login.social_refused'));
          await analyticsSocialLogin({type: 'fb', step: 'refused'});
        }
      }
    } catch (error) {
      await analyticsSocialLogin({type: 'fb', step: 'failed'});
      showToastError(translateText(intl, 'backenderror.user_login_social_error'));
    }

    setVisibleLoading(false);
  };

  const onAppleLogin = async () => {
    setVisibleLoading(true);

    await analyticsSocialLogin({type: 'apple', step: 'initiated'});
    try {
      // performs login request

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      const isAuthorized = credentialState === appleAuth.State.AUTHORIZED;
      await analyticsSocialLogin({
        type: 'apple',
        step: 'external_completed',
        data: {isAuthorized: isAuthorized, isCancelled: false},
      });

      if (isAuthorized) {
        const appleUid = appleAuthRequestResponse.user;
        const appleAuthCode = appleAuthRequestResponse.authorizationCode!;
        const lastName = appleAuthRequestResponse.fullName?.givenName;
        const firstName = appleAuthRequestResponse.fullName?.familyName;
        const name = firstName + ' ' + lastName;

        const userRepo = new NotAuthenticatedUserRepository();
        const res = await userRepo.loginApple({appleUid, appleAuthCode, name, locale: userLocale});
        await signIn(res);
      } else {
        showToastError(translateText(intl, 'login.social_refused'));
        await analyticsSocialLogin({type: 'apple', step: 'refused'});
      }
    } catch (error) {
      await analyticsSocialLogin({type: 'apple', step: 'failed'});
      showToastError(translateText(intl, 'backenderror.user_login_social_error'));
    }
    setVisibleLoading(false);
  };

  const doForgotPassword = async (email: string) => {
    if (!email) {
      return;
    }

    setVisibleLoading(true);

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      const didReset = await userRepo.resetPassword({email});

      if (didReset) {
        showToast(translateText(intl, 'resetpassword.success'));
      } else {
        showToastError(translateText(intl, 'backenderror.user_reset_pass_error'));
      }
    } catch (error) {
      showToastError(translateText(intl, 'backenderror.user_reset_pass_error'));
    }

    setVisibleLoading(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: 0, email: '', pageName: 'Login'});
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <StatusBar
        barStyle={'light-content'}
        animated={true}
        backgroundColor={'#0f2b49'}
      />
      <ImageBackground
        source={images.app_background}
        style={styles.backgroundImage}
      >
        <ScrollView style={{flex: 1}}>
          {/* unneded view*/}
          <View style={{paddingHorizontal: 36, flex: 1, marginBottom: 30}}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                <FormattedMessage id={'login.title'}/>
              </Text>

              <RNPickerSelect
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 10,
                    right: 12,
                  },
                }}
                useNativeAndroidPickerStyle={false}
                // @ts-ignore
                Icon={() => {
                  if (userLocale === FBLocale.EN) {
                    return (<ENFLag/>);
                  } else if (userLocale === FBLocale.RO) {
                    return (<ROFLag/>);
                  } else {
                    return (<BGFlag/>);
                  }
                }}
                value={userLocale}
                onValueChange={(locale: FBLocale) => dispatch(userUpdateLocaleAction({locale: locale}))}
                items={[
                  {label: 'English', value: FBLocale.EN},
                  {label: 'Български', value: FBLocale.BG},
                ]}
              />
            </View>
            <View style={styles.logoWrapper}>
              <Image
                source={images.app_logo}
                style={styles.logoImage}
                resizeMode={'contain'}
              />
            </View>

            <FBFormInput
              control={control}
              name={'email'}
              placeholder={translateText(intl, 'login.email')}
              secureTextEntry={false}
              image={images.mail}
              rules={{required: translateText(intl, 'formErrors.required')}}
            />

            <FBFormInput
              control={control}
              name={'password'}
              placeholder={translateText(intl, 'login.password')}
              secureTextEntry={true}
              image={images.lock}
              rules={{
                required: translateText(intl, 'formErrors.required'),
              }}
            />

            <TouchableOpacity
              style={styles.forgetPasswordWrapper}
              onPress={() => {
                setShowForgetPasswordDialog(true);
              }}
            >
              <View>
                <Text style={styles.forgetPasswordText}>
                  <FormattedMessage id={'login.forgot_password'}/>
                </Text>
              </View>
            </TouchableOpacity>

            <FBButton
              onClick={handleSubmit(doLogin)}
              title={translateText(intl, 'login.login')}
            />

            <View style={{alignItems: 'center', marginTop: 30}}>
              <Text style={{color: '#fff'}}>
                <FormattedMessage id={'login.sign_up_with_social_media'}/>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.facebookLoginWrapper}
              onPress={() => onFacebookLogin()}
            >
              <View style={{width: 10}}>
                <Image source={images.facebook}/>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={{color: '#fff'}}>
                  <FormattedMessage id={'login.login_facebook'}/>
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleLoginWrapper}
              onPress={() => googleLogin()}
            >
              <View style={{width: 10}}>
                <Image source={images.google}/>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={{color: '#fff'}}>
                  <FormattedMessage id={'login.login_google'}/>
                </Text>
              </View>
            </TouchableOpacity>

            {appleAuth.isSupported && (
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                cornerRadius={15}
                style={styles.buttonLoginApple}
                onPress={() => onAppleLogin()}
              />
            )}

            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => navigation.navigate('SignUpScreen')}
            >
              <Text style={{color: '#0bd53a'}}>
                {`${translateText(intl, 'login.not_have_account')} ${translateText(intl, 'login.sign_up')}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ForgotPasswordDialog
          isShown={showForgetPasswordDialog}
          setIsShown={setShowForgetPasswordDialog}
          onConfirm={email => doForgotPassword(email)}
        />

        <FBSpinner isVisible={visibleLoading}/>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;

const pickerSelectStyles = StyleSheet.create({
  inputIOSContainer: {
    width: 200,
    alignSelf: 'center',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: COLORS.white,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroidContainer: {
    width: 200,
    alignSelf: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: COLORS.white,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Utils.height,
    backgroundColor: '#0f2b49',
  },
  backgroundImage: {
    flex: 1,
    height: Utils.height,
    width: Utils.width,
  },
  titleWrapper: {alignItems: 'center', marginTop: 30},
  titleText: {color: '#fff', fontSize: 20},
  logoWrapper: {alignItems: 'center', marginTop: 30},
  logoImage: {
    width: Utils.width / 2,
    height: Utils.ios ? Utils.height / 12 : Utils.height / 8,
  },
  loginFormFieldWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  loginFormEmailFieldIconWrapper: {width: 20, alignItems: 'center'},
  buttonLogin: {
    backgroundColor: '#0bd53a',
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
  googleLoginWrapper: {
    backgroundColor: '#b13221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    height: 44,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  facebookLoginWrapper: {
    backgroundColor: '#3a5897',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 22,
    width: '100%',
    height: 44,
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  buttonLoginApple: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    width: '100%',
    height: 44,
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  loginFormInput: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: '#fff',
    flex: 1,
  },
  forgetPasswordWrapper: {alignItems: 'flex-end', marginTop: 10},
  forgetPasswordText: {color: 'red'},
  textAswer: {
    borderRadius: 20,
    borderColor: '#9B9B9B',
    borderWidth: 1,
    padding: 12,
    width: Utils.width - 100,
  },
  buttonNewpassword: {
    backgroundColor: '#0bd53a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 20,
    width: Utils.width - 100,
    alignSelf: 'center',
    paddingVertical: 12,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  buttonAccept: {
    backgroundColor: '#0bd53a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 40,
    marginBottom: 50,
    marginLeft: 10,
    marginRight: 5,
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 12,
    height: 50,
  },
  buttonDecline: {
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 40,
    marginBottom: 50,
    marginLeft: 5,
    marginRight: 10,
    width: '30%',
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 12,
    height: 50,
  },
  tcLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 20,
    paddingTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '95%',
    height: '90%',
  },
});