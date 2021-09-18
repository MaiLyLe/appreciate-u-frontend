import { race, call, put, take, takeEvery } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
import { SagaIterator } from '@redux-saga/core'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import * as types from './constants'

/**
 * Sagas actions for RootNavigator backend requests
 */

import {
  getUserDataError,
  getUserDataSuccess,
  GetUserInfoI,
  tokenExpired,
  tokenVerified,
} from './actions'

export function* getUserData(action: GetUserInfoI) {
  //request for getting user data that have to be saved to AsyncStorage like email and role
  try {
    const fetchfetch = (accessToken: string) => {
      return fetch(`${LOCAL_DEV_BASE_BACKEND_URL}/user/currentuser/`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: '*/*',
          'Content-type': 'application/json',
          Authorization: `Bearer ` + accessToken,
        },
      }).then((response) =>
        response
          .json()
          .then((data) => {
            return { status: response.status, body: data }
          })
          .then((obj) => obj),
      )
    }

    const resp = yield call<any>(fetchfetch, action.payload.accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      const role =
        Object.keys(resp?.body)
          .find((key) => resp?.body[key] === true)
          ?.replace('is_', '')
          ?.toUpperCase() || ''

      yield call(AsyncStorage.setItem, 'role', role)
      yield call(AsyncStorage.setItem, 'email', resp.body.email)
      yield put(
        getUserDataSuccess(
          resp.body.email,
          role,
          resp.body.google_last_updated,
        ),
      )
    } else {
      yield put(getUserDataError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

function delay(duration: number) {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true), duration)
  })
  return promise
}
function* pollSagaWorker() {
  //polling saga for checking if token saved to AsyncStorage is still valid
  try {
    //new request every 3000ms
    yield call(delay, 3000)
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const verifyaccess = (accessToken: string) => {
      return fetch('http://localhost:8000/user/verifyaccess/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: '*/*',
          'Content-type': 'application/json',
          Authorization: `Bearer ` + accessToken,
        },
      }).then((response) => {
        return response
          .json()
          .then((data) => {
            return { status: response.status, body: data }
          })
          .then((obj) => obj)
      })
    }

    const resp = yield call<any>(verifyaccess, accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      yield put(tokenVerified())
    } else {
      yield put(tokenExpired())
    }
  } catch (err) {}
}

export default function* watchUserInfoTokenVerificationAll(): SagaIterator {
  yield takeEvery(types.GET_USER_INFO, getUserData)
  while (true) {
    yield race({
      task: call(pollSagaWorker),
      cancel: take(types.TOKEN_EXPIRED),
    })
  }
}
