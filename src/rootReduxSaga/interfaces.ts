import { Student, Professor, Message } from '../globalTypes'

/**
 * Typescript interfaces or types for reducers used across the app
 */

export interface RootState {
  readonly jwtToken?: LoginState
  readonly userData?: UserDataState
  readonly verifyTokenPolling?: VerifyTokenPollingState
  readonly recommendations?: RecommendationsState
  readonly sendMessage?: SendMessageState
  readonly messageList?: MessageListState
  readonly messageDetail?: MessageDetailState
  readonly numberUnreadMessages?: NumberUnreadMessagesState
}

export interface LoginState {
  loading: boolean
  accessToken?: string
  refreshToken?: string
  error?: string
}

export interface UserDataState {
  loading: boolean
  email?: string
  role?: string
  error?: string
  success: boolean
  google_last_updated: string
}

export interface VerifyTokenPollingState {
  polling?: boolean
  tokenVerified?: boolean
  tokenExpired?: boolean
}

export interface RecommendationsState {
  loading?: boolean
  recommendationsList?: Student[] | Professor[]
  error?: string
}

export interface SendMessageState {
  loading?: boolean
  success?: boolean
  error?: string
}

export interface MessageListState {
  loading: boolean
  messages?: Message[]
  hasNext: boolean
  error?: string
  totalMessageCount: number
}

export interface MessageDetailState {
  loading: boolean
  message: Message
  error?: string
  success: boolean
}

export interface NumberUnreadMessagesState {
  polling: boolean
  number_unread_messages: number
  total_number_messages: number
  numberUnreadMessagePollingCancelled: boolean
  error?: string
}
