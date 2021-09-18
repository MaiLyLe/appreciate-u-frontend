import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
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

const fetchMethod = (requestURL: string, accessToken: string) => {
  //fetch function for fetching certain message
  if (accessToken) {
    return fetch(requestURL, {
      credentials: 'include',
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ` + accessToken,
        Accept: '*/*',
      },
    }).then((response) =>
      response
        .json()
        .then((data) => ({ status: response.status, body: data }))
        .then((obj) => {
          return obj
        })
        .catch((err) => {
          console.log(err)
          throw err
        }),
    )
  }
}

export function* fetchMessageDetail(action: GetMessageDetailI) {
  //saga function for fetching certain message
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const message_id = action.payload.message_id
    const requestURL = `${LOCAL_DEV_BASE_BACKEND_URL}/message/messages/${message_id}/mark_message_seen/`
    const resp = yield call(fetchMethod, requestURL, accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      yield put(getMessageDetailSuccess(resp.body))
    } else {
      yield put(getMessageDetailError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

export default function* watchGetMessageDetail(): SagaIterator {
  yield takeLatest(types.GET_MESSAGE_DETAIL, fetchMessageDetail)
}
