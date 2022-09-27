import React from 'react';
import {useAuth} from './AuthProvider';
import {ImageBackground, Text, View} from 'react-native';
import {Utils} from '../utils';
import {images} from '../constants';

import {NavigationContainer} from '@react-navigation/native';
import SignInScreen from '../screens/Authorization/Login';
import SignUpScreen from '../screens/Authorization/SignUp';
import HomeTabs from '../navigation/homeTabs';
import OrderFinalized from '../screens/OrderFinalized';
import OrderError from '../screens/OrderError';
import SideMenuContent from '../screens/SideMenuContent';
import Profile from '../screens/Profile';
import Offer from '../screens/Offer';
import PaymentMethod from '../screens/PaymentMethod';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import ErrorBoundary from 'react-native-error-boundary';
import {showToastError} from '../common/FBToast';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();

const FBRouter = () => {
  const {authData, authLoading, signOut} = useAuth();

  if (authLoading) {
    return (
      <ImageBackground
        source={images.app_background}
        style={{
          flex: 1,
          height: Utils.height,
          width: Utils.width,
        }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <Text>Loading</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (!authData?.userToken) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }} initialRouteName={'SignInScreen'}>
          <AuthStack.Screen name="SignInScreen" component={SignInScreen}/>
          <AuthStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <ErrorBoundary onError={(e: Error) => {
      showToastError('Имаше проблем. Моля, влезте на ново');
      signOut();
    }}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={'HomeTabs'}
          drawerContent={props => <SideMenuContent {...props} />}
        >
          <Drawer.Screen name="HomeTabs" component={HomeTabs}/>
          <Drawer.Screen name="Offer" component={Offer}/>
          <Drawer.Screen name="Profile" component={Profile}/>
          <Drawer.Screen name="PaymentMethod" component={PaymentMethod}/>
          <Drawer.Screen name="OrderFinalized" component={OrderFinalized}/>
          <Drawer.Screen name="OrderError" component={OrderError}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default FBRouter;
