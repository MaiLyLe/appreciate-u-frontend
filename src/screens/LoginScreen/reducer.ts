import { fromJS } from 'immutable'

import {
  StartLoginActionI,
  LoginErrorActionI,
  LoginSuccessActionI,
  MountLoginActionI,
  LoginResetErrorActionI,
} from './actions'
import * as types from './constants'

/**
 * Reducer for LoginScreen states
 */

const initialLoginState = fromJS({
  loading: false,
  accessToken: null,
  refreshToken: null,
  error: null,
})

export const jwtTokenReducer = (
  initialState = initialLoginState,
  action:
    | StartLoginActionI
    | LoginSuccessActionI
    | LoginErrorActionI
    | MountLoginActionI
    | LoginResetErrorActionI,
) => {
  switch (action.type) {
    case types.MOUNT_LOGIN:
      return {
        ...initialState,
        loading: false,
        refreshToken: null,
        accessToken: null,
        error: null,
      }
    case types.LOGIN_USER:
      return { ...initialState, loading: true }
    case types.LOGIN_USER_SUCCESS:
      return {
        ...initialState,
        loading: false,
        refreshToken: action.payload.refreshToken,
        accessToken: action.payload.accessToken,
      }
    case types.LOGIN_USER_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
      }
    case types.LOGIN_RESET_ERROR:
      return {
        ...initialState,
        error: null,
      }
    default:
      return initialState
  }
}
