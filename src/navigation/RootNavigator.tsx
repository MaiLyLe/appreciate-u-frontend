import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { createStackNavigator } from '@react-navigation/stack'
import { RootState } from '../rootReduxSaga/interfaces'
import { RootNavigatorParamsList } from './navigatorTypes'
import TabNavigator from './TabNavigation/TabNavigator'
import LoginScreen from '../screens/LoginScreen/LoginScreen'
import RegistrationJourneyStackNavigator from './RegistrationJourneyStackNavigator/RegistrationJourneyStackNavigator'
import { getUserData, startPollingTokenVerified } from './actions'
const RootStack = createStackNavigator<RootNavigatorParamsList>()

/**
 * Main navigator which is also a stack navigator containing just one element:
 * namely the TabNavigator
 */

const RootNavigator: React.FC = () => {
  const { Navigator, Screen } = RootStack
  const [isTokenValid, setIsTokenValid] = React.useState(false)
  const loginSuccess = useSelector((state: RootState) => {
    return state.jwtToken?.accessToken
  })

  const numberOfMessagesNotSeen = useSelector((state: RootState) => {
    return state.numberUnreadMessages?.number_unread_messages
  })
  const fetchRoleSuccess = useSelector((state: RootState) => {
    return state.userData?.success
  })
  const tokenExpired = useSelector((state: RootState) => {
    return state.verifyTokenPolling?.tokenExpired
  })

  const [role, setRole] = React.useState<null | string>(null)
  const [accessToken, setAccessToken] = React.useState<null | string>(null)
  const dispatch = useDispatch()

  const getAccessToken = async () => {
    //gets access token from AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken')
    setAccessToken(accessToken)
  }

  const getRole = async () => {
    const role = await AsyncStorage.getItem('role')
    setRole(role)
  }

  React.useEffect(() => {
    if (loginSuccess) {
      getAccessToken()
      getRole()
    }
  }, [loginSuccess])

  React.useEffect(() => {
    //checks if token is expired
    //if yes then do logout action
    if (accessToken && tokenExpired) {
      dispatch({
        type: 'USER_LOGOUT',
      })
    }
  }, [tokenExpired])

  React.useEffect(() => {
    //starts backend request for general user data
    if (accessToken) {
      dispatch(getUserData(accessToken))
    }
  }, [accessToken])

  React.useEffect(() => {
    //starts polling for token verification
    if (role && fetchRoleSuccess) {
      setIsTokenValid(true)
      dispatch(startPollingTokenVerified())
    } else {
      setIsTokenValid(false)
    }
  }, [role, fetchRoleSuccess])

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
      {!isTokenValid || !accessToken ? (
        <>
          <Screen
            name="LoginRegisterJourneyStack"
            component={RegistrationJourneyStackNavigator}
          />
        </>
      ) : (
        <Screen
          name="TabBar"
          {...numberOfMessagesNotSeen}
          component={TabNavigator}
        />
      )}
    </Navigator>
  )
}

export default RootNavigator
