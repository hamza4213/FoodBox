/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import React from 'react';
import allReducer from './src/redux/store';
import {persistReducer, persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-community/async-storage';
import {set} from 'lodash';
import {restaurantInitialState} from './src/redux/restaurant/reducer';
import {ordersInitialState} from './src/redux/order/reducer';
import {userInitialState} from './src/redux/user/reducer';
import {PersistedState} from 'redux-persist/es/types';
import {AuthData} from './src/models/AuthData';
import {AUTH_DATA_KEY} from './src/providers/AuthProvider';
import {UserRepository} from './src/repositories/UserRepository';
import {createStore} from 'redux';
import {name as appName} from './app.json';
import {Settings as FBSettings} from 'react-native-fbsdk-next';


const migrations = {
  0: async (state: any) => {

    set(state, 'restaurant.newFilters', restaurantInitialState.newFilters);
    set(state, 'orders', ordersInitialState);
    set(state, 'user', userInitialState);

    if (state.auth) {
      delete state.auth;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        const authData: AuthData = {userToken: userToken};
        const userRepo = new UserRepository({authData});
        const user = await userRepo.checkMe({});

        set(state, 'user.user', user);

        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.setItem(AUTH_DATA_KEY, JSON.stringify(authData));
      }
    } catch (e) {
      // problem reading token -> sign out user
      await AsyncStorage.removeItem('userToken');
    }


    return {
      ...state,
    };
  },
};

const currentStoreVersion = 0;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: currentStoreVersion,
  migrate: async (state: PersistedState, currentVersion: number) => {
    if (!state) {
      return Promise.resolve(undefined);
    }

    let inboundVersion: number = state._persist?.version;

    if (inboundVersion === currentVersion) {
      return Promise.resolve(state);
    }

    let migrationKeys = Object.keys(migrations)
      .map(ver => parseInt(ver))
      .filter(key => currentVersion >= key && key > inboundVersion)
      .sort((a, b) => a - b);

    try {
      let migratedState = {...state};

      for (let versionKey of migrationKeys) {
        // @ts-ignore
        migratedState = await migrations[versionKey](migratedState);
      }

      return Promise.resolve(migratedState);
    } catch (err) {
      return Promise.reject(err);
    }

  },
};

const persistedReducer = persistReducer(persistConfig, allReducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);

FBSettings.initializeSDK();

const ReduxApp = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
