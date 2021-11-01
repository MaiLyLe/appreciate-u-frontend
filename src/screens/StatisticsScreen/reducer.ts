import { fromJS } from 'immutable'
import {
  GetPieChartStatsI,
  GetPieChartStatsSuccessI,
  GetPieChartStatsErrorI,
  GetBarChartStatsI,
  GetBarChartStatsSuccessI,
  GetBarChartStatsErrorI,
} from './actions'
import * as types from './constants'

/**
 * Pie Reducer for StatisticsScreen states
 */

const initialPieChartState = fromJS({
  loading: false,
  error: null,
  success: false,
  stats: null,
})

export const fetchPieStatsReducer = (
  initialState = initialPieChartState,
  action: GetPieChartStatsI | GetPieChartStatsSuccessI | GetPieChartStatsErrorI,
) => {
  //reducer for fetching pie chart stats from backend
  switch (action.type) {
    case types.GET_PIE_CHART_STATS:
      return {
        ...initialState,
        loading: true,
      }
    case types.GET_PIE_CHART_STATS_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        stats: action.payload.stats,
      }
    case types.GET_PIE_CHART_STATS_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
        success: false,
      }
    default:
      return initialState
  }
}

/**
 * Bar Reducer for StatisticsScreen states
 */

const initialBarChartState = fromJS({
  loading: false,
  error: null,
  success: false,
  stats: null,
})

export const fetchBarStatsReducer = (
  initialState = initialBarChartState,
  action: GetBarChartStatsI | GetBarChartStatsSuccessI | GetBarChartStatsErrorI,
) => {
  //reducer for fetching bar chart stats from backend
  switch (action.type) {
    case types.GET_BAR_CHART_STATS:
      return {
        ...initialState,
        loading: true,
      }
    case types.GET_BAR_CHART_STATS_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        stats: action.payload.stats,
      }
    case types.GET_BAR_CHART_STATS_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
        success: false,
      }
    default:
      return initialState
  }
}
