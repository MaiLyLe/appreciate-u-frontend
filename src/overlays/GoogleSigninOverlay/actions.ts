import { Action } from 'redux'
import { GoogleContact } from '../../globalTypes'
import * as types from './constants'

/**
 * Redux interfaces and actions for GoogleSigninOverlay backend requests
 */

export interface PostGoogleContactsI extends Action {
  type: 'POST_GOOGLE_CONTACTS'
  payload: { contacts: GoogleContact[] }
}

export interface PostGoogleContactsSuccessActionI extends Action {
  type: 'POST_GOOGLE_CONTACTS_SUCCESS'
}

export interface PostGoogleContactsErrorActionI extends Action {
  type: 'POST_GOOGLE_CONTACTS_ERROR'
  payload: { errorMessage: string }
}

export const postGoogleContacts = (
  googleContacts: GoogleContact[],
): PostGoogleContactsI => {
  return {
    type: types.POST_GOOGLE_CONTACTS,
    payload: {
      contacts: googleContacts,
    },
  }
}

export const postGoogleContactsSuccess = (): PostGoogleContactsSuccessActionI => {
  return {
    type: types.POST_GOOGLE_CONTACTS_SUCCESS,
  }
}

export const postGoogleContactsError = (
  errorMessage: string,
): PostGoogleContactsErrorActionI => {
  return {
    type: types.POST_GOOGLE_CONTACTS_ERROR,
    payload: {
      errorMessage,
    },
  }
}
