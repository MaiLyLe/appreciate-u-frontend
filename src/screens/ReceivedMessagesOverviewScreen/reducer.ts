import { fromJS } from 'immutable'
import {
  GetMessagesErrorI,
  GetMessagesSuccessI,
  GetPaginatedMessagesI,
} from './actions'
import * as types from './constants'

const initialMessageListState = fromJS({
  loading: true,
  messages: null,
  hasNext: true,
  error: null,
})

/**
 * Reducer for ReceivedMessagesOverviewScreen states
 */

export const pollMessagesReducer = (
  initialState = initialMessageListState,
  action: GetMessagesErrorI | GetMessagesSuccessI | GetPaginatedMessagesI,
) => {
  switch (action.type) {
    case types.GET_PAGINATED_MESSAGES:
      return { ...initialState, loading: true }
    case types.GET_MESSAGES_SUCCESS:
      return {
        ...initialState,
        messages: action.payload.messages,
        hasNext: action.payload.hasNext,
        totalMessageCount: action.payload.totalMessageCount,
        loading: false,
      }
    case types.GET_MESSAGES_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
      }
    default:
      return initialState
  }
}
