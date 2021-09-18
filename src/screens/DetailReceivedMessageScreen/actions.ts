import { Action } from 'redux'
import { Message } from '../../globalTypes'
import * as types from './constants'

/**
 * Redux actions for DetailReceivedMessageScreen backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface GetMessageDetailI extends AppAction {
  type: 'GET_MESSAGE_DETAIL'
  payload: {
    message_id: string
  }
}

export interface GetMessageDetailSuccessI extends AppAction {
  type: 'GET_MESSAGE_DETAIL_SUCCESS'
  payload: {
    message: Message
  }
}

export interface GetMessageDetailErrorI extends AppAction {
  type: 'GET_MESSAGES_DETAIL_ERROR'
  payload: { errorMessage: string }
}

export const getMessageDetail = (message_id: string): GetMessageDetailI => {
  return {
    type: types.GET_MESSAGE_DETAIL,
    payload: {
      message_id: message_id,
    },
  }
}

export const getMessageDetailSuccess = (
  message: Message,
): GetMessageDetailSuccessI => {
  return {
    type: types.GET_MESSAGE_DETAIL_SUCCESS,
    payload: {
      message,
    },
  }
}

export const getMessageDetailError = (
  errorMessage: string,
): GetMessageDetailErrorI => {
  return {
    type: types.GET_MESSAGES_DETAIL_ERROR,
    payload: {
      errorMessage,
    },
  }
}
