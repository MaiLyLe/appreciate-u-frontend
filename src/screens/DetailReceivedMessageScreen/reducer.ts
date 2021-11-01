import { fromJS } from 'immutable'
import {
  GetMessageDetailI,
  GetMessageDetailSuccessI,
  GetMessageDetailErrorI,
} from './actions'
import * as types from './constants'

/**
 * Reducer for DetailReceivedMessageScreen states
 */

const initialMessageDetailState = fromJS({
  loading: false,
  message: null,
  error: null,
  success: false,
})

export const getMessageDetailReducer = (
  initialState = initialMessageDetailState,
  action: GetMessageDetailI | GetMessageDetailSuccessI | GetMessageDetailErrorI,
) => {
  //reducer for fetching message detail
  switch (action.type) {
    case types.GET_MESSAGE_DETAIL:
      return { loading: true, success: false, error: false }
    case types.GET_MESSAGE_DETAIL_SUCCESS:
      return {
        ...initialState,
        message: action.payload.message,
      }
    case types.GET_MESSAGES_DETAIL_ERROR:
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
