import { call, put, takeLatest, take, cancel } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import { logout } from '../../rootReduxSaga/rootReducer'
import { Platform } from 'react-native'
import { SagaIterator } from '@redux-saga/core'
import * as typesUpdate from './constants'
import { delay } from '../../rootReduxSaga/rootSaga'
import {
  UpdateUserAndRoleI,
  updateUserSuccess,
  updateUserError,
  FetchUserDataI,
  fetchUserDataSuccess,
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

const updateUserUserRequest = (
  requestURL: string,
  payload: any,
  accessToken: string,
) => {
  //fetch function for uploading image via multipart/form-data
  return fetch(requestURL, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'content-type':
        'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      Authorization: `JWT ` + accessToken,
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

export function* fetchUserProfileData(action: FetchUserDataI) {
  //saga for getting user's data
  try {
    const role = yield call(AsyncStorage.getItem, 'role')
    const isProf = role === 'PROFESSOR'
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const baseUrl = `${
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    }/useradministration`

    const urlSuffix = isProf
      ? '/profileprof/data-professor/'
      : '/profilestudent/data-student/'

    const resp = yield call(fetchMethod, `${baseUrl}${urlSuffix}`, accessToken)
    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchUserDataSuccess(resp.body))
    } else {
      yield put(fetchUserDataSuccess(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export function* updateUser(action: UpdateUserAndRoleI) {
  //saga for updateUsering, creating User model, Student or Professor model, adds User to courses
  //and uploads user_image
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    const data = action.payload.main
    const imageData = action.payload.user_image
    const base_url =
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID

    const url = `${base_url}/useradministration/update/update_user_with_role_and_courses/`
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

    const respMain = yield call(
      updateUserUserRequest,
      url,
      formDataComplete,
      accessToken,
    )
    if (respMain.status >= 200 && respMain.status < 300) {
      yield put(updateUserSuccess())
    } else {
      if (respMain.status !== 429) {
        if (respMain.body[Object.keys(respMain.body)[0]]) {
          if (Array.isArray(respMain.body[Object.keys(respMain.body)[0]])) {
            yield put(
              updateUserError(
                `${Object.keys(respMain.body)[0]}: ` +
                  respMain.body[Object.keys(respMain.body)[0]][0],
              ),
            )
          } else {
            yield put(
              updateUserError(respMain.body[Object.keys(respMain.body)[0]]),
            )
          }
        } else {
          yield put(updateUserError('An error occured. Try again.'))
        }
      }
      if (respMain.status === 401) {
        yield put(logout())
      }
    }

    yield call(delay, 3000)
  } catch (err) {}
}

export default function* watchProfileChange(): SagaIterator {
  //overall saga watcher for AccountManagementScreen
  yield takeLatest(typesUpdate.UPDATE_USER_AND_ROLE, updateUser)
  yield takeLatest(typesUpdate.FETCH_USER_DATA, fetchUserProfileData)
}
