import { call, put, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
import { SagaIterator } from '@redux-saga/core'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import * as types from './constants'
import { StartLoginActionI, loginUserSuccess, loginUserError } from './actions'

/**
 * Sagas for LoginScreen backend requests
 */

export function* login(action: StartLoginActionI) {
  //Saga for logging in and getting access tokens
  try {
    const requestURL = `${LOCAL_DEV_BASE_BACKEND_URL}/user/token/`
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
      yield put(loginUserError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

export default function* watchLoginAll(): SagaIterator {
  yield takeLatest(types.LOGIN_USER, login)
}
