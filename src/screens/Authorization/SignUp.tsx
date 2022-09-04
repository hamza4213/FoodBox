import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, images} from '../../constants';
import {Utils} from '../../utils';
import {showToastError} from '../../common/FBToast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {WEBSITE_CONTACT_US} from '../../network/Server';
import FBSpinner from '../../components/common/spinner';
import FBButton from '../../components/common/button';
import {NotAuthenticatedUserRepository} from '../../repositories/UserRepository';
import RegistrationCompletedDialog from '../../components/login/RegistrationCompletedDialog';
import {analyticsPageOpen} from '../../analytics';
import {useForm} from 'react-hook-form';
import FBFormInput from '../../components/common/FBFormInput';
import FBFormCheckbox from '../../components/common/FBFormCheckbox';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../../network/axiosClient';

interface SignUpProps {
  navigation: any;
  route: any;
}

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  terms_and_conditions: boolean;
}

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SignUp = ({navigation, route}: SignUpProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationCompleteDialogVisible, setIsRegistrationCompleteDialogVisible] = useState(false);

  const intl = useIntl();

  const userLocale = route.params.locale;

  const {control, handleSubmit, watch} = useForm<SignUpFormData>({
    defaultValues: {
      terms_and_conditions: false,
    },
  });
  const password = watch('password');

  const doSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      await userRepo.register({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        locale: userLocale,
      });

      setIsLoading(false);
      setIsRegistrationCompleteDialogVisible(true);
    } catch (error: any) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: 0, email: '', pageName: 'Registration'});
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ImageBackground source={images.app_background} style={styles.backgroundImage}>
        <KeyboardAwareScrollView style={{paddingHorizontal: 24, flex: 1}}>

          <View style={{flex: 1}}>

            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                {translateText(intl, 'signup.title')}
              </Text>
            </View>

            <View style={styles.logoWrapper}>
              <Image
                source={images.app_logo}
                style={styles.logoImage}
                resizeMode={'contain'}
              />
            </View>

            <FBFormInput
              name={'firstName'}
              control={control}
              rules={{required: translateText(intl, 'formErrors.required')}}
              placeholder={translateText(intl, 'signup.firstName')}
              secureTextEntry={false}
              image={images.app_user}
            />

            <FBFormInput
              name={'lastName'}
              control={control}
              rules={{required: translateText(intl, 'formErrors.required')}}
              placeholder={translateText(intl, 'signup.lastName')}
              secureTextEntry={false}
              image={images.app_user}
            />

            <FBFormInput
              name={'email'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                patter: {
                  value: EMAIL_REGEX,
                  message: translateText(intl, 'formErrors.email'),
                },
              }}
              placeholder={translateText(intl, 'signup.email')}
              secureTextEntry={false}
              image={images.mail}
            />

            <FBFormInput
              name={'password'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                minLength: {
                  value: 8,
                  message: translateText(intl, 'formErrors.password'),
                },
              }}
              placeholder={translateText(intl, 'signup.password')}
              secureTextEntry={true}
              image={images.lock}
            />

            <FBFormInput
              name={'repeatPassword'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                validate: (value: string) => password === value || translateText(intl, 'signup.error_password'),
              }}
              placeholder={translateText(intl, 'signup.repeat_password')}
              secureTextEntry={true}
              image={images.lock}
            />

            <FBFormCheckbox
              name={'terms_and_conditions'}
              control={control}
              rules={{required: translateText(intl, 'formErrors.required')}}
            />

            <FBButton
              onClick={handleSubmit(doSignUp)}
              title={translateText(intl, 'signup.sign_up')}
            />

            <TouchableOpacity
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => Linking.openURL(WEBSITE_CONTACT_US)}
            >
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#fff'}}>
                  {`${translateText(intl, 'signup.help')} `}
                </Text>

                <Text style={{color: '#0bd53a'}}>
                  info@foodobox.com
                </Text>
              </View>
            </TouchableOpacity>

            <FBButton
              onClick={() => navigation.navigate('SignInScreen')}
              title={translateText(intl, 'back')}
              backgroundColor={COLORS.red}
            />

          </View>
        </KeyboardAwareScrollView>

        <RegistrationCompletedDialog
          isShown={isRegistrationCompleteDialogVisible}
          setIsShown={setIsRegistrationCompleteDialogVisible}
          onConfirm={() => navigation.navigate('SignInScreen')}
        />

        <FBSpinner isVisible={isLoading}/>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;

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
    height: Utils.ios ? Utils.height / 12 : Utils.height / 11,
  },
  formFieldWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  formFieldIconWrapper: {width: 20, alignItems: 'center'},
  formFieldIcon: {tintColor: '#fff'},
  buttonLogin: {
    backgroundColor: '#0bd53a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 40,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
  },
  buttonLoginEmail: {
    backgroundColor: '#b13221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  buttonLoginFace: {
    backgroundColor: '#3a5897',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  formFieldInput: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: '#fff',
    flex: 1,
  },
  tcWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonNewpassword: {
    backgroundColor: '#0bd53a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 30,
    marginBottom: 30,
    width: Utils.width - 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});
