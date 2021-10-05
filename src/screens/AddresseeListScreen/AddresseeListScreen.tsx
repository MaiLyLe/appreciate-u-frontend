import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { Icon } from 'react-native-elements'
import { LOCAL_DEV_BASE_BACKEND_URL } from '@env'
import { RootState } from '../../rootReduxSaga/interfaces'
import { Student, Professor, Receiver, User } from '../../globalTypes'
import { RouteProp } from '@react-navigation/native'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import { MessageJourneyStackParamsList } from '../../navigation/navigatorTypes'
import AsyncStorage from '@react-native-community/async-storage'
import { filterUser, startFetchingRecommendations } from './actions'
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
  const filteredusers = useSelector((state: RootState) => {
    return state.filteredUsers?.filteredUsers
  })
  const receiver = route.params?.receiverType ? route.params.receiverType : null
  const [role, setRole] = React.useState<null | string>(null)
  const [accessToken, setAccessToken] = React.useState<null | string>(null)
  const [searchParam, setSearchParam] = React.useState('')
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
    } else if (role && accessToken && !receiver) {
      dispatch(filterUser(searchParam))
    }
  }, [role, accessToken])

  React.useEffect(() => {
    if (searchParam) {
      dispatch(filterUser(searchParam))
    }
  }, [searchParam])

  const navigateTo = (
    name: string,
    id: number,
    avatar_num: number,
    user_image?: string,
    receiver?: Receiver,
  ) => {
    //navigates to SendMessageScreen

    navigation.navigate({
      name: 'SendMessage',
      params: {
        receiverId: id,
        //@ts-ignore
        receiverType: receiver ? Receiver[receiver.toUpperCase()] : null,
        name: name,
        avatar_num: avatar_num,
        user_image,
      },
    })
  }

  return (
    <ScreenImageBackground>
      {!route.params.receiverType && (
        <S.SearchInputContainer>
          <S.UsernameSearchInput
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setSearchParam(e.nativeEvent.text)
            }}
          ></S.UsernameSearchInput>
          <S.SearchIconContainer>
            <Icon type="antdesign" name={'search1'} color={'#9a9c9e'} />
          </S.SearchIconContainer>
        </S.SearchInputContainer>
      )}
      <S.Container isFiltered={route.params.receiverType === null}>
        {!route.params.receiverType ? (
          //@ts-ignore
          <S.FlatList<User>
            keyExtractor={(item: User, index) => item.id}
            data={filteredusers}
            numColumns={2}
            renderItem={(result: { item: User; index: number }) => {
              return (
                <S.Card
                  isFiltered={true}
                  isFirstTwo={result.index === 0 || result.index === 1}
                  itemsLengthIsOne={filteredusers?.length === 1}
                >
                  <S.AvatarButton
                    onPress={() => {
                      //@ts-ignore
                      navigateTo(
                        result.item.name,
                        //@ts-ignore
                        result.item.id,
                        //@ts-ignore
                        parseInt(result.item.avatar_num),
                        result?.item?.user_image
                          ? `${result?.item?.user_image}`
                          : undefined,
                      )
                    }}
                  >
                    <AvatarCircle
                      radius={100}
                      //@ts-ignore
                      avatar_num={parseInt(result.item.avatar_num)}
                      uri={
                        result?.item?.user_image
                          ? `${result?.item?.user_image}`
                          : undefined
                      }
                    ></AvatarCircle>
                  </S.AvatarButton>
                  <S.NameText>{result.item.name}</S.NameText>
                  {result.item.is_professor
                    ? result.item.professor?.institute?.name && (
                        <>
                          <S.RoleName>{'Professor'}</S.RoleName>
                          <S.CourseOfStudiesName>
                            {result.item.professor?.institute?.name}
                          </S.CourseOfStudiesName>
                        </>
                      )
                    : result.item.student?.institute?.name && (
                        <>
                          <S.RoleName>{'Student'}</S.RoleName>
                          <S.CourseOfStudiesName>
                            {result.item.student?.institute?.name}
                          </S.CourseOfStudiesName>
                        </>
                      )}
                </S.Card>
              )
            }}
          ></S.FlatList>
        ) : (
          // @ts-ignore
          <S.FlatList<Student | Professor>
            keyExtractor={(item: Student | Professor, index) => item.id}
            data={recommendationsList}
            numColumns={2}
            renderItem={(result: {
              item: Student | Professor
              index: number
            }) => {
              return (
                <S.Card
                  isFiltered={false}
                  isFirstTwo={result.index === 0 || result.index === 1}
                  itemsLengthIsOne={recommendationsList?.length === 1}
                >
                  <S.AvatarButton
                    onPress={() => {
                      navigateTo(
                        // @ts-ignore
                        result.item.user.name,
                        // @ts-ignore
                        result.item.user.id,
                        // @ts-ignore
                        parseInt(result.item.user.avatar_num),
                        result?.item?.user?.user_image
                          ? `${LOCAL_DEV_BASE_BACKEND_URL}${result?.item?.user?.user_image}`
                          : undefined,
                        route.params?.receiverType,
                      )
                    }}
                  >
                    <AvatarCircle
                      radius={100}
                      avatar_num={parseInt(
                        // @ts-ignore
                        result?.item?.user?.avatar_num
                          ? result.item.user.avatar_num
                          : null,
                      )}
                      uri={
                        result?.item?.user?.user_image
                          ? `${LOCAL_DEV_BASE_BACKEND_URL}${result?.item?.user?.user_image}`
                          : undefined
                      }
                    ></AvatarCircle>
                  </S.AvatarButton>
                  {/* @ts-ignore */}
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
        )}
        {/**@ts-ignore*/}
      </S.Container>
    </ScreenImageBackground>
  )
}

export default AddresseeListScreen
