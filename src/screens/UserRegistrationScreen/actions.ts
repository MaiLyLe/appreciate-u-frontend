import { Action } from 'redux'
import * as types from './constants'
import {
  Institute,
  FieldOfStudies,
  Course,
  User,
  RegisterData,
  UploadImageData,
} from '../../globalTypes'
/**
 * Redux actions for UserRegistration backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface FetchInstitutesI extends Action {
  type: 'FETCH_INSTITUTES'
}

export interface FetchInstitutesSuccesssI extends Action {
  type: 'FETCH_INSTITUTES_SUCCESS'
  payload: {
    institutes: Institute[]
  }
}

export interface FetchInstitutesErrorI extends Action {
  type: 'FETCH_INSTITUTES_ERROR'
  payload: { errorMessage: string }
}

export const fetchInstitutes = (): FetchInstitutesI => {
  return {
    type: types.FETCH_INSTITUTES,
  }
}

export const fetchInstitutesSuccess = (
  institutes: Institute[],
): FetchInstitutesSuccesssI => {
  return {
    type: types.FETCH_INSTITUTES_SUCCESS,
    payload: {
      institutes,
    },
  }
}

export const fetchInstitutesError = (
  errorMessage: string,
): FetchInstitutesErrorI => {
  return {
    type: types.FETCH_INSTITUTES_ERROR,
    payload: {
      errorMessage,
    },
  }
}

export interface FetchFieldsI extends Action {
  type: 'FETCH_FIELDS'
  payload?: {
    institute_id: number
  }
}

export interface FetchFieldsSuccesssI extends Action {
  type: 'FETCH_FIELDS_SUCCESS'
  payload: {
    fields: FieldOfStudies[]
  }
}

export interface FetchFieldsErrorI extends Action {
  type: 'FETCH_FIELDS_ERROR'
  payload: { errorMessage: string }
}

export const fetchFields = (institute_id?: number): FetchFieldsI => {
  return !institute_id
    ? {
        type: types.FETCH_FIELDS,
      }
    : {
        type: types.FETCH_FIELDS,
        payload: {
          institute_id,
        },
      }
}

export const fetchFieldsSuccess = (
  fields: FieldOfStudies[],
): FetchFieldsSuccesssI => {
  return {
    type: types.FETCH_FIELDS_SUCCESS,
    payload: {
      fields,
    },
  }
}

export const fetchFieldsError = (errorMessage: string): FetchFieldsErrorI => {
  return {
    type: types.FETCH_FIELDS_ERROR,
    payload: {
      errorMessage,
    },
  }
}

export interface FetchCoursesI extends Action {
  type: 'FETCH_COURSES'
  payload: {
    name?: string
    for_prof: boolean
  }
}

export interface FetchCoursesSuccesssI extends Action {
  type: 'FETCH_COURSES_SUCCESS'
  payload: {
    courses: Course[]
  }
}

export interface FetchCoursesErrorI extends Action {
  type: 'FETCH_COURSES_ERROR'
  payload: { errorMessage: string }
}

export const fetchCourses = (
  for_prof: boolean,
  name?: string,
): FetchCoursesI => {
  return !name
    ? {
        type: types.FETCH_COURSES,
        payload: {
          for_prof,
        },
      }
    : {
        type: types.FETCH_COURSES,
        payload: {
          name,
          for_prof,
        },
      }
}

export const fetchCoursesSuccess = (
  courses: Course[],
): FetchCoursesSuccesssI => {
  return {
    type: types.FETCH_COURSES_SUCCESS,
    payload: {
      courses,
    },
  }
}

export const fetchCoursesError = (errorMessage: string): FetchCoursesErrorI => {
  return {
    type: types.FETCH_COURSES_ERROR,
    payload: {
      errorMessage,
    },
  }
}

export interface CreateUserAndRoleI extends Action {
  type: 'CREATE_USER_AND_ROLE'
  payload: {
    main: RegisterData
    user_image?: UploadImageData
  }
}

export interface CreateUserAndRoleSuccessI extends Action {
  type: 'CREATE_USER_AND_ROLE_SUCCESS'
}

export interface CreateUserAndRoleErrorI extends Action {
  type: 'CREATE_USER_AND_ROLE_ERROR'
  payload: { errorMessage: string }
}

export interface ResetCreateUserAndRoleErrorI extends Action {
  type: 'RESET_CREATE_USER_AND_ROLE_ERROR'
}

export const register = (
  data: RegisterData,
  user_image?: UploadImageData,
): CreateUserAndRoleI => {
  return {
    type: types.CREATE_USER_AND_ROLE,
    payload: {
      main: data,
      user_image,
    },
  }
}

export const registerSuccess = (): CreateUserAndRoleSuccessI => {
  return {
    type: types.CREATE_USER_AND_ROLE_SUCCESS,
  }
}

export const registerError = (
  errorMessage: string,
): CreateUserAndRoleErrorI => {
  return {
    type: types.CREATE_USER_AND_ROLE_ERROR,
    payload: {
      errorMessage,
    },
  }
}
export const resetRegister = (): ResetCreateUserAndRoleErrorI => {
  return {
    type: types.RESET_CREATE_USER_AND_ROLE_ERROR,
  }
}
