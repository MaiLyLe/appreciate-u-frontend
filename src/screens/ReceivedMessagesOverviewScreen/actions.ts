import { Action } from 'redux'
import * as types from './constants'
import { Message } from '../../globalTypes'

/**
 * Redux actions for ReceivedMessagesOverviewScreen backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface GetPaginatedMessagesI extends AppAction {
  type: 'GET_PAGINATED_MESSAGES'
  payload: {
    paginationNum: number
  }
}

export interface GetMessagesSuccessI extends AppAction {
  type: 'GET_MESSAGES_SUCCESS'
  payload: {
    messages: Message[]
    hasNext: boolean
    totalMessageCount: number
  }
}

export interface GetMessagesErrorI extends AppAction {
  type: 'GET_MESSAGES_ERROR'
  payload: { errorMessage: string }
}

export const getPaginatedMessages = (
  paginationNum: number,
): GetPaginatedMessagesI => {
  return {
    type: types.GET_PAGINATED_MESSAGES,
    payload: {
      paginationNum,
    },
  }
}

export const getMessagesSuccess = (
  messages: Message[],
  hasNext: boolean,
  totalMessageCount: number,
): GetMessagesSuccessI => {
  return {
    type: types.GET_MESSAGES_SUCCESS,
    payload: {
      messages,
      hasNext,
      totalMessageCount,
    },
  }
}

export const getMessagesError = (errorMessage: string): GetMessagesErrorI => {
  return {
    type: types.GET_MESSAGES_ERROR,
    payload: {
      errorMessage,
    },
  }
}
