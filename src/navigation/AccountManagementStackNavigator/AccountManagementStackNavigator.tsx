import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AccountStackParamsList } from '../navigatorTypes'
import LogOutButton from '../../components/LogOutButton/LogOutButton'
import AccountManagementScreen from '../../screens/AccountManagementScreen/AccountManagementScreen'

const AccountManagementStack = createStackNavigator<AccountStackParamsList>()

/**
 * Stack navigator for user account management section
 * only has one screen
 */

const AccountManagementStackNavigator: React.FC = () => {
  const { Navigator, Screen } = AccountManagementStack

  return (
    <Navigator
      initialRouteName="Account"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#91CFA2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => {
          return <LogOutButton />
        },
      }}
    >
      <Screen
        name="Account"
        component={AccountManagementScreen}
        options={{
          title: 'AcccountManagement on Messages',
        }}
      />
    </Navigator>
  )
}

export default AccountManagementStackNavigator
