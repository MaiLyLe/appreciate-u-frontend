import { race, call, put, take } from 'redux-saga/effects'
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
  getPollingNumberUnreadMessagesError,
  getPollingNumberUnreadMessagesSuccess,
  cancelPollingNumberUnreadMessages,
} from './actions'
import { delay } from '../../rootReduxSaga/rootSaga'
import { fetchMethod } from '../../rootReduxSaga/rootSaga'
import { logout } from '../../rootReduxSaga/rootReducer'

/**
 * Sagas for TabNavigator backend requests
 */

function* pollNumberUnreadMessagesWorker() {
  //main function for polling number of unread messages from backend

  while (true) {
    try {
      //new request every 3000ms
      const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

      const base_url =
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID

      const url = `${base_url}/message/messages/number_of_unread_messages/`

      yield call(delay, 6000)

      const resp = yield call<any>(fetchMethod, url, accessToken)

      if (resp.status >= 200 && resp.status < 300) {
        yield put(
          getPollingNumberUnreadMessagesSuccess(
            resp.body.unread_messages,
            resp.body.total_number,
          ),
        )
      } else {
        yield put(
          getPollingNumberUnreadMessagesError(
            resp.body[Object.keys(resp.body)[0]],
          ),
        )

        if (resp.status === 401) {
          yield put(cancelPollingNumberUnreadMessages())
          yield put(logout())
        }
      }
    } catch (err) {}
  }
}

export default function* watchPollNumberUnreadMessages(): SagaIterator {
  //overall saga watcher for TabNavigation
  while (true) {
    yield take(types.START_POLLING_NUMBER_OF_UNREAD_MESSAGES)
    yield race({
      task: call(pollNumberUnreadMessagesWorker),
      cancel: take(types.CANCEL_POLLING_NUMBER_OF_UNREAD_MESSAGES),
    })
  }
}
