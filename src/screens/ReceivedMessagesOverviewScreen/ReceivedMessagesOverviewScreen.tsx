import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { Icon } from 'react-native-elements'
import { Message } from '../../globalTypes'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import { RootState } from '../../rootReduxSaga/interfaces'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'
import { ReceivedMessageStackParamsList } from '../../navigation/navigatorTypes'
import * as S from './styles'
import { getPaginatedMessages } from './actions'

type ReceivedMessagesOverviewScreenNavigationProp = StackNavigationProp<
  ReceivedMessageStackParamsList,
  'ReceivedMessagesList'
>

type ReceivedMessagesOverviewProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: ReceivedMessagesOverviewScreenNavigationProp
}

/**
 * ReceivedOverviewScreen displays a list of messages sent to logged-in user
 */

const ReceivedMessagesOverviewScreen: React.FC<ReceivedMessagesOverviewProps> = ({
  navigation,
}) => {
  const messagesList = useSelector((state: RootState) => {
    return state.messageList?.messages
  })
  const numberUnreadMessages = useSelector((state: RootState) => {
    return state.numberUnreadMessages?.number_unread_messages
  })
  const totalNumberMessages = useSelector((state: RootState) => {
    return state.numberUnreadMessages?.total_number_messages
  })
  const loading = useSelector((state: RootState) => {
    return state.messageList?.loading
  })

  const [messageIdsRecentlySeen, setMessageIdsRecentlySeen] = React.useState<
    string[]
  >([])
  const dispatch = useDispatch()
  const [countPagination, setPaginationCount] = React.useState(1)

  const getMessageIdsRecentlySeen = async () => {
    //gets ids of messages the user has recently clicked on to mark them as "seen"
    try {
      const messageIds = await AsyncStorage.getItem('recentlySeenMessagesIds')
      if (messageIds?.length) {
        setMessageIdsRecentlySeen(JSON.parse(messageIds))
      }
    } catch (e) {}
  }

  useFocusEffect(React.useCallback(() => {}, [messageIdsRecentlySeen]))

  React.useEffect(() => {
    //performs getMessageIdsRecentlySeen
    //when user gets back to ReceivedMessagesOverviewScreen via back button
    const unsubscribe = navigation.addListener('focus', () => {
      getMessageIdsRecentlySeen()
    })
    return unsubscribe
  }, [navigation])

  React.useEffect(() => {
    //starts fetching paginaed message list on mounting component
    dispatch(getPaginatedMessages(countPagination))
  }, [])

  React.useEffect(() => {
    //starts fetching paginaed message list when numberUnredMessages state changes
    if (numberUnreadMessages && numberUnreadMessages > 0) {
      dispatch(getPaginatedMessages(countPagination))
    }
  }, [numberUnreadMessages])

  React.useEffect(() => {
    //starts fetching paginaed message list when user gets to next page of list
    dispatch(getPaginatedMessages(countPagination))
  }, [countPagination])

  const incrementPaginationCount = React.useCallback(
    () => setPaginationCount((countPagination) => countPagination + 1),
    [],
  )
  const decrementPaginationCount = React.useCallback(
    () => setPaginationCount((countPagination) => countPagination - 1),
    [],
  )

  const navigateTo = (message_id: number) => {
    //navigates to DetailReceivedMessageScreen
    navigation.navigate({
      name: 'MessageDetail',
      params: {
        message_id: message_id,
      },
    })
  }

  if (loading) {
    return <LoadingIndicator />
  }
  return (
    <ScreenImageBackground>
      {messagesList?.length ? (
        <S.MessageList<Message>
          keyExtractor={(item: Message, index) => item.id}
          data={messagesList}
          numColumns={1}
          contentContainerStyle={{
            justifyContent: 'center',
          }}
          renderItem={(result: { item: Message; index: number }) => {
            return (
              <S.MessageCard
                onPress={() => {
                  navigateTo(result.item.id)
                }}
                isSeen={
                  result.item.is_seen ||
                  messageIdsRecentlySeen.includes(result.item.id.toString())
                }
              >
                {!result.item.is_seen &&
                !messageIdsRecentlySeen.includes(result.item.id.toString()) ? (
                  <S.NumberOfMessagesReceivedBadge>
                    <S.NewLabel>{'New'}</S.NewLabel>
                  </S.NumberOfMessagesReceivedBadge>
                ) : (
                  <></>
                )}
                <S.AvatarField>
                  <AvatarCircle
                    avatar_num={parseInt(result.item.avatar_num)}
                    radius={70}
                    borderWidth={2}
                  ></AvatarCircle>
                </S.AvatarField>
                <S.TextField>
                  <S.Text>{`${format(
                    new Date(result.item.timestamp),
                    'dd MMMM yyyy',
                  )}`}</S.Text>
                  <S.MessageText>
                    {result.item.text.substring(0, 30) + ' ...'}
                  </S.MessageText>
                </S.TextField>
              </S.MessageCard>
            )
          }}
        ></S.MessageList>
      ) : (
        <S.EmptyMailBoxMessage>{'No Messages yet'}</S.EmptyMailBoxMessage>
      )}
      <S.PaginatorContainer>
        <S.PaginationButtonContainer>
          {countPagination > 1 && (
            <S.TouchableOpacity onPress={decrementPaginationCount}>
              <Icon type="ant-design" name={'doubleleft'} color={'#ACBAC3'} />
            </S.TouchableOpacity>
          )}
        </S.PaginationButtonContainer>
        {messagesList?.length ? (
          <S.PageNumer>{countPagination?.toString()}</S.PageNumer>
        ) : (
          <></>
        )}
        <S.PaginationButtonContainer>
          {totalNumberMessages && totalNumberMessages / countPagination > 5 ? (
            <S.TouchableOpacity onPress={incrementPaginationCount}>
              <Icon type="ant-design" name={'doubleright'} color={'#ACBAC3'} />
            </S.TouchableOpacity>
          ) : (
            <></>
          )}
        </S.PaginationButtonContainer>
      </S.PaginatorContainer>
    </ScreenImageBackground>
  )
}

export default ReceivedMessagesOverviewScreen
