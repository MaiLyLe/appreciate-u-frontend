import { Action } from 'redux'
import * as types from './constants'
import { LoginData } from '../../globalTypes'

/**
 * Redux actions for LoginScreen backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface MountLoginActionI extends AppAction {
  type: 'MOUNT_LOGIN'
}

export interface StartLoginActionI extends Action {
  type: 'LOGIN_USER'
  payload: {
    email: string
    password: string
  }
}

export interface LoginSuccessActionI extends Action {
  type: 'LOGIN_USER_SUCCESS'
  payload: {
    refreshToken: string
    accessToken: string
  }
}

export interface LoginErrorActionI extends Action {
  type: 'LOGIN_USER_ERROR'
  payload: { errorMessage: string }
}

export interface LoginResetErrorActionI extends Action {
  type: 'LOGIN_RESET_ERROR'
}

export const startLoginUserAction = (user: LoginData): StartLoginActionI => {
  return {
    type: types.LOGIN_USER,
    payload: user,
  }
}

export const mountLogin = (): MountLoginActionI => {
  return {
    type: types.MOUNT_LOGIN,
  }
}

export const loginUserSuccess = (
  refreshToken: string,
  accessToken: string,
): LoginSuccessActionI => {
  return {
    type: types.LOGIN_USER_SUCCESS,
    payload: { refreshToken, accessToken },
  }
}

export const loginUserError = (errorMessage: string): LoginErrorActionI => {
  return {
    type: types.LOGIN_USER_ERROR,
    payload: { errorMessage },
  }
}

export const loginResetError = (): LoginResetErrorActionI => {
  return {
    type: types.LOGIN_RESET_ERROR,
  }
}
