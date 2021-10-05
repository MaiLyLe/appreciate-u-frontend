import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StatisticsStackParamsList } from '../navigatorTypes'
import LogOutButton from '../../components/LogOutButton/LogOutButton'
import StatisticsScreen from '../../screens/StatisticsScreen/StatisticsScreen'

const ReceivedMessageStack = createStackNavigator<StatisticsStackParamsList>()

/**
 * Stack Navigator for screens that represent messaging a user starting with
 * ReceivedMessagesOverviewScreen and DetailReceivedMessageScreen
 * Stack of these screens is inside one of tabs of TabNavigation
 */

const StatisticsStackNavigator: React.FC = () => {
  const { Navigator, Screen } = ReceivedMessageStack

  return (
    <Navigator
      initialRouteName="Statistics"
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
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: 'Statistics on Messages',
        }}
      />
    </Navigator>
  )
}

export default StatisticsStackNavigator
