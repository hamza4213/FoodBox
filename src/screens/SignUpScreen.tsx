import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Logo from './../../assets/images/logo.svg';
import FilledEmailLogo from './../../assets/images/emailFilled.svg';
import {images} from '../constants';
import {useFbLoading} from '../providers/FBLoaderProvider';
import {NotAuthenticatedUserRepository} from '../repositories/UserRepository';
import {
  isFBAppError,
  isFBBackendError,
  isFBGenericError,
} from '../network/axiosClient';
import {translateText} from '../lang/translate';
import {showToastError} from '../common/FBToast';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {openComposer} from 'react-native-email-link';
import {useAuth} from '../providers/AuthProvider';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {Formik} from 'formik';
import * as yup from 'yup';
interface SignUpProps {
  route: any;
  navigation: any;
}

const SignUpScreen = ({navigation}: SignUpProps) => {
  const [check, setCheck] = useState(false);
  const {signIn} = useAuth();
  const {showLoading, hideLoading} = useFbLoading();
  const [
    isRegistrationCompleteDialogVisible,
    setIsRegistrationCompleteDialogVisible,
  ] = useState(false);
  const intl = useIntl();
  const userLocale = useSelector(
    (state: FBRootState) => state.userState.locale,
  );
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const handleSendEmailSupport = React.useCallback(() => {
    try {
      openComposer({
        to: 'info@foodbox.com',
        subject: 'I have a question',
        body: 'Hi, can you help me with...',
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSignup = async (values: any) => {
    showLoading('sign_up');
    const {email, firstName, password} = values;
    console.log('email: ' + email);
    console.log('firstname: ' + firstName);
    console.log('password: ' + password);
    try {
      const userRepo = new NotAuthenticatedUserRepository();
      await userRepo.register({
        email: email,
        firstName: firstName,
        lastName: '',
        password: password,
        locale: userLocale,
      });
      showMessage({
        message:
          'We have sent you a verifification email. Please verify your email and login.',
        type: 'success',
        duration: 5000,
      });
      navigation.goBack();
      setIsRegistrationCompleteDialogVisible(true);
      // navigation.navigate('Objects');
    } catch (error: any) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('sign_up');
  };
  let SignupSchema = yup.object().shape({
    firstName: yup.string().required('Name is required'),
    email: yup.string().email().required('Email required'),
    password: yup.string().required('Password is required').min(4),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    agrredToTermsAndConditions: yup
      .bool()
      .oneOf([true], 'Field must be checked'),
  });

  return (
    <Formik
      initialValues={{
        firstName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        agrredToTermsAndConditions: false,
        showErrors: false,
      }}
      validationSchema={SignupSchema}
      onSubmit={async values => {
        console.log('values', values);
        handleSignup(values);
      }}>
      {({handleChange, handleSubmit, values, setValues, errors}) => (
        <SafeAreaView style={styles.container}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Logo width={146} height={52} />
          </View>
          <View style={styles.loginMain}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: '5%',
                marginBottom: 100,
              }}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.registerHeading}>
                {translateText(intl, 'signup.title')}
              </Text>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>
                  {translateText(intl, 'signup.firstName')}
                </Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  placeholderTextColor="#182550"
                  onChangeText={handleChange('firstName')}
                  // onChange={fname => setFirstName(fname.nativeEvent.text)}
                />
                {values?.showErrors && errors?.firstName && (
                  <Text style={styles.warnText}>*{errors?.firstName}*</Text>
                )}
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>
                  {translateText(intl, 'signup.email')}
                </Text>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  placeholderTextColor="#182550"
                  onChangeText={handleChange('email')}
                  // onChange={email => setEmail(email.nativeEvent.text)}
                />
                {values?.showErrors && errors?.email && (
                  <Text style={styles.warnText}>*{errors?.email}*</Text>
                )}
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>
                  {translateText(intl, 'signup.password')}
                </Text>
                <TextInput
                  placeholder="*************"
                  style={styles.input}
                  placeholderTextColor="#182550"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  // onChange={pwd => setPassword(pwd.nativeEvent.text)}
                />
                {values?.showErrors && errors?.password && (
                  <Text style={styles.warnText}>*{errors?.password}*</Text>
                )}
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>
                  {translateText(intl, 'signup.repeat_password')}
                </Text>
                <TextInput
                  placeholder="*************"
                  style={styles.input}
                  placeholderTextColor="#182550"
                  secureTextEntry={true}
                  onChangeText={handleChange('passwordConfirmation')}
                  // onChange={pwd => setConfirmPassword(pwd.nativeEvent.text)}
                />
                {values?.showErrors && errors?.passwordConfirmation && (
                  <Text style={styles.warnText}>
                    *{errors?.passwordConfirmation}*
                  </Text>
                )}
              </View>
              <View style={styles.conditionSec}>
                <TouchableOpacity
                  style={styles.checkBox}
                  onPress={() =>
                    setValues({
                      ...values,
                      agrredToTermsAndConditions:
                        !values.agrredToTermsAndConditions,
                    })
                  }>
                  {values?.agrredToTermsAndConditions ? (
                    <Text style={{color: '#79C54A', fontSize: 10}}>✓</Text>
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.agreeTxt}>
                  {translateText(intl, 'signup.agree_with')}
                </Text>
                <TouchableOpacity
                  style={styles.conditionBtn}
                  onPress={() => navigation.navigate('GeneralTerms')}>
                  <Text style={styles.conditionBtnTxt}>
                    {translateText(intl, 'signup.conditionals')}
                  </Text>
                </TouchableOpacity>
              </View>
              {values?.showErrors && errors?.agrredToTermsAndConditions && (
                <Text style={styles.warnText}>
                  *{errors?.agrredToTermsAndConditions}*
                </Text>
              )}
              {/* <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.forgotBtnTxt}>Забравена парола?</Text>
          </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  setValues({...values, showErrors: true});
                  handleSubmit();
                }}>
                <Text style={styles.loginBtnTxt}>
                  {translateText(intl, 'signup.sign_up')}
                </Text>
              </TouchableOpacity>
              <View style={styles.registerSec}>
                <Text style={styles.registerSecTxt}>
                  {translateText(intl, 'signup.have_account')}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.registerBtn}>
                  <Text style={styles.registerBtnTxt}>
                    {translateText(intl, 'signup.login_profile')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomSec}>
                <FilledEmailLogo />
                <View style={styles.helpSec}>
                  <Text style={styles.helpTxt} />
                  <Text style={styles.helpTxt}>
                    {translateText(intl, 'signup.help')}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleSendEmailSupport}>
                  <Text style={styles.mailTxt}>info@foodobox.com</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
  },
  logo: {
    width: 146,
    height: 52,
    marginTop: 40,
    alignSelf: 'center',
  },
  warnText: {
    color: '#CF4F4F',
  },
  loginMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
    // paddingHorizontal: '5%',
  },
  registerHeading: {
    textAlign: 'center',
    color: '#182550',
    marginTop: 25,
    fontWeight: 'bold',
  },
  inputView: {
    marginTop: 30,
  },
  inputLabel: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginTop: 5,
    borderColor: '#CCCCCC',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loginBtn: {
    height: 48,
    backgroundColor: '#79C54A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 25,
  },
  loginBtnTxt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  registerSec: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  registerSecTxt: {
    color: '#182550',
    fontSize: 16,
  },
  registerBtn: {
    marginLeft: 5,
  },
  registerBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueTxt: {
    textAlign: 'center',
    marginTop: 30,
    color: '#182550',
  },
  facebookBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 15,
  },
  fbTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomBtn: {
    alignSelf: 'center',
  },
  registerTxt: {
    color: '#CF4F4F',
    fontSize: 16,
  },
  conditionSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkBox: {
    borderColor: '#CCCCCC',
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeTxt: {
    fontSize: 14,
    color: '#000',
    marginLeft: 6,
  },
  conditionBtn: {
    marginLeft: 6,
  },
  conditionBtnTxt: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  bottomSec: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  helpSec: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  helpTxt: {
    color: '#182550',
    fontSize: 12,
    marginTop: 10,
  },
  mailTxt: {
    color: '#182550',
    fontWeight: 'bold',
    marginTop: 3,
  },
});

export default SignUpScreen;
