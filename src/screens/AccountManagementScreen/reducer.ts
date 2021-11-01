import { fromJS } from 'immutable'
import * as types from './constants'
import {
  FetchUserDataI,
  FetchUserDataErrorI,
  FetchUserDataSuccesssI,
  UpdateUserAndRoleI,
  UpdateUserAndRoleSuccessI,
  UpdateUserAndRoleErrorI,
  ResetUpdateUserAndRoleErrorI,
} from './actions'
/**
 * Reducers for AccountManagementScreen
 */

const initialUserProfileState = fromJS({
  loading: false,
  error: null,
  success: false,
  userData: null,
})

export const fetchProfileDataReducer = (
  initialState = initialUserProfileState,
  action: FetchUserDataI | FetchUserDataSuccesssI | FetchUserDataErrorI,
) => {
  //reducer for fetching user data
  switch (action.type) {
    case types.FETCH_USER_DATA:
      return {
        ...initialState,
        loading: true,
      }
    case types.FETCH_USER_DATA_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        userData: action.payload.userData,
      }
    case types.FETCH_USER_DATA_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
        success: false,
      }
    default:
      return initialState
  }
}

const initialUpdateUserState = fromJS({
  loading: false,
  error: null,
  success: false,
})

export const updateUserReducer = (
  initialState = initialUpdateUserState,
  action:
    | UpdateUserAndRoleI
    | UpdateUserAndRoleSuccessI
    | UpdateUserAndRoleErrorI
    | ResetUpdateUserAndRoleErrorI,
) => {
  //reducer for updating user
  switch (action.type) {
    case types.UPDATE_USER_AND_ROLE:
      return {
        ...initialState,
        loading: true,
      }
    case types.UPDATE_USER_AND_ROLE_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
      }
    case types.UPDATE_USER_AND_ROLE_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
        success: false,
      }
    case types.RESET_UPDATE_USER_AND_ROLE_ERROR:
      return {
        ...initialState,
        loading: false,
        success: false,
        error: null,
      }
    default:
      return initialState
  }
}
