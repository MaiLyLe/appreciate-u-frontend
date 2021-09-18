import { fromJS } from 'immutable'
import {
  CancelPollingNumberUnreadMessagesI,
  StartPollingNumberUnreadMessagesI,
  PollingNumberUnreadMessagesSuccessI,
  PollingNumberUnreadMessagesErrorI,
} from './actions'
import * as types from './constants'

/**
 * Redux reducers for TabNavigator backend requests
 */

const initialMessagePollingState = fromJS({
  polling: true,
  number_unread_messages: 0,
  total_number_messages: 0,
  numberUnreadMessagePollingCancelled: false,
  error: null,
})

export const pollNumberUnreadMessagesReducer = (
  initialState = initialMessagePollingState,
  action:
    | CancelPollingNumberUnreadMessagesI
    | StartPollingNumberUnreadMessagesI
    | PollingNumberUnreadMessagesErrorI
    | PollingNumberUnreadMessagesSuccessI,
) => {
  switch (action.type) {
    case types.START_POLLING_NUMBER_OF_UNREAD_MESSAGES:
      return { ...initialState, polling: true }
    case types.POLLING_NUMBER_OF_UNREAD_MESSAGES_SUCCESS:
      return {
        ...initialState,
        number_unread_messages: action.payload.number_unread_messages,
        total_number_messages: action.payload.total_number_messages,
      }
    case types.POLLING_NUMBER_OF_UNREAD_MESSAGES_ERROR:
      return {
        ...initialState,
        loading: false,
        error: action.payload.errorMessage,
      }
    case types.CANCEL_POLLING_NUMBER_OF_UNREAD_MESSAGES:
      return {
        ...initialState,
        numberUnreadMessagePollingCancelled: true,
        polling: false,
      }

    default:
      return initialState
  }
}
