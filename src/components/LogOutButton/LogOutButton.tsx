import React from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import * as S from './styles'

import { cancelPollingNumberUnreadMessages } from '../../navigation/TabNavigation/actions'
import { stopLogoutTimer } from '../../navigation/actions'

type LogOutButtonProps = {}

/**
 * Icon logout button that deletes data in AsyncStorage and Redux store on click
 */

const LogOutButton: React.FC<LogOutButtonProps> = ({}) => {
  const dispatch = useDispatch()

  const deleteRecentlyViewedMessageIds = async () => {
    //deletes list of ids of messages needed to stop rendering messages as new if user clicks on it in
    //ReceivedMessagesOverviewScreen to get to detail and comes back to ReceivedMessagesOverviewScreen
    try {
      await AsyncStorage.setItem('recentlySeenMessagesIds', '')
    } catch (e) {}
  }

  const deleteToken = async () => {
    //deletes token on logout
    try {
      await AsyncStorage.removeItem('accessToken')
    } catch (e) {}
  }

  const onLogout = () => {
    //dispatches action for reducer to delete everything in redux store
    //also cancels polling for number of unread messages
    //also cancels logout timer
    dispatch({
      type: 'USER_LOGOUT',
    })
    deleteRecentlyViewedMessageIds()
    deleteToken()
    dispatch(cancelPollingNumberUnreadMessages())
    dispatch(stopLogoutTimer())
  }
  return (
    <S.ButtonContainer>
      <S.Button onPress={onLogout}>
        <Icon type="antdesign" name={'logout'} color={'white'} />
      </S.Button>
    </S.ButtonContainer>
  )
}

export default LogOutButton
