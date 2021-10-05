import { fromJS } from 'immutable'
import {
  StartFetchingRecommendationsActionI,
  GetRecommendationsSuccessActionI,
  GetRecommendationsErrorActionI,
  StartFilteringUserActionI,
  GetFilteredUsersSuccessActionI,
  GetFilteredUsersErrorActionI,
} from './actions'
import * as types from './constants'

/**
 * Redux reducer for AddresseeListScreen states
 */

const initialRecommendationsState = fromJS({
  loading: false,
  recommendationsList: [],
  error: null,
})

export const recommendationsListReducer = (
  initialState = initialRecommendationsState,
  action:
    | StartFetchingRecommendationsActionI
    | GetRecommendationsSuccessActionI
    | GetRecommendationsErrorActionI,
) => {
  switch (action.type) {
    case types.GET_RECOMMENDATIONS:
      return {
        ...initialState,
        loading: true,
      }
    case types.GET_RECOMMENDATIONS_SUCCESS:
      return {
        ...initialState,
        loading: false,
        recommendationsList: action.payload.recommendationsList,
      }
    case types.GET_RECOMMENDATIONS_ERROR:
      return {
        ...initialState,
        error: action.payload.errorMessage,
      }
    default:
      return initialState
  }
}

const initialFilteredUsersState = fromJS({
  loading: false,
  filteredUsers: [],
  error: null,
})
export const filteredUsersReducer = (
  initialState = initialFilteredUsersState,
  action:
    | StartFilteringUserActionI
    | GetFilteredUsersSuccessActionI
    | GetFilteredUsersErrorActionI,
) => {
  switch (action.type) {
    case types.FILTER_USER:
      return {
        ...initialState,
        loading: true,
      }
    case types.FILTER_USER_SUCCESS:
      return {
        ...initialState,
        loading: false,
        filteredUsers: action.payload.recommendationsList,
      }
    case types.FILTER_USER_ERROR:
      return {
        ...initialState,
        error: action.payload.errorMessage,
      }
    default:
      return initialState
  }
}
