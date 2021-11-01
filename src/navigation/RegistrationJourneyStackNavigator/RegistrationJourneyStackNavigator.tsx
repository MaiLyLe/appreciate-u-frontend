import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RegistrationJourneyStackParamsList } from '../navigatorTypes'
import UserRegistrationScreen from '../../screens/UserRegistrationScreen/UserRegistrationScreen'
import LoginScreen from '../../screens/LoginScreen/LoginScreen'

/**
 * Stack navigator for Login & Register Journey
 * consists of Login Screen and UserRegistration screen
 */
const RegistrationStack = createStackNavigator<RegistrationJourneyStackParamsList>()

const RegistrationJourneyStackNavigator: React.FC = () => {
  const { Navigator, Screen } = RegistrationStack

  return (
    <Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#91CFA2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Screen name="Login" component={LoginScreen} />
      <Screen
        name="UserRegistration"
        component={UserRegistrationScreen}
        options={({ route }) => ({
          title: 'Register',
        })}
      />
    </Navigator>
  )
}

export default RegistrationJourneyStackNavigator
