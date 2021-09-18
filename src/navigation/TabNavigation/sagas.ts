import { race, call, put, take } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import {
  getPollingNumberUnreadMessagesError,
  getPollingNumberUnreadMessagesSuccess,
} from './actions'

/**
 * Sagas for TabNavigator backend requests
 */

function delay(duration: number) {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true), duration)
  })
  return promise
}

function* pollNumberUnreadMessagesWorker() {
  //main function for polling number of unread messages from backend
  try {
    //new request every 3000ms
    yield call(delay, 3000)
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    if (accessToken) {
      const getMessages = (accessToken: string) => {
        return fetch(
          `${LOCAL_DEV_BASE_BACKEND_URL}/message/messages/number_of_unread_messages/`,
          {
            method: 'GET',
            mode: 'cors',
            headers: {
              Accept: '*/*',
              'Content-type': 'application/json',
              Authorization: `Bearer ` + accessToken,
            },
          },
        ).then((response) => {
          return response
            .json()
            .then((data) => {
              return {
                status: response.status,
                body: data,
              }
            })
            .then((obj) => obj)
        })
      }

      const resp = yield call<any>(getMessages, accessToken)

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
      }
    }
  } catch (err) {}
}

export default function* watchPollNumberUnreadMessages(): SagaIterator {
  while (true) {
    yield race({
      task: call(pollNumberUnreadMessagesWorker),
      cancel: take(types.CANCEL_POLLING_NUMBER_OF_UNREAD_MESSAGES),
    })
  }
}
