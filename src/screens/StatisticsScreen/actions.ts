import { Action } from 'redux'
import * as types from './constants'
import { PieChartStats, BarChartStats } from '../../globalTypes'

/**
 * Redux actions for StatisticsScreen backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface GetPieChartStatsI extends AppAction {
  type: 'GET_PIE_CHART_STATS'
}

export interface GetPieChartStatsSuccessI extends AppAction {
  type: 'GET_PIE_CHART_STATS_SUCCESS'
  payload: {
    stats: PieChartStats
  }
}

export interface GetPieChartStatsErrorI extends AppAction {
  type: 'GET_PIE_CHART_STATS_ERROR'
  payload: { errorMessage: string }
}

export interface GetBarChartStatsI extends AppAction {
  type: 'GET_BAR_CHART_STATS'
}

export interface GetBarChartStatsSuccessI extends AppAction {
  type: 'GET_BAR_CHART_STATS_SUCCESS'
  payload: {
    stats: BarChartStats
  }
}

export interface GetBarChartStatsErrorI extends AppAction {
  type: 'GET_BAR_CHART_STATS_ERROR'
  payload: { errorMessage: string }
}

export const getPieChartStats = (): GetPieChartStatsI => {
  return {
    type: types.GET_PIE_CHART_STATS,
  }
}

export const getPieChartStatsSuccess = (
  stats: PieChartStats,
): GetPieChartStatsSuccessI => {
  return {
    type: types.GET_PIE_CHART_STATS_SUCCESS,
    payload: {
      stats,
    },
  }
}

export const getPieChartStatsError = (
  errorMessage: string,
): GetPieChartStatsErrorI => {
  return {
    type: types.GET_PIE_CHART_STATS_ERROR,
    payload: {
      errorMessage,
    },
  }
}

export const getBarChartStats = (): GetBarChartStatsI => {
  return {
    type: types.GET_BAR_CHART_STATS,
  }
}

export const getBarChartStatsSuccess = (
  stats: BarChartStats,
): GetBarChartStatsSuccessI => {
  return {
    type: types.GET_BAR_CHART_STATS_SUCCESS,
    payload: {
      stats,
    },
  }
}

export const getBarChartStatsError = (
  errorMessage: string,
): GetBarChartStatsErrorI => {
  return {
    type: types.GET_BAR_CHART_STATS_ERROR,
    payload: {
      errorMessage,
    },
  }
}
