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
import { fetchMethod } from '../../rootReduxSaga/rootSaga'
import {
  StartFetchingRecommendationsActionI,
  fetchRecommendationsError,
  fetchRecommendationsSuccess,
  StartFilteringUserActionI,
  filterUserSuccess,
  filterUserError,
} from './actions'

/**
 * Sagas for AddresseeListScreen backend requests
 */

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
      `${
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
      }/userrecommendation/${receiverType}s/${receiverType}-list-for-${currentRole}/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(fetchRecommendationsSuccess(resp.body))
    } else {
      yield put(fetchRecommendationsError(resp.body[Object.keys(resp.body)[0]]))
      yield call(AsyncStorage.removeItem, 'accessToken')
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export function* filterUsers(action: StartFilteringUserActionI) {
  //saga for getting a filtered list of users
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')

    const name = action.payload.name

    const resp = yield call(
      fetchMethod,
      name
        ? `${
            Platform.OS === 'ios'
              ? LOCAL_DEV_BASE_BACKEND_URL_IOS
              : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
          }/userrecommendation/generalusers/?name=${name}`
        : `${
            Platform.OS === 'ios'
              ? LOCAL_DEV_BASE_BACKEND_URL_IOS
              : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
          }/userrecommendation/generalusers/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(filterUserSuccess(resp.body.results))
    } else {
      yield put(filterUserError(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export default function* watchGetRecommendations(): SagaIterator {
  //overall saga for AddresseeListScreen
  yield takeLatest(types.GET_RECOMMENDATIONS, fetchRecommendationList)
  yield takeLatest(types.FILTER_USER, filterUsers)
}
