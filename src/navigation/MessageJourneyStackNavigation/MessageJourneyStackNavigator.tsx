import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MessageJourneyStackParamsList } from '../navigatorTypes'
import ChooseRoleToMessageScreen from '../../screens/ChooseRoleToMessageScreen/ChooseRoleToMessageScreen'
import AddresseeListScreen from '../../screens/AddresseeListScreen/AddresseeListScreen'
import SendMessageScreen from '../../screens/SendMessageScreen/SendMessageScreen'
import LogOutButton from '../../components/LogOutButton/LogOutButton'

const MessageJourneyStack = createStackNavigator<MessageJourneyStackParamsList>()

/**
 * Stack Navigator for screens that represent messaging a user starting with
 * ChooseRoleToMessageScreen, then AddresseeListScreen and lastly SendMessageScreen
 * Stack of these screens is inside one of tabs of TabNavigator
 */

const MessageJourneyStackNavigator: React.FC = () => {
  const { Navigator, Screen } = MessageJourneyStack

  return (
    <Navigator
      initialRouteName="ChooseRoleToMessage"
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
        name="ChooseRoleToMessage"
        component={ChooseRoleToMessageScreen}
        options={{
          title: 'Role to message',
        }}
      />
      <Screen
        name="AddresseeList"
        component={AddresseeListScreen}
        options={({ route }) => ({
          title: route.params.receiverType
            ? `Choose a ${
                route.params.receiverType?.charAt(0)?.toUpperCase() +
                route.params.receiverType?.slice(1)
              }`
            : 'Search for User',
        })}
      />
      <Screen
        name="SendMessage"
        component={SendMessageScreen}
        options={({ route }) => ({
          title: `Message for ${
            route.params.receiverType
              ? route.params.receiverType?.charAt(0)?.toUpperCase() +
                route.params.receiverType?.slice(1)
              : ''
          } ${route.params.name}`,
        })}
      />
    </Navigator>
  )
}

export default MessageJourneyStackNavigator
