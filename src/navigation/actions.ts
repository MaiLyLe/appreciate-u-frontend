import { Action } from 'redux'
import * as types from './constants'

/**
 * Redux actions for RootNavigator backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface StartLogoutTimerI extends AppAction {
  type: 'START_LOGOUT_TIMER'
}

export interface StopLogoutTimerI extends AppAction {
  type: 'STOP_LOGOUT_TIMER'
}

export interface GetUserInfoI extends Action {
  type: 'GET_USER_INFO'
}

export interface GetUserSuccessActionI extends Action {
  type: 'GET_USER_SUCCESS'
  payload: { email: string; role: string; googleLastUpdated: string }
}

export interface GetUserErrorActionI extends Action {
  type: 'GET_USER_ERROR'
  payload: { errorMessage: string }
}

export const startLogoutTimer = (): StartLogoutTimerI => {
  return {
    type: types.START_LOGOUT_TIMER,
  }
}

export const stopLogoutTimer = (): StopLogoutTimerI => {
  return {
    type: types.STOP_LOGOUT_TIMER,
  }
}

export const getUserData = (): GetUserInfoI => {
  return {
    type: types.GET_USER_INFO,
  }
}

export const getUserDataSuccess = (
  email: string,
  role: string,
  googleLastUpdated: string,
): GetUserSuccessActionI => {
  return {
    type: types.GET_USER_SUCCESS,
    payload: {
      email: email,
      role: role,
      googleLastUpdated: googleLastUpdated,
    },
  }
}

export const getUserDataError = (errorMessage: string): GetUserErrorActionI => {
  return {
    type: types.GET_USER_ERROR,
    payload: {
      errorMessage,
    },
  }
}
