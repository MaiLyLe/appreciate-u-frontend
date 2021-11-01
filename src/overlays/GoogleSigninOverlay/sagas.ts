import { call, put, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import {
  LOCAL_DEV_BASE_BACKEND_URL_IOS,
  LOCAL_DEV_BASE_BACKEND_URL_ANDROID,
} from '@env'
import { Platform } from 'react-native'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import { logout } from '../../rootReduxSaga/rootReducer'
import {
  PostGoogleContactsI,
  postGoogleContactsSuccess,
  postGoogleContactsError,
} from './actions'

/**
 * Sagas for GoogleSigninOverlay backend requests
 */

export function* postGoogleContacts(action: PostGoogleContactsI) {
  //posts Google People API contacts of logged in user to backend
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    const base_url =
      Platform.OS === 'ios'
        ? LOCAL_DEV_BASE_BACKEND_URL_IOS
        : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
    const requestURL = `${base_url}/googlecontact/googlecontact/`
    const fetchAction = (accessToken: string) =>
      fetch(requestURL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ` + accessToken,
        },
        body: JSON.stringify(action.payload.contacts),
      }).then((response) =>
        response
          .json()
          .then((data) => {
            return { status: response.status }
          })
          .then((obj) => obj),
      )

    const resp = yield call<any>(fetchAction, accessToken)

    if (resp.status >= 200 && resp.status < 300) {
      yield put(postGoogleContactsSuccess())
    } else {
      yield put(postGoogleContactsError(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export default function* watchPostGoogleContacts(): SagaIterator {
  //overall saga watcher for GoogleSigninOverlay
  yield takeLatest(types.POST_GOOGLE_CONTACTS, postGoogleContacts)
}
