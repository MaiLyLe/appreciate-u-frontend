import {
  Student,
  Professor,
  Message,
  PieChartStats,
  BarChartStats,
  Institute,
  FieldOfStudies,
  Course,
  ProfileData,
} from '../globalTypes'

/**
 * Typescript interfaces or types for reducers used across the app
 */

export interface RootState {
  readonly jwtToken?: LoginState
  readonly userData?: UserDataState
  readonly recommendations?: RecommendationsState
  readonly sendMessage?: SendMessageState
  readonly messageList?: MessageListState
  readonly messageDetail?: MessageDetailState
  readonly numberUnreadMessages?: NumberUnreadMessagesState
  readonly filteredUsers?: FilteredUsersState
  readonly pieChartStats?: PieChartState
  readonly barChartStats?: BarChartState
  readonly institutes?: InstituteState
  readonly fields?: FieldState
  readonly courses?: CourseState
  readonly createUser?: CreateUserState
  readonly profileData?: ProfileState
  readonly updateUser: UpdateUserState
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

export interface RecommendationsState {
  loading?: boolean
  recommendationsList?: Student[] | Professor[]
  error?: string
}

export interface FilteredUsersState {
  loading?: boolean
  filteredUsers?: Array<Student | Professor>
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

export interface PieChartState {
  loading: boolean
  error?: string
  success: boolean
  stats: PieChartStats
}

export interface BarChartState {
  loading: boolean
  error?: string
  success: boolean
  stats: BarChartStats
}

export interface InstituteState {
  loading: boolean
  error: string
  success: boolean
  institutes: Institute[]
}

export interface FieldState {
  loading: boolean
  error: string
  success: boolean
  fields: FieldOfStudies[]
}

export interface CourseState {
  loading: boolean
  error: string
  success: boolean
  courses: Course[]
}

export interface CreateUserState {
  loading: boolean
  error?: string
  success: boolean
}

export interface ProfileState {
  loading: boolean
  error: string
  success: boolean
  userData?: ProfileData
}

export interface UpdateUserState {
  loading: boolean
  error?: string
  success: boolean
}
