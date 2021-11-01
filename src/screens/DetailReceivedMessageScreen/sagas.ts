import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import { logout } from '../../rootReduxSaga/rootReducer'
import { fetchMethod } from '../../rootReduxSaga/rootSaga'
import { Platform } from 'react-native'
import { SagaIterator } from '@redux-saga/core'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import {
  getMessageDetailError,
  GetMessageDetailI,
  getMessageDetailSuccess,
} from './actions'

/**
 * Sagas for DetailReceivedMessageScreen backend requests
 */

export function* fetchMessageDetail(action: GetMessageDetailI) {
  //saga function for fetching certain message
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const message_id = action.payload.message_id
    const requestURL = `${
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    }/message/messages/${message_id}/mark_message_seen/`
    const resp = yield call(fetchMethod, requestURL, accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      yield put(getMessageDetailSuccess(resp.body))
    } else {
      yield put(getMessageDetailError(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export default function* watchGetMessageDetail(): SagaIterator {
  //overall saga watcher for DetailReceivedMessageScreen
  yield takeLatest(types.GET_MESSAGE_DETAIL, fetchMessageDetail)
}
