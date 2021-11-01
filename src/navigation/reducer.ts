import { fromJS } from 'immutable'
import {
  GetUserSuccessActionI,
  GetUserErrorActionI,
  GetUserInfoI,
} from './actions'
import * as types from './constants'

const initialUserDataState = fromJS({
  loading: false,
  email: null,
  role: null,
  google_last_updated: null,
  error: null,
  success: false,
})

export const userDataReducer = (
  initialState = initialUserDataState,
  action: GetUserInfoI | GetUserSuccessActionI | GetUserErrorActionI,
) => {
  //reducer for fetching general user data from backend
  switch (action.type) {
    case types.GET_USER_INFO:
      return {
        ...initialState,
        loading: true,
        email: null,
        role: null,
        error: null,
        success: false,
      }
    case types.GET_USER_SUCCESS:
      return {
        ...initialState,
        loading: false,
        role: action.payload.role,
        email: action.payload.email,
        google_last_updated: action.payload.googleLastUpdated,
        success: true,
      }
    case types.GET_USER_ERROR:
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
