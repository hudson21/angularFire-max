import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as uiReducer from './shared/ui.reducer';
import * as authReducer from './auth/auth.reducer';

export interface State {
    ui: uiReducer.State;
    auth: authReducer.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: uiReducer.uiReducer,
    auth: authReducer.authReducer
};

export const getUiState = createFeatureSelector<uiReducer.State>('ui');
export const getIsLoading = createSelector(getUiState, uiReducer.getIsLoading);

export const getAuthState = createFeatureSelector<authReducer.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, authReducer.getIsAuthenticated);