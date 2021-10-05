import React from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { RootState } from '../../rootReduxSaga/interfaces'
import { differenceInDays } from 'date-fns'

import { MessageJourneyStackParamsList } from '../../navigation/navigatorTypes'
import { Receiver } from '../../globalTypes'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import GradientButton from '../../components/GradientButton/GradientButton'
import GoogleSigninOverlay from '../../overlays/GoogleSigninOverlay/GoogleSigninOverlay'
import * as S from './styles'

type ChooseRoleToMessageParamsList = StackNavigationProp<
  MessageJourneyStackParamsList,
  'ChooseRoleToMessage'
>

type ChooseRoleToMessageProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: ChooseRoleToMessageParamsList
}

/**
 * ChooseRoleToMessageScreen displays buttons which lead to recommendation list
 * of people logged-in user can message.
 * Each button represents a role you can message, in this case "Professors" or "Students"
 * ChooseRoleToMessageScreen is the first screen that the user sees when they log in.
 */

const roles = Object.keys(Receiver).map((role) => role.toUpperCase())

const ChooseRoleToMessageScreen: React.FC<ChooseRoleToMessageProps> = ({
  navigation,
}) => {
  const google_contacts_last_updated = useSelector((state: RootState) => {
    return state.userData?.google_last_updated
  })
  const [
    isGoogleSigninOverlayVisible,
    setGoogleSigninOverlayVisible,
  ] = React.useState(false)

  const navigateTo = (receiver?: string | null) => {
    //navigates to AddresseeListScreen
    navigation.navigate({
      name: 'AddresseeList',
      params: { receiverType: receiver ? Receiver[receiver] : null },
    })
  }

  const closeGoogleOverlay = () => {
    //Closes google overlay
    setGoogleSigninOverlayVisible(false)
  }

  React.useEffect(() => {
    //Should only show GoogleSigninOverlay
    //if the last update of google contacts synchronization was 7 days ago.
    if (
      google_contacts_last_updated &&
      differenceInDays(new Date(), new Date(google_contacts_last_updated)) > 7
    ) {
      setGoogleSigninOverlayVisible(true)
    }
    //for showcase purposes this will be executed, remove this when in production
    setGoogleSigninOverlayVisible(true)
  }, [google_contacts_last_updated])

  return (
    <S.Container>
      <GoogleSigninOverlay
        isVisible={isGoogleSigninOverlayVisible}
        toggleOverlay={closeGoogleOverlay}
      />
      <ScreenImageBackground
        isContentVerticallyCentered={true}
        paddingSides={20}
      >
        {roles.map((role: any, i) => {
          return (
            <GradientButton
              isGradientReversed={i % 2 !== 0}
              buttonText={`THANK A ${role}`}
              onPress={() => {
                navigateTo(role)
              }}
            ></GradientButton>
          )
        })}
        <GradientButton
          isGradientReversed={false}
          buttonText={`SEARCH FOR A USER`}
          onPress={() => {
            navigateTo(null)
          }}
          colorArray={['#D63D72', '#abc1cf', '#3DCFD6']}
        ></GradientButton>
      </ScreenImageBackground>
    </S.Container>
  )
}

export default ChooseRoleToMessageScreen
