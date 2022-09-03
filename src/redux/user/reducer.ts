import {
  USER_SET_USER,
  UserSetUserAction,
  USER_UNSET_USER,
  UserUnsetUserAction,
  USER_UPDATE_LOC_PERMISSION,
  USER_UPDATE_LOCALE,
  USER_UPDATE_LOCATION,

  USER_UPDATE_PROFILE,
  UserAction,
  UserUpdateProfileAction,
  UserUpdateLocaleAction,
  UserUpdateLocationAction,
  UserUpdateLocPermissionAction,
  USER_UPDATE_NOTIFICATION_PERMISSION, UserUpdateNotificationPermission,
} from './actions';
import {FBUser} from '../../models/User';
import {FBGeoLocation} from '../../models/FBGeoLocation';

export enum FBLocale {
  EN = 'en',
  BG = 'bg',
  RO = 'ro'
}

export enum UserPermissionAnswer {
  NO,
  YES,
  UNSET
}

export enum SystemPermissionStatus {
  DENIED,
  GRANTED,
  UNKNOWN,
  UNAVAILABLE,
  STOPPED
}

export interface UserState {
  user: FBUser | null;
  userLocation: FBGeoLocation;
  locationPermission: {
    userAnswer: UserPermissionAnswer;
    systemPermission: SystemPermissionStatus;
  };
  notificationPermission: {
    userAnswer: UserPermissionAnswer;
    systemPermission: SystemPermissionStatus;
  };
  defaultCity: {
    latitude: number;
    longitude: number;
  },
  locale: FBLocale;
}

export const userInitialState: UserState = {
  user: null,
  userLocation: {
    latitude: 42.697572,
    longitude: 23.321806,
  },
  locationPermission: {
    userAnswer: UserPermissionAnswer.UNSET,
    systemPermission: SystemPermissionStatus.UNKNOWN,
  },
  notificationPermission: {
    userAnswer: UserPermissionAnswer.UNSET,
    systemPermission: SystemPermissionStatus.UNKNOWN,
  },
  defaultCity: {
    latitude: 0,
    longitude: 0,
  },
  locale: FBLocale.BG,
};


const handleUserUnsetUserAction = (state: UserState, data: UserUnsetUserAction['data']): UserState => {
  return {
    ...state,
    user: null,
  };
};

const handleUserSetUserAction = (state: UserState, data: UserSetUserAction['data']): UserState => {
  return {
    ...state,
    user: data.user,
  };
};

const handleUserUpdateProfileAction = (state: UserState, data: UserUpdateProfileAction['data']): UserState => {
  return {
    ...state,
    user: data.user,
  };
};

const handleUserUpdateLocaleAction = (state: UserState, data: UserUpdateLocaleAction['data']): UserState => {
  return {
    ...state,
    locale: data.locale,
  };
};

const handleUserUpdateLocationAction = (state: UserState, data: UserUpdateLocationAction['data']): UserState => {
  return {
    ...state,
    userLocation: data.userLocation,
  };
};

const handleUserUpdateLocPermissionAction = (state: UserState, data: UserUpdateLocPermissionAction['data']): UserState => {
  state.locationPermission = {
    ...state.locationPermission,
    ...data,
  };

  return {
    ...state,
  };
};

const handleUserUpdateNotificationPermissionAction = (state: UserState, data: UserUpdateNotificationPermission['data']): UserState => {
  state.notificationPermission = {
    ...state.notificationPermission,
    ...data,
  };

  return {
    ...state,
  };
};

const userReducer = (
  state: UserState = userInitialState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case USER_UPDATE_LOC_PERMISSION:
      return handleUserUpdateLocPermissionAction(state, action.data);
    case USER_UPDATE_LOCALE:
      return handleUserUpdateLocaleAction(state, action.data);
    case USER_SET_USER:
      return handleUserSetUserAction(state, action.data);
    case USER_UPDATE_PROFILE:
      return handleUserUpdateProfileAction(state, action.data);
    case USER_UNSET_USER:
      return handleUserUnsetUserAction(state, action.data);
    case USER_UPDATE_LOCATION:
      return handleUserUpdateLocationAction(state, action.data);
    case USER_UPDATE_NOTIFICATION_PERMISSION:
      return handleUserUpdateNotificationPermissionAction(state, action.data);
    default:
      return state;
  }
};


export default userReducer;