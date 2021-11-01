import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { createStackNavigator } from '@react-navigation/stack'
import { RootState } from '../rootReduxSaga/interfaces'
import { RootNavigatorParamsList } from './navigatorTypes'
import TabNavigator from './TabNavigation/TabNavigator'
import RegistrationJourneyStackNavigator from './RegistrationJourneyStackNavigator/RegistrationJourneyStackNavigator'
import { getUserData, startLogoutTimer } from './actions'
const RootStack = createStackNavigator<RootNavigatorParamsList>()

/**
 * Main navigator which is also a stack navigator containing just one element:
 * namely the TabNavigator
 */

const RootNavigator: React.FC = () => {
  const { Navigator, Screen } = RootStack
  const loginSuccess = useSelector((state: RootState) => {
    return state.jwtToken?.accessToken
  })

  const numberOfMessagesNotSeen = useSelector((state: RootState) => {
    return state.numberUnreadMessages?.number_unread_messages
  })

  const dispatch = useDispatch()

  const saveStartTimeForLogoutTimer = async () => {
    //saves start time for logout timer to AsyncStorage
    await AsyncStorage.setItem(
      'start_time_logout_timer',
      new Date().toISOString(),
    )
  }

  React.useEffect(() => {
    //if login successful, values saved to AsyncStorage are retrieved
    //starts backend request for general user data
    //starts logout timer
    if (loginSuccess) {
      dispatch(getUserData())
      saveStartTimeForLogoutTimer()
      dispatch(startLogoutTimer())
    }
  }, [loginSuccess])

  return (
    <Navigator
      headerMode="none"
      mode="modal"
      screenOptions={({ route }) => {
        return {
          animationEnabled: true,
          gestureEnabled: true,
        }
      }}
    >
      {loginSuccess ? (
        <Screen
          name="TabBar"
          {...numberOfMessagesNotSeen}
          component={TabNavigator}
        />
      ) : (
        <>
          <Screen
            name="LoginRegisterJourneyStack"
            component={RegistrationJourneyStackNavigator}
          />
        </>
      )}
    </Navigator>
  )
}

export default RootNavigator
