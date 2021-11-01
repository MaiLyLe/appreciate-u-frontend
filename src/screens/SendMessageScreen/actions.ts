import { Action } from 'redux'
import * as types from './constants'

/**
 * Redux actions for SendMessageScreen backend requests
 */

interface AppAction extends Action {
  payload?: any
}

export interface MountAndResetI extends AppAction {
  type: 'MOUNT_AND_RESET'
}

export interface StartSendMessageActionI extends Action {
  type: 'SEND_MESSAGE_START'
  payload: {
    receiver_id: string
    text: string
  }
}

export interface SendMessageSuccessActionI extends Action {
  type: 'SEND_MESSAGE_SUCCESS'
}

export interface SendMessageErrorActionI extends Action {
  type: 'SEND_MESSAGE_ERROR'
  payload: { errorMessage: string }
}

export const mountAndReset = (): MountAndResetI => {
  return {
    type: types.MOUNT_AND_RESET,
  }
}

export const startSendMessage = (
  receiverId: string,
  text: string,
): StartSendMessageActionI => {
  return {
    type: types.SEND_MESSAGE_START,
    payload: {
      receiver_id: receiverId,
      text,
    },
  }
}
export const sendMessageSuccess = (): SendMessageSuccessActionI => {
  return {
    type: types.SEND_MESSAGE_SUCCESS,
  }
}

export const sendMessageError = (
  errorMessage: string,
): SendMessageErrorActionI => {
  return {
    type: types.SEND_MESSAGE_ERROR,
    payload: { errorMessage },
  }
}
