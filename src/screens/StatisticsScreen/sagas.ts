import { call, put, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import { SagaIterator } from '@redux-saga/core'
import * as types from './constants'
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

const fetchMethod = (requestURL: string, accessToken: string) => {
  //fetch function for sagas
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

export function* fetchPieChartStats(action: GetPieChartStatsI) {
  //saga for getting list of recommendations of people that logged-in user can message
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const resp = yield call(
      fetchMethod,
      `${LOCAL_DEV_BASE_BACKEND_URL}/messagestatistics/messagestatistics/total-numbers-statistics-pie-chart/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(getPieChartStatsSuccess(resp.body))
    } else {
      yield put(getPieChartStatsError(resp.body[Object.keys(resp.body)[0]]))
      yield call(AsyncStorage.removeItem, 'accessToken')
    }
  } catch (err) {}
}

export function* fetchBarChartStats(action: GetBarChartStatsI) {
  try {
    const accessToken = yield call(AsyncStorage.getItem, 'accessToken')
    const resp = yield call(
      fetchMethod,
      `${LOCAL_DEV_BASE_BACKEND_URL}/messagestatistics/messagestatistics/total-amount-array-bar-chart/`,
      accessToken,
    )
    if (resp.status >= 200 && resp.status < 300) {
      yield put(getBarChartStatsSuccess(resp.body))
    } else {
      yield put(getBarChartStatsError(resp.body[Object.keys(resp.body)[0]]))
    }
  } catch (err) {}
}

export default function* watchGetStats(): SagaIterator {
  yield takeLatest(types.GET_PIE_CHART_STATS, fetchPieChartStats)
  yield takeLatest(types.GET_BAR_CHART_STATS, fetchBarChartStats)
}
