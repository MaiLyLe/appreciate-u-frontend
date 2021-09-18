import React from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import * as S from './styles'

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

  const onLogout = () => {
    //dispatches action for reducer to delete everything in redux store
    dispatch({
      type: 'USER_LOGOUT',
    })
    deleteRecentlyViewedMessageIds()
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
