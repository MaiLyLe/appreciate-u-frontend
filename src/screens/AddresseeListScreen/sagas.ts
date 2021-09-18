import { call, put, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
import {
  StartFetchingRecommendationsActionI,
  fetchRecommendationsError,
  fetchRecommendationsSuccess,
} from './actions'

/**
 * Sagas for AddresseeListScreen backend requests
 */

const fetchMethod = (requestURL: string, accessToken: string) => {
  //fetch function for recommendations saga
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

export function* fetchRecommendationList(
  action: StartFetchingRecommendationsActionI,
) {
  //saga for getting list of recommendations of people that logged-in user can message
  try {
    const receiverType = action.payload.receiverType.toLocaleLowerCase()
    const currentRole = action.payload.currentRole.toLocaleLowerCase()
    const accessToken = action.payload.accessToken

    const resp = yield call(
      fetchMethod,
      `${LOCAL_DEV_BASE_BACKEND_URL}/user/${receiverType}s/${receiverType}-list-for-${currentRole}/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchRecommendationsSuccess(resp.body))
    } else {
      yield put(fetchRecommendationsError(resp.body[Object.keys(resp.body)[0]]))
      yield call(AsyncStorage.removeItem, 'accessToken')
    }
  } catch (err) {}
}

export default function* watchGetRecommendations(): SagaIterator {
  yield takeLatest(types.GET_RECOMMENDATIONS, fetchRecommendationList)
}
