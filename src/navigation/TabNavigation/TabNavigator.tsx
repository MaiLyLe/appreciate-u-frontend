import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RootState } from '../../rootReduxSaga/interfaces'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'react-native-elements'
import { startPollingNumberUnreadMessages } from './actions'
import * as S from './styles'
import { TabBarStackParamsList } from '../navigatorTypes'
import MessageJourneyStackNavigator from '../MessageJourneyStackNavigation/MessageJourneyStackNavigator'
import ReceivedMessageStackNavigator from '../ReceivedMessageStackNavigator/ReceivedMessageStackNavigator'
import StatisticsStackNavigator from '../StatisticsStackNavigator/StatisticsStackNavigator'

const TabStack = createBottomTabNavigator<TabBarStackParamsList>()

interface TabContainerProps {
  /** Label string for the single tab */
  label?: string
  /** Boolean value to indicate that this is the active tab */
  focused?: boolean
  /** Number of new messages not seen by logged in user yet for the MessageJourneyStackNavigator tab*/
  numberOfMessagesNotSeen?: number
  /** Boolean value that indicates that this tab showcases number of messages not seen by logged in user*/
  showNumberOfMessagesBadge: boolean
}

/**
 * First component is a single tab container.
 * Second component is the tab navigator itself.
 * It represents the navigation at the bottom of the screen
 * where users can tab to get to a different stack of screens.
 * The TabNavigator contains the following stacks or stack navigators:
 * MessageJourneyStackNavigator
 * ReceivedMessagesStackNavigator
 * So it has two tab containers for both.
 */

const TabContainer: React.FC<TabContainerProps> = ({
  children,
  label,
  focused,
  showNumberOfMessagesBadge,
  numberOfMessagesNotSeen,
}) => (
  <S.TabContainerOuter>
    <S.TabContainer focused={focused}>
      {children}
      <S.TabLabel focused={focused}>{label}</S.TabLabel>
    </S.TabContainer>
    {showNumberOfMessagesBadge &&
    numberOfMessagesNotSeen &&
    numberOfMessagesNotSeen > 0 ? (
      <S.NumberOfMessagesReceivedBadge>
        <S.NumberOfMessagesLabel>
          {numberOfMessagesNotSeen.toString()}
        </S.NumberOfMessagesLabel>
      </S.NumberOfMessagesReceivedBadge>
    ) : (
      <></>
    )}
  </S.TabContainerOuter>
)

const TabNavigator: React.FC = () => {
  const { Navigator, Screen } = TabStack
  const numberOfMessagesNotSeen = useSelector((state: RootState) => {
    return state.numberUnreadMessages?.number_unread_messages
  })
  const dispatch = useDispatch()

  React.useEffect(() => {
    //starts polling backend via Redux/Saga for number of unread messages
    dispatch(startPollingNumberUnreadMessages())
  }, [])

  return (
    <Navigator
      initialRouteName="MessageJourneyStack"
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 70,
          backgroundColor: '#30444E',
          borderTopColor: 'rgba(0, 0, 0, 0)',
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let label, iconName: string
          let showNumberOfMessagesBadge = false

          switch (route.name) {
            case 'MessageJourneyStack':
              label = 'Send Thanks'
              showNumberOfMessagesBadge = false
              iconName = 'heart'
              break
            case 'ReceivedMessagesOverviewStack':
              label = 'Thanks Received'
              showNumberOfMessagesBadge = true
              iconName = 'send'
              break

            case 'StatisticsStack':
              label = 'Data'
              showNumberOfMessagesBadge = false
              iconName = 'bar-chart-o'
              break

            default:
              return null
          }
          return (
            <TabContainer
              label={label}
              focused={focused}
              showNumberOfMessagesBadge={showNumberOfMessagesBadge}
              numberOfMessagesNotSeen={numberOfMessagesNotSeen}
            >
              <Icon
                type="font-awesome"
                name={iconName}
                color={focused ? '#91CFA2' : '#ACBAC3'}
              />
            </TabContainer>
          )
        },
      })}
    >
      <Screen
        name="MessageJourneyStack"
        component={MessageJourneyStackNavigator}
      />
      <Screen
        name="ReceivedMessagesOverviewStack"
        component={ReceivedMessageStackNavigator}
      />
      <Screen name="StatisticsStack" component={StatisticsStackNavigator} />
    </Navigator>
  )
}

export default TabNavigator
