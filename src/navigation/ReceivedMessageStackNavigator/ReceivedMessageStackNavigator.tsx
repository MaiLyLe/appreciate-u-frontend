import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ReceivedMessageStackParamsList } from '../navigatorTypes'
import ReceivedMessagesOverviewScreen from '../../screens/ReceivedMessagesOverviewScreen/ReceivedMessagesOverviewScreen'
import DetailReceivedMessageScreen from '../../screens/DetailReceivedMessageScreen/DetailReceivedMessageScreen'
import LogOutButton from '../../components/LogOutButton/LogOutButton'

const ReceivedMessageStack = createStackNavigator<ReceivedMessageStackParamsList>()

/**
 * Stack Navigator for screens that represent messaging a user starting with
 * ReceivedMessagesOverviewScreen and DetailReceivedMessageScreen
 * Stack of these screens is inside one of tabs of TabNavigation
 */

const ReceivedMessageStackNavigator: React.FC = () => {
  const { Navigator, Screen } = ReceivedMessageStack

  return (
    <Navigator
      initialRouteName="ReceivedMessagesList"
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
        name="ReceivedMessagesList"
        component={ReceivedMessagesOverviewScreen}
        options={{
          title: 'Messages sent to you',
        }}
      />
      <Screen
        name="MessageDetail"
        component={DetailReceivedMessageScreen}
        options={({ route }) => ({
          title: 'Full Message',
        })}
      />
    </Navigator>
  )
}

export default ReceivedMessageStackNavigator
