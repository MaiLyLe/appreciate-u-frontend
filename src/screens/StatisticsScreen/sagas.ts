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
  GetPieChartStatsI,
  GetBarChartStatsI,
  getPieChartStatsSuccess,
  getBarChartStatsSuccess,
  getPieChartStatsError,
  getBarChartStatsError,
} from './actions'

/**
 * Sagas for StatisticsScreen backend requests
 */

export function* fetchPieChartStats(action: GetPieChartStatsI) {
  //saga for fetching pie chart stats from backend
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const resp = yield call(
      fetchMethod,
      `${
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
      }/messagestatistics/messagestatistics/total-numbers-statistics-pie-chart/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(getPieChartStatsSuccess(resp.body))
    } else {
      yield put(getPieChartStatsError(resp.body[Object.keys(resp.body)[0]]))
      yield call(AsyncStorage.removeItem, 'accessToken')
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export function* fetchBarChartStats(action: GetBarChartStatsI) {
  //saga for fetching bar chart stats from backend
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const resp = yield call(
      fetchMethod,
      `${
        Platform.OS === 'ios'
          ? LOCAL_DEV_BASE_BACKEND_URL_IOS
          : LOCAL_DEV_BASE_BACKEND_URL_ANDROID
      }/messagestatistics/messagestatistics/total-amount-array-bar-chart/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(getBarChartStatsSuccess(resp.body))
    } else {
      yield put(getBarChartStatsError(resp.body[Object.keys(resp.body)[0]]))
      if (resp.status === 401) {
        yield put(logout())
      }
    }
  } catch (err) {}
}

export default function* watchGetStats(): SagaIterator {
  //overall saga watcher for StatisticsScreen
  yield takeLatest(types.GET_PIE_CHART_STATS, fetchPieChartStats)
  yield takeLatest(types.GET_BAR_CHART_STATS, fetchBarChartStats)
}
