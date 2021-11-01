import { NavigatorScreenParams } from '@react-navigation/native'
import { Receiver } from '../globalTypes'

/**
 * Typescript types for all navigators
 */

export type MessageJourneyStackParamsList = {
  ChooseRoleToMessage: undefined
  AddresseeList: { receiverType?: Receiver }
  SendMessage: {
    receiverId?: number
    receiverType?: Receiver
    name?: string
    avatar_num: number
    user_image?: string
  }
}

export type RegistrationJourneyStackParamsList = {
  Login: undefined
  UserRegistration: undefined
}

export type StatisticsStackParamsList = {
  Statistics: undefined
}

export type AccountStackParamsList = {
  Account: undefined
}

export type ReceivedMessageStackParamsList = {
  ReceivedMessagesList: undefined
  MessageDetail: {
    message_id: number
  }
}

export type TabBarStackParamsList = {
  MessageJourneyStack: NavigatorScreenParams<MessageJourneyStackParamsList>
  ReceivedMessagesOverviewStack: ReceivedMessageStackParamsList
  StatisticsStack: StatisticsStackParamsList
  AccountStack: AccountStackParamsList
}

export type RootNavigatorParamsList = {
  LoginRegisterJourneyStack: RegistrationJourneyStackParamsList
  Splash: undefined
  TabBar: NavigatorScreenParams<TabBarStackParamsList>
}
