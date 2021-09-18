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
  }
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
}

export type RootNavigatorParamsList = {
  Login: undefined
  Splash: undefined
  TabBar: NavigatorScreenParams<TabBarStackParamsList>
}
