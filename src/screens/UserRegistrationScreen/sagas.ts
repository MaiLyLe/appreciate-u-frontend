import { call, put, takeLatest, take, cancel } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import { Platform } from 'react-native'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import {
  fetchInstitutesError,
  fetchInstitutesSuccess,
  FetchInstitutesI,
  FetchFieldsI,
  fetchFieldsError,
  fetchFieldsSuccess,
  FetchCoursesI,
  fetchCoursesSuccess,
  fetchCoursesError,
  CreateUserAndRoleI,
  registerSuccess,
  registerError,
} from './actions'

/**
 * Sagas for UserRegistrationScreen backend requests
 */

const fetchMethod = (
  requestURL: string,
  accessToken?: string,
  methodType?: string,
  payload?: any,
) => {
  //fetch function for sagas based on application/json

  return fetch(requestURL, {
    credentials: 'include',
    method: !methodType ? 'GET' : methodType,
    mode: 'cors',
    headers: accessToken
      ? {
          'Content-Type': 'application/json',
          Authorization: `JWT ` + accessToken,
          Accept: '*/*',
        }
      : {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
    body: JSON.stringify(payload),
  }).then((response) =>
    response
      .json()
      .then((data) => ({ status: response.status, body: data }))
      .then((obj) => {
        return obj
      })
      .catch((err) => {
        throw err
      }),
  )
}

const registerUserRequest = (requestURL: string, payload: any) => {
  //fetch function for uploading image via multipart/form-data

  return fetch(requestURL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type':
        'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      Accept: '*/*',
    },

    body: payload,
  }).then((response) =>
    response
      .json()
      .then((data) => ({ status: response.status, body: data }))
      .then((obj) => {
        return obj
      })
      .catch((err) => {
        throw err
      }),
  )
}
export function* fetchInstitutes(action: FetchInstitutesI) {
  //saga for getting list of Institutes
  try {
    const resp = yield call(
      fetchMethod,
      `${
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
      }/useradministration/list-institute/`,
    )

    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchInstitutesSuccess(resp.body.results))
    } else {
      yield put(fetchInstitutesError(resp.body[Object.keys(resp.body)[0]]))
      yield call(AsyncStorage.removeItem, 'accessToken')
    }
  } catch (err) {}
}

export function* fetchFields(action: FetchFieldsI) {
  //saga for getting list of Fields Of Studies
  try {
    const institute_id = action.payload?.institute_id
    const resp = yield call(
      fetchMethod,
      `${
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
      }/useradministration/list-fields-by-institute${
        institute_id ? `?instituteid=${institute_id}` : '/'
      }`,
    )

    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchFieldsSuccess(resp.body.results))
    } else {
      yield put(fetchFieldsError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

export function* fetchCourses(action: FetchCoursesI) {
  //saga for getting list of Courses
  try {
    const name = action.payload.name
    const for_prof = action.payload.for_prof
    const baseUrl = `${
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    }/useradministration/list-courses`

    const nameParam = name ? `?name=${name}` : ''
    const profParam = for_prof ? `?forprof=True` : ''
    let url =
      !name && !for_prof ? baseUrl + '/' : `${baseUrl}${nameParam}${profParam}`

    const resp = yield call(fetchMethod, url)

    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchCoursesSuccess(resp.body))
    } else {
      yield put(fetchCoursesError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

export function* register(action: CreateUserAndRoleI) {
  //saga for registering, creating User model, Student or Professor model, adds User to courses
  //and uploads user_image
  try {
    const data = action.payload.main
    const imageData = action.payload.user_image
    const url = `${
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    }/useradministration/register/create_user_with_role_and_courses/`
    let filename = imageData?.user_image.uri.split('/').pop()
    const formDataComplete = new FormData()

    formDataComplete.append('main', JSON.stringify(data))
    if (imageData) {
      formDataComplete.append('user_image', {
        uri: imageData.user_image.uri,
        type: 'image/jpg',
        name: filename,
      })
    }

    const respMain = yield call(registerUserRequest, url, formDataComplete)

    if (respMain.status >= 200 && respMain.status < 300) {
      yield put(registerSuccess())
    } else {
      if (respMain.status !== 429) {
        if (respMain.body[Object.keys(respMain.body)[0]]) {
          if (Array.isArray(respMain.body[Object.keys(respMain.body)[0]])) {
            yield put(
              registerError(
                `${Object.keys(respMain.body)[0]}: ` +
                  respMain.body[Object.keys(respMain.body)[0]][0],
              ),
            )
          } else {
            yield put(
              registerError(respMain.body[Object.keys(respMain.body)[0]]),
            )
          }
        } else {
          yield put(registerError('An error occured. Try again.'))
        }
      }
    }
  } catch (err) {}
}

export default function* watchRegistrationRequests(): SagaIterator {
  //overall saga watcher for UserRegistrationScreen
  yield takeLatest(types.CREATE_USER_AND_ROLE, register)
  yield takeLatest(types.FETCH_COURSES, fetchCourses)
  yield takeLatest(types.FETCH_INSTITUTES, fetchInstitutes)
  yield takeLatest(types.FETCH_FIELDS, fetchFields)
}
