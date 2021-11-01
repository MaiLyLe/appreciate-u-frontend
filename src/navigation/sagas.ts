import { race, call, put, take, takeEvery } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
import { parseISO, addMinutes, isAfter } from 'date-fns'
import { fetchMethod } from '../rootReduxSaga/rootSaga'
import { delay } from '../rootReduxSaga/rootSaga'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
  LOGOUT_TIME,
} from '@env'
import { Platform } from 'react-native'
import * as types from './constants'

/**
 * Sagas actions for RootNavigator backend requests
 */

import { getUserDataError, getUserDataSuccess, GetUserInfoI } from './actions'

export function* fetchUserData(action: GetUserInfoI) {
  //request for getting user data that have to be saved to AsyncStorage like email and role
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    const base_url =
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID

    const url = `${base_url}/authentication/currentuser/`

    const resp = yield call<any>(fetchMethod, url, accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      const role =
        Object.keys(resp?.body)
          .find((key) => resp?.body[key] === true)
          ?.replace('is_', '')
          ?.toUpperCase() || ''

      yield call(AsyncStorage.setItem, 'role', role)
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

function* timerSagaWorker() {
  //runs every 3s and checks whether 15 min have passed as from successful login
  while (true) {
    try {
      yield delay(3000)

      const startTime = yield call(
        AsyncStorage.getItem,
        'start_time_logout_timer',
      )
      const startTimeDateObj = parseISO(startTime)
      const logoutTime = addMinutes(startTimeDateObj, LOGOUT_TIME)
      if (isAfter(new Date(), logoutTime)) {
        yield put({ type: 'USER_LOGOUT' })
      }
    } catch (err) {}
  }
}

export default function* watchFetchGeneralUserDataAndLogoutTimerSagas() {
  //overall saga watcher for RootNavigator
  yield takeEvery(types.GET_USER_INFO, fetchUserData)
  while (true) {
    yield take(types.START_LOGOUT_TIMER)
    yield race([call(timerSagaWorker), take('USER_LOGOUT')])
  }
}
