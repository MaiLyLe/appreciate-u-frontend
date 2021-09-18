import { race, call, put, take, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'

import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import {
  getMessagesError,
  getMessagesSuccess,
  GetPaginatedMessagesI,
} from './actions'

/**
 * Sagas for ReceivedMessagesOverviewScreen backend requests
 */

function delay(duration: number) {
  //creates delay
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true), duration)
  })
  return promise
}

function* getMessagesSagaWorker(action: GetPaginatedMessagesI) {
  //polls list of messages sent to logged in user
  try {
    yield call(delay, 3000)
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const paginationNum = action.payload.paginationNum

    if (accessToken) {
      const getMessages = (accessToken: string, paginationNum: string) => {
        return fetch(
          `${LOCAL_DEV_BASE_BACKEND_URL}/message/messages/?page=${paginationNum}`,
          {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ` + accessToken,
              Accept: '*/*',
            },
          },
        ).then((response) => {
          return response
            .json()
            .then((data) => {
              return {
                status: response.status,
                body: data,
                hasNext: data.next !== null,
                totalMessageCount: data.count,
              }
            })
            .then((obj) => obj)
        })
      }

      const resp = yield call<any>(
        getMessages,
        accessToken,
        paginationNum.toString(),
      )
      if (resp.status >= 200 && resp.status < 300) {
        yield put(
          getMessagesSuccess(
            resp.body.results,
            resp.body.hasNext,
            resp.body.totalMessageCount,
          ),
        )
      } else {
        yield put(getMessagesError(resp.body[Object.keys(resp.body)[0]]))
      }
    }

    yield call(delay, 3000)
  } catch (err) {}
}

export default function* watchGettingMessages(): SagaIterator {
  yield takeLatest(types.GET_PAGINATED_MESSAGES, getMessagesSagaWorker)
}
