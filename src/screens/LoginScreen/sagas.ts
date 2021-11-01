import { call, put, takeLatest, take } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
import { Platform } from 'react-native'
import { SagaIterator } from '@redux-saga/core'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import * as types from './constants'
import { StartLoginActionI, loginUserSuccess, loginUserError } from './actions'

/**
 * Sagas for LoginScreen backend requests
 */

export function* login(action: StartLoginActionI) {
  //Saga for logging in and getting access tokens
  try {
    const base_url =
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    const requestURL = `${base_url}/authentication/token/`
    const fetchAction = () =>
      fetch(requestURL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.payload),
      }).then((response) =>
        response
          .json()
          .then((data) => ({ status: response.status, body: data }))
          .then((obj) => obj),
      )

    const resp = yield call<any>(fetchAction, action)
    if (resp.status >= 200 && resp.status < 300) {
      yield call(AsyncStorage.setItem, 'accessToken', resp.body.access)
      yield call(AsyncStorage.setItem, 'refreshToken', resp.body.refresh)

      yield put(loginUserSuccess(resp.body.refresh, resp.body.access))
    } else {
      if (resp.status !== 429) {
        if (resp.body[Object.keys(resp.body)[0]]) {
          if (Array.isArray(resp.body[Object.keys(resp.body)[0]])) {
            yield put(
              loginUserError(
                `${Object.keys(resp.body)[0]}: ` +
                  resp.body[Object.keys(resp.body)[0]][0],
              ),
            )
          } else {
            yield put(loginUserError(resp.body[Object.keys(resp.body)[0]]))
          }
        } else {
          yield put(loginUserError('An error occured. Try again.'))
        }
      }
    }
  } catch (err) {}
}

export default function* watchLoginAll(): SagaIterator {
  //overall saga watcher for LoginScreen
  yield takeLatest(types.LOGIN_USER, login)
}
