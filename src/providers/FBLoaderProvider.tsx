import * as React from 'react';
import {ReactNode, useCallback, useContext, useReducer, useState} from 'react';
import FBSpinner from '../components/common/spinner';

export interface FBLoadingState {
  isLoading: boolean;
  loaders: { [key: string]: boolean };
}

export interface FBLoadingContextData {
  fbLoadingState: FBLoadingState;

  showLoading(loader: string): void;

  hideLoading(loader: string): void;
}

export enum FBLoadingActionsType {
  SHOW_LOADING,
  HIDE_LOADING
}

export interface FBLoadingAction {
  type: FBLoadingActionsType;
  data: { loader: string };
}

export const fbLoadingShowLoadingAction = (params: { loader: string }): FBLoadingAction => {
  return {
    type: FBLoadingActionsType.SHOW_LOADING,
    data: params,
  };
};

export const fbLoadingHideLoadingAction = (params: { loader: string }): FBLoadingAction => {
  return {
    type: FBLoadingActionsType.HIDE_LOADING,
    data: params,
  };
};

interface FBLoaderActionHandler {
  (state: FBLoadingState, data: any): any;
}

const handleShowLoadingAction: FBLoaderActionHandler = (state, data) => {
  Object.assign(state.loaders, {[data.loader]: true});
  state.isLoading = true;
  return {...state};
};

const handleHideLoadingAction: FBLoaderActionHandler = (state, data) => {
  if (state.loaders[data.loader]) {
    delete state.loaders[data.loader];
  }

  if (Object.keys(state.loaders).length === 0) {
    state.isLoading = false;
  }

  return {...state};
};

const FB_LOADING_ACTION_TO_ACTION_HANDLER_MAP: { [p in FBLoadingActionsType]: FBLoaderActionHandler } = {
  [FBLoadingActionsType.SHOW_LOADING]: handleShowLoadingAction,
  [FBLoadingActionsType.HIDE_LOADING]: handleHideLoadingAction,
};

const fbLoadingReducer = (state: FBLoadingState, action: FBLoadingAction): FBLoadingState => {
  if (FB_LOADING_ACTION_TO_ACTION_HANDLER_MAP[action.type]) {
    return FB_LOADING_ACTION_TO_ACTION_HANDLER_MAP[action.type](state, action.data);
  }
  return state;
};

const FBLoaderContext = React.createContext<FBLoadingContextData | undefined>(undefined);

export const useFbLoading = (): FBLoadingContextData => {
  const context = useContext(FBLoaderContext);

  if (context === undefined) {
    throw new Error('useFbLoading must be used within an FBLoadingProvider');
  }

  return context;
};

export const FBLoadingProvider = ({children}: {children?: ReactNode}) => {

  const [fbLoadingState, fbLoadingDispatch] = useReducer(fbLoadingReducer, {isLoading: false, loaders: {}});

  const showLoading = useCallback((loader: string) => {
      fbLoadingDispatch(fbLoadingShowLoadingAction({loader}));
    },
    [],
  );
  const hideLoading = useCallback((loader: string) => {
    fbLoadingDispatch(fbLoadingHideLoadingAction({loader}));
  }, []);

  return (
    <FBLoaderContext.Provider value={{fbLoadingState, showLoading, hideLoading}}>
      {children}
      <FBSpinner isVisible={fbLoadingState.isLoading}/>
    </FBLoaderContext.Provider>
  );
};
