import { call, put, takeLatest } from 'redux-saga/effects'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
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
    const requestURL = `${LOCAL_DEV_BASE_BACKEND_URL}/message/messages/`
    const postAction = (action: StartSendMessageActionI) =>
      fetch(requestURL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ` + action.accessToken,
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
    }
  } catch (err) {}
}

export default function* watchPostMessageWatcher(): SagaIterator {
  yield takeLatest(types.SEND_MESSAGE_START, postMessage)
}
