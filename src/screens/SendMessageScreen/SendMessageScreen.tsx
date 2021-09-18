import React from 'react'
import Toast from 'react-native-toast-message'
import { KeyboardAvoidingView } from 'react-native'
import { Asset } from 'expo-asset'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import GradientButton from '../../components/GradientButton/GradientButton'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import { MessageJourneyStackParamsList } from '../../navigation/navigatorTypes'
import { RouteProp } from '@react-navigation/native'
import { RootState } from '../../rootReduxSaga/interfaces'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import { mountAndReset, startSendMessage } from './actions'
import { Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { object, string } from 'yup'
import * as S from './styles'

/** Validation schema for the message form used for Formik library */
export const validationSchema = object().shape({
  message: string()
    .trim()
    .required()
    .min(3, 'Must be min 3 digits')
    .max(300, 'Must be max 300 digits'),
})

type SendMessageProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: StackNavigationProp<MessageJourneyStackParamsList, 'SendMessage'>
  /** route object mainly to get params passed to this screen */
  route: RouteProp<MessageJourneyStackParamsList, 'SendMessage'>
}

/**
 * SendMessageScreen displays a form where user can send message to a user
 */

const SendMessageScreen: React.FC<SendMessageProps> = ({ route }) => {
  const [accessToken, setAccessToken] = React.useState<null | string>(null)
  const dispatch = useDispatch()
  const messageSentSuccess = useSelector((state: RootState) => {
    return state.sendMessage?.success
  })
  const messageSentError = useSelector((state: RootState) => {
    return state.sendMessage?.error
  })

  React.useEffect(() => {
    //Hides error notification toast on mount
    Toast.hide()
  }, [])

  React.useEffect(() => {
    //shows error notification toast if sending message threw an error by backend
    if (messageSentError) {
      Toast.show({
        type: 'error',
        text1: '',
        visibilityTime: 3000,
        text2: messageSentError?.replace(/\s\s+/g, ' '),
        topOffset: 700,
        autoHide: true,
        bottomOffset: 200,
        onHide: () => {
          dispatch(mountAndReset())
        },
        onPress: () => {
          dispatch(mountAndReset())
        },
      })
    }
  }, [messageSentError])

  const receiverId = route.params?.receiverId ? route.params.receiverId : null

  const getAccessToken = async () => {
    //gets accessToken from AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken')
    setAccessToken(accessToken)
  }

  React.useEffect(() => {
    //resets all states on mount and performs getAccessToken
    dispatch(mountAndReset())
    getAccessToken()
  }, [])

  const onSubmit = (values: { message: string }) => {
    //starts sending on submit
    if (receiverId && accessToken) {
      dispatch(
        startSendMessage(receiverId.toString(), accessToken, values.message),
      )
    }
  }
  return (
    <ScreenImageBackground
      isContentVerticallyCentered={false}
      paddingSides={30}
    >
      {messageSentSuccess ? (
        <>
          <S.AfterMessageSentView>
            <S.SuccessImage
              source={{
                uri: Asset.fromModule(require('../../files/rainbow2.png')).uri,
              }}
            ></S.SuccessImage>
            <S.SuccessText>{'MESSAGE SENT!'}</S.SuccessText>
          </S.AfterMessageSentView>
        </>
      ) : (
        <Formik
          validationSchema={validationSchema}
          initialValues={{ message: '' }}
          onSubmit={onSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setErrors,
            touched,
            isSubmitting,
            isValid,
          }) => (
            <KeyboardAvoidingView
              style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              behavior="padding"
              enabled
            >
              <S.MessageSubmitButtionView>
                <S.AvatarContainer>
                  <AvatarCircle
                    avatar_num={route.params.avatar_num}
                    radius={120}
                  ></AvatarCircle>
                </S.AvatarContainer>
                <S.MessageInput
                  placeholder="Write something nice..."
                  multiline={true}
                  onChangeText={handleChange('message')}
                  onBlur={handleBlur('message')}
                  value={values.message}
                ></S.MessageInput>
                {errors.message && touched.message && (
                  <S.ErrorText>{errors.message}</S.ErrorText>
                )}
                <GradientButton
                  onPress={handleSubmit}
                  isGradientReversed={false}
                  disabled={!isValid}
                  buttonText={'Send'}
                ></GradientButton>
                <S.PaddingViewForKeyboard></S.PaddingViewForKeyboard>
              </S.MessageSubmitButtionView>
            </KeyboardAvoidingView>
          )}
        </Formik>
      )}
    </ScreenImageBackground>
  )
}

export default SendMessageScreen
