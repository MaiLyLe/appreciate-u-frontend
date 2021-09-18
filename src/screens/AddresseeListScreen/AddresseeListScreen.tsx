import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootState } from '../../rootReduxSaga/interfaces'
import { Student, Professor, Receiver } from '../../globalTypes'
import { RouteProp } from '@react-navigation/native'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import { MessageJourneyStackParamsList } from '../../navigation/navigatorTypes'
import AsyncStorage from '@react-native-community/async-storage'
import { startFetchingRecommendations } from './actions'
import { useSelector, useDispatch } from 'react-redux'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import * as S from './styles'

type AddresseeListProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: StackNavigationProp<
    MessageJourneyStackParamsList,
    'AddresseeList'
  >
  /** route object mainly to get params passed to this screen */
  route: RouteProp<MessageJourneyStackParamsList, 'AddresseeList'>
}

/**
 * AddresseeListScreen displays a list of recommended users logged-in user can message
 */

const AddresseeListScreen: React.FC<AddresseeListProps> = ({
  route,
  navigation,
}) => {
  const recommendationsList = useSelector((state: RootState) => {
    return state.recommendations?.recommendationsList
  })
  const receiver = route.params?.receiverType ? route.params.receiverType : null
  const [role, setRole] = React.useState<null | string>(null)
  const [accessToken, setAccessToken] = React.useState<null | string>(null)
  const dispatch = useDispatch()

  const getRoleOfCurrentUser = async () => {
    //get role of logged-in user from AsyncSrorage
    const role = await AsyncStorage.getItem('role')
    setRole(role)
  }
  const getAccessToken = async () => {
    //gets accessToken of logged-in user from AsyncSrorage
    const accessToken = await AsyncStorage.getItem('accessToken')
    setAccessToken(accessToken)
  }

  React.useEffect(() => {
    //performs getRoleOfCurrentUser and getAccessToken on mount of component
    getRoleOfCurrentUser()
    getAccessToken()
  }, [])

  React.useEffect(() => {
    //starts fetching recommendations
    if (role && accessToken && receiver) {
      dispatch(startFetchingRecommendations(receiver, accessToken, role))
    }
  }, [role, accessToken])

  const navigateTo = (
    name: string,
    id: number,
    avatar_num: number,
    receiver?: Receiver,
  ) => {
    //navigates to SendMessageScreen
    if (receiver) {
      navigation.navigate({
        name: 'SendMessage',
        params: {
          receiverId: id,
          //@ts-ignore
          receiverType: Receiver[receiver.toUpperCase()],
          name: name,
          avatar_num: avatar_num,
        },
      })
    }
  }

  return (
    <ScreenImageBackground>
      <S.Container>
        {/**@ts-ignore*/}
        <S.FlatList<Student | Professor>
          keyExtractor={(item: Student | Professor, index) => item.id}
          data={recommendationsList}
          numColumns={2}
          renderItem={(result: {
            item: Student | Professor
            index: number
          }) => {
            return (
              <S.Card isFirstTwo={result.index === 0 || result.index === 1}>
                <S.AvatarButton
                  onPress={() => {
                    navigateTo(
                      result.item.user.name,
                      result.item.user.id,
                      parseInt(result.item.user.avatar_num),
                      route.params?.receiverType,
                    )
                  }}
                >
                  <AvatarCircle
                    radius={100}
                    avatar_num={parseInt(result.item.user.avatar_num)}
                  ></AvatarCircle>
                </S.AvatarButton>
                <S.NameText>{result.item.user.name}</S.NameText>
                {result.item.institute?.name && (
                  <S.CourseOfStudiesName>
                    {result.item.institute?.name}
                  </S.CourseOfStudiesName>
                )}
              </S.Card>
            )
          }}
        ></S.FlatList>
      </S.Container>
    </ScreenImageBackground>
  )
}

export default AddresseeListScreen
