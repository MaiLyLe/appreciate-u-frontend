import { fromJS } from 'immutable'
import * as types from './constants'
import {
  FetchInstitutesI,
  FetchInstitutesSuccesssI,
  FetchInstitutesErrorI,
  FetchFieldsI,
  FetchFieldsErrorI,
  FetchFieldsSuccesssI,
  FetchCoursesI,
  FetchCoursesSuccesssI,
  FetchCoursesErrorI,
  CreateUserAndRoleI,
  CreateUserAndRoleSuccessI,
  CreateUserAndRoleErrorI,
  ResetCreateUserAndRoleErrorI,
} from './actions'
/**
 * Reducers for UserRegistrationScreen
 */

const initialInsitutesState = fromJS({
  loading: false,
  error: null,
  success: false,
  institutes: null,
})

export const fetchInstitutesReducer = (
  initialState = initialInsitutesState,
  action: FetchInstitutesI | FetchInstitutesSuccesssI | FetchInstitutesErrorI,
) => {
  //reducer for fetching institutes from backend
  switch (action.type) {
    case types.FETCH_INSTITUTES:
      return {
        ...initialState,
        loading: true,
      }
    case types.FETCH_INSTITUTES_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        institutes: action.payload.institutes,
      }
    case types.FETCH_INSTITUTES_ERROR:
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

const initialFieldsState = fromJS({
  loading: false,
  error: null,
  success: false,
  fields: null,
})

export const fetchFieldsReducer = (
  initialState = initialFieldsState,
  action: FetchFieldsI | FetchFieldsSuccesssI | FetchFieldsErrorI,
) => {
  //reducer for fetching fields of studies from backend
  switch (action.type) {
    case types.FETCH_FIELDS:
      return {
        ...initialState,
        loading: true,
      }
    case types.FETCH_FIELDS_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        fields: action.payload.fields,
      }
    case types.FETCH_FIELDS_ERROR:
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

const initialCoursesState = fromJS({
  loading: false,
  error: null,
  success: false,
  courses: null,
})

export const fetchCoursesReducer = (
  initialState = initialCoursesState,
  action: FetchCoursesI | FetchCoursesSuccesssI | FetchCoursesErrorI,
) => {
  //reducer for fetching courses from backend
  switch (action.type) {
    case types.FETCH_COURSES:
      return {
        ...initialState,
        loading: true,
      }
    case types.FETCH_COURSES_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        courses: action.payload.courses,
      }
    case types.FETCH_COURSES_ERROR:
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

const initialCreateUsertate = fromJS({
  loading: false,
  error: null,
  success: false,
})

export const createUserReducer = (
  initialState = initialCreateUsertate,
  action:
    | CreateUserAndRoleI
    | CreateUserAndRoleSuccessI
    | CreateUserAndRoleErrorI
    | ResetCreateUserAndRoleErrorI,
) => {
  //reducer for creating user
  switch (action.type) {
    case types.CREATE_USER_AND_ROLE:
      return {
        ...initialState,
        loading: true,
      }
    case types.CREATE_USER_AND_ROLE_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
      }
    case types.CREATE_USER_AND_ROLE_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
        success: false,
      }
    case types.RESET_CREATE_USER_AND_ROLE_ERROR:
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
