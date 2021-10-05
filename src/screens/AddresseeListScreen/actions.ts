import { Action } from 'redux'
import * as types from './constants'
import { Student, Professor } from '../../globalTypes'

/**
 * Redux actions for AddresseeListScreen backend requests
 */

export interface StartFetchingRecommendationsActionI extends Action {
  type: 'GET_RECOMMENDATIONS'
  payload: {
    receiverType: string
    currentRole: string
    accessToken: string
  }
}

export interface GetRecommendationsSuccessActionI extends Action {
  type: 'GET_RECOMMENDATIONS_SUCCESS'
  payload: { recommendationsList: Student[] | Professor[] }
}

export interface GetRecommendationsErrorActionI extends Action {
  type: 'GET_RECOMMENDATIONS_ERROR'
  payload: { errorMessage: string }
}

export interface StartFilteringUserActionI extends Action {
  type: 'FILTER_USER'
  payload: {
    name: string
  }
}

export interface GetFilteredUsersSuccessActionI extends Action {
  type: 'FILTER_USER_SUCCESS'
  payload: { recommendationsList: Array<Student | Professor> }
}

export interface GetFilteredUsersErrorActionI extends Action {
  type: 'FILTER_USER_ERROR'
  payload: { errorMessage: string }
}

export const startFetchingRecommendations = (
  receiver: string,
  accessToken: string,
  currentRole: string,
): StartFetchingRecommendationsActionI => {
  return {
    type: types.GET_RECOMMENDATIONS,
    payload: {
      receiverType: receiver,
      currentRole: currentRole,
      accessToken: accessToken,
    },
  }
}

export const fetchRecommendationsSuccess = (
  recommendationsList: Student[] | Professor[],
): GetRecommendationsSuccessActionI => {
  return {
    type: types.GET_RECOMMENDATIONS_SUCCESS,
    payload: {
      recommendationsList,
    },
  }
}

export const fetchRecommendationsError = (
  errorMessage: string,
): GetRecommendationsErrorActionI => {
  return {
    type: types.GET_RECOMMENDATIONS_ERROR,
    payload: { errorMessage },
  }
}

export const filterUser = (name: string): StartFilteringUserActionI => {
  return {
    type: types.FILTER_USER,
    payload: { name },
  }
}

export const filterUserSuccess = (
  recommendationsList: Array<Student | Professor>,
): GetFilteredUsersSuccessActionI => {
  return {
    type: types.FILTER_USER_SUCCESS,
    payload: { recommendationsList: recommendationsList },
  }
}

export const filterUserError = (
  errorMessage: string,
): GetFilteredUsersErrorActionI => {
  return {
    type: types.FILTER_USER_ERROR,
    payload: { errorMessage },
  }
}
