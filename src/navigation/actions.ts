import { Action } from 'redux'
import * as types from './constants'

/**
 * Redux actions for RootNavigator backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface StartPollingVerifyTokenI extends AppAction {
  type: 'START_POLLING_VERIFY_TOKEN'
}
export interface TokenVerifiedI extends AppAction {
  type: 'TOKEN_VERIFIED'
}

export interface TokenExpiredI extends AppAction {
  type: 'TOKEN_EXPIRED'
}

export interface GetUserInfoI extends Action {
  type: 'GET_USER_INFO'
  payload: {
    accessToken: string
  }
}

export interface GetUserSuccessActionI extends Action {
  type: 'GET_USER_SUCCESS'
  payload: { email: string; role: string; googleLastUpdated: string }
}

export interface GetUserErrorActionI extends Action {
  type: 'GET_USER_ERROR'
  payload: { errorMessage: string }
}

export const startPollingTokenVerified = (): StartPollingVerifyTokenI => {
  return {
    type: types.START_POLLING_VERIFY_TOKEN,
  }
}

export const tokenVerified = (): TokenVerifiedI => {
  return {
    type: types.TOKEN_VERIFIED,
  }
}

export const tokenExpired = (): TokenExpiredI => {
  return {
    type: types.TOKEN_EXPIRED,
  }
}

export const getUserData = (accessToken: string): GetUserInfoI => {
  return {
    type: types.GET_USER_INFO,
    payload: {
      accessToken,
    },
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
