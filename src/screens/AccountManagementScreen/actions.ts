import { Action } from 'redux'
import * as types from './constants'

import {
  Institute,
  FieldOfStudies,
  Course,
  User,
  RegisterData,
  UploadImageData,
  ProfileData,
} from '../../globalTypes'
/**
 * Redux actions for UserRegistration backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface UpdateUserAndRoleI extends Action {
  type: 'UPDATE_USER_AND_ROLE'
  payload: {
    main: updateUserData
    user_image?: UploadImageData
  }
}

export interface UpdateUserAndRoleSuccessI extends Action {
  type: 'UPDATE_USER_AND_ROLE_SUCCESS'
}

export interface UpdateUserAndRoleErrorI extends Action {
  type: 'UPDATE_USER_AND_ROLE_ERROR'
  payload: { errorMessage: string }
}

export interface ResetUpdateUserAndRoleErrorI extends Action {
  type: 'RESET_UPDATE_USER_AND_ROLE_ERROR'
}

export const updateUser = (
  data: RegisterData,
  user_image?: UploadImageData,
): UpdateUserAndRoleI => {
  return {
    type: types.UPDATE_USER_AND_ROLE,
    payload: {
      main: data,
      user_image,
    },
  }
}

export const updateUserSuccess = (): UpdateUserAndRoleSuccessI => {
  return {
    type: types.UPDATE_USER_AND_ROLE_SUCCESS,
  }
}

export const updateUserError = (
  errorMessage: string,
): UpdateUserAndRoleErrorI => {
  return {
    type: types.UPDATE_USER_AND_ROLE_ERROR,
    payload: {
      errorMessage,
    },
  }
}
export const resetUpdateUser = (): ResetUpdateUserAndRoleErrorI => {
  return {
    type: types.RESET_UPDATE_USER_AND_ROLE_ERROR,
  }
}

export interface FetchUserDataI extends Action {
  type: 'FETCH_USER_DATA'
}

export interface FetchUserDataSuccesssI extends Action {
  type: 'FETCH_USER_DATA_SUCCESS'
  payload: {
    userData: ProfileData
  }
}

export interface FetchUserDataErrorI extends Action {
  type: 'FETCH_USER_DATA_ERROR'
  payload: { errorMessage: string }
}

export const fetchUserData = (): FetchUserDataI => {
  return {
    type: types.FETCH_USER_DATA,
  }
}

export const fetchUserDataSuccess = (
  userData: ProfileData,
): FetchUserDataSuccesssI => {
  return {
    type: types.FETCH_USER_DATA_SUCCESS,
    payload: {
      userData,
    },
  }
}

export const fetchUserDataError = (
  errorMessage: string,
): FetchUserDataErrorI => {
  return {
    type: types.FETCH_USER_DATA_ERROR,
    payload: {
      errorMessage,
    },
  }
}
