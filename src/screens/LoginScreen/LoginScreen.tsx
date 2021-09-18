import React from 'react'
import GradientButton from '../../components/GradientButton/GradientButton'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'react-native-elements'
import { StackNavigationProp } from '@react-navigation/stack'
import { Formik } from 'formik'
import { RootState } from '../../rootReduxSaga/interfaces'
import { RouteProp } from '@react-navigation/native'
import { object, string } from 'yup'
import { RootNavigatorParamsList } from '../../navigation/navigatorTypes'
import { startLoginUserAction, mountLogin, loginResetError } from './actions'
import * as S from './styles'

/** Validation schema for the login form used for Formik library */
export const validationSchema = object().shape({
  email: string().trim().email().required(),
  password: string().required(),
})

type LoginScreenProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: StackNavigationProp<RootNavigatorParamsList, 'Login'>
  /** route object mainly to get params passed to this screen */
  route: RouteProp<RootNavigatorParamsList, 'Login'>
}

/**
 * LoginScreen displays login form
 */

const LoginScreen: React.FC<LoginScreenProps> = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const accessToken = useSelector((state: RootState) => {
    return state.jwtToken?.accessToken
  })
  const [hasBackendAuthError, setHasBackendAuthError] = React.useState(false)
  const [isPasswordHidden, setPasswordHidden] = React.useState(true)
  const error = useSelector((state: RootState) => state.jwtToken?.error)

  const loading = useSelector((state: RootState) => {
    return state.jwtToken?.loading
  })

  React.useEffect(() => {
    //resets states on mount
    dispatch(mountLogin())
  }, [])

  React.useEffect(() => {
    //determines if login failed due to an error after submit
    if (error) {
      setHasBackendAuthError(true)
    } else {
      setHasBackendAuthError(false)
    }
  }, [error])

  React.useEffect(() => {
    //determines if login was successful due to token being there after submit
    if (accessToken) {
      setHasBackendAuthError(false)
    }
  }, [accessToken])

  const onSubmit = (values: { email: string; password: string }) => {
    //starts posting credentials to backend
    dispatch(startLoginUserAction(values))
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: '', password: '' }}
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
        <S.Container>
          <S.InputContainer>
            <S.Input
              placeholder="E-mail"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onFocus={() => {
                dispatch(loginResetError())
              }}
              value={values.email}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && touched.email && (
              <S.ErrorText>{errors.email}</S.ErrorText>
            )}
          </S.InputContainer>
          <S.InputContainer>
            <S.Input
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              onFocus={() => {
                dispatch(loginResetError())
              }}
              autoCorrect={false}
              value={values.password}
              autoCapitalize="none"
              secureTextEntry={isPasswordHidden}
            />

            {isPasswordHidden ? (
              <S.ShowHidePassword
                onPress={() => {
                  setPasswordHidden(false)
                }}
              >
                <Icon type="feather" name="eye" />
              </S.ShowHidePassword>
            ) : (
              <S.ShowHidePassword
                onPress={() => {
                  setPasswordHidden(true)
                }}
              >
                <Icon type="feather" name="eye-off" />
              </S.ShowHidePassword>
            )}
            {errors.password && touched.password && (
              <S.ErrorText>{errors.password}</S.ErrorText>
            )}
          </S.InputContainer>
          <S.ButtonContainer>
            <GradientButton
              onPress={handleSubmit}
              isGradientReversed={false}
              buttonText="Login"
              disabled={
                (!touched.password && !touched.email) || !isValid || loading
              }
            />
          </S.ButtonContainer>

          {hasBackendAuthError && <S.ErrorText>{error}</S.ErrorText>}
        </S.Container>
      )}
    </Formik>
  )
}

export default LoginScreen
