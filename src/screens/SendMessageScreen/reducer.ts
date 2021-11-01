import { fromJS } from 'immutable'
import {
  StartSendMessageActionI,
  SendMessageErrorActionI,
  SendMessageSuccessActionI,
  MountAndResetI,
} from './actions'
import * as types from './constants'

/**
 * Reducer for SendMessageScreen states
 */

const initialSendMessageState = fromJS({
  loading: false,
  error: null,
  success: false,
})

export const sendMessageReducer = (
  initialState = initialSendMessageState,
  action:
    | StartSendMessageActionI
    | SendMessageSuccessActionI
    | SendMessageErrorActionI
    | MountAndResetI,
) => {
  //reducer for posting message to backend
  switch (action.type) {
    case types.MOUNT_AND_RESET:
      return { loading: false, success: false, error: false }
    case types.SEND_MESSAGE_START:
      return {
        ...initialState,
        loading: true,
      }
    case types.SEND_MESSAGE_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
      }
    case types.SEND_MESSAGE_ERROR:
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
