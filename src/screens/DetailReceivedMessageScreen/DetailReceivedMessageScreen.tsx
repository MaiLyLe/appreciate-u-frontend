import React from 'react'
import { format } from 'date-fns'
import AsyncStorage from '@react-native-community/async-storage'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import { RootState } from '../../rootReduxSaga/interfaces'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { RouteProp } from '@react-navigation/native'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import { StackNavigationProp } from '@react-navigation/stack'
import { ReceivedMessageStackParamsList } from '../../navigation/navigatorTypes'
import * as S from './styles'
import { getMessageDetail } from './actions'

type DetailReceivedMessageParamsList = StackNavigationProp<
  ReceivedMessageStackParamsList,
  'MessageDetail'
>

type DetailReceivedMessageProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: DetailReceivedMessageParamsList
  /** route object mainly to get params passed to this screen */
  route: RouteProp<ReceivedMessageStackParamsList, 'MessageDetail'>
}

/**
 * DetailReceivedMessageScreen displays one complete message the user wants to see
 */

const DetailReceivedMessageScreen: React.FC<DetailReceivedMessageProps> = ({
  route,
}) => {
  const message = useSelector((state: RootState) => {
    return state.messageDetail?.message
  })
  const dispatch = useDispatch()

  const saveMessageIdsRecentlySeen = async () => {
    //saves id of message to AsyncStorage to enable displaying newly received but now seen messages
    //as seen in the ReceivedMessagesOverviewScreen
    try {
      const messageId = route.params?.message_id.toString()
      let recentlySeenMessagesIdsStorage = await AsyncStorage.getItem(
        'recentlySeenMessagesIds',
      )

      let recentlySeenMessagesIds = recentlySeenMessagesIdsStorage
        ? typeof JSON.parse(recentlySeenMessagesIdsStorage) === 'number'
          ? [JSON.parse(recentlySeenMessagesIdsStorage).toString()]
          : JSON.parse(recentlySeenMessagesIdsStorage).map((el: number) =>
              el.toString(),
            )
        : []

      if (messageId && !recentlySeenMessagesIds.includes(messageId)) {
        recentlySeenMessagesIds.push(messageId.toString())
      }

      await AsyncStorage.setItem(
        'recentlySeenMessagesIds',
        JSON.stringify(recentlySeenMessagesIds),
      )
    } catch (e) {}
  }

  React.useEffect(() => {
    //performs saveMessageIdsRecentlySeen action and fetches message from backend
    //on mounting component
    saveMessageIdsRecentlySeen()
    dispatch(getMessageDetail(route.params?.message_id.toString()))
  }, [])

  return (
    <ScreenImageBackground>
      <S.Container>
        <S.AvatarContainer>
          <AvatarCircle
            avatar_num={message ? parseInt(message?.avatar_num) : 1}
            radius={120}
          ></AvatarCircle>
        </S.AvatarContainer>
        <S.MessageCard>
          <S.Text>{message?.text}</S.Text>
        </S.MessageCard>
        {message && (
          <S.TextDate>{`${format(
            new Date(message.timestamp),
            'dd MMMM yyyy',
          )}`}</S.TextDate>
        )}
      </S.Container>
    </ScreenImageBackground>
  )
}

export default DetailReceivedMessageScreen
