import { Action } from 'redux'
import * as types from './constants'

/**
 * Redux actions for TabNavigator backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface StartPollingNumberUnreadMessagesI extends AppAction {
  type: 'START_POLLING_NUMBER_OF_UNREAD_MESSAGES'
}

export interface PollingNumberUnreadMessagesSuccessI extends AppAction {
  type: 'POLLING_NUMBER_OF_UNREAD_MESSAGES_SUCCESS'
  payload: {
    number_unread_messages: number
    total_number_messages: number
  }
}

export interface PollingNumberUnreadMessagesErrorI extends AppAction {
  type: 'POLLING_NUMBER_OF_UNREAD_MESSAGES_ERROR'
  payload: { errorMessage: string }
}

export interface CancelPollingNumberUnreadMessagesI extends AppAction {
  type: 'CANCEL_POLLING_NUMBER_OF_UNREAD_MESSAGES'
}

export const startPollingNumberUnreadMessages = (): StartPollingNumberUnreadMessagesI => {
  return {
    type: types.START_POLLING_NUMBER_OF_UNREAD_MESSAGES,
  }
}

export const getPollingNumberUnreadMessagesSuccess = (
  number_unread_messages: number,
  total_number_messages: number,
): PollingNumberUnreadMessagesSuccessI => {
  return {
    type: types.POLLING_NUMBER_OF_UNREAD_MESSAGES_SUCCESS,
    payload: {
      number_unread_messages,
      total_number_messages,
    },
  }
}

export const getPollingNumberUnreadMessagesError = (
  errorMessage: string,
): PollingNumberUnreadMessagesErrorI => {
  return {
    type: types.POLLING_NUMBER_OF_UNREAD_MESSAGES_ERROR,
    payload: {
      errorMessage,
    },
  }
}

export const cancelPollingNumberUnreadMessages = (): CancelPollingNumberUnreadMessagesI => {
  return {
    type: types.CANCEL_POLLING_NUMBER_OF_UNREAD_MESSAGES,
  }
}
