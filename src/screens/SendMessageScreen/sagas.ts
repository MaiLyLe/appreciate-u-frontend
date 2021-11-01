import { call, put, take, takeLatest } from 'redux-saga/effects'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import { logout } from '../../rootReduxSaga/rootReducer'
import {
  StartSendMessageActionI,
  sendMessageSuccess,
  sendMessageError,
} from './actions'

/**
 * Sagas for SendMessageScreen backend requests
 */

export function* postMessage(action: StartSendMessageActionI) {
  //Saga for posting/sending a new message
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    const requestURL = `${
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    }/message/messages/`
    const postAction = (action: StartSendMessageActionI) =>
      fetch(requestURL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ` + accessToken,
        },
        body: JSON.stringify(action.payload),
      }).then((response) =>
        response
          .json()
          .then((data) => ({ status: response.status, body: data }))
          .then((obj) => obj),
      )

    const resp = yield call<any>(postAction, action)
    if (resp.status >= 200 && resp.status < 300) {
      yield put(sendMessageSuccess())
    } else {
      yield put(sendMessageError(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export default function* watchPostMessageWatcher(): SagaIterator {
  //overall saga watcher for SendMessageScreen
  yield take(types.SEND_MESSAGE_START)
  yield takeLatest(types.SEND_MESSAGE_START, postMessage)
}
