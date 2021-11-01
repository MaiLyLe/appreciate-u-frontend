import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Platform, ScrollView } from 'react-native'
import { Asset } from 'expo-asset'
import { StackNavigationProp } from '@react-navigation/stack'
import Toast from 'react-native-toast-message'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSelector, useDispatch } from 'react-redux'
import SwitchSelector from 'react-native-switch-selector'
import GradientButton from '../../components/GradientButton/GradientButton'
import { Icon } from 'react-native-elements'
import { RootState } from '../../rootReduxSaga/interfaces'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import { Formik } from 'formik'
import { format, parse } from 'date-fns'
import { validationSchema } from './validationSchema'

import {
  fetchInstitutes,
  fetchFields,
  fetchCourses,
  register,
  resetRegister,
} from './actions'
import DropDownTriple from '../../components/DropDownPickerTriple/DropDownPickerTriple'
import { RegistrationJourneyStackParamsList } from '../../navigation/navigatorTypes'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import * as S from './styles'

type RegistrationScreenNavigationProp = StackNavigationProp<
  RegistrationJourneyStackParamsList,
  'UserRegistration'
>

type RegistrationProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: RegistrationScreenNavigationProp
}

/**
 * UserRegistrationScreen displays a form to register user
 */

const UserRegistrationScreen: React.FC<RegistrationProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch()
  const [isPasswordHidden, setPasswordHidden] = React.useState(true)
  const institutes = useSelector((state: RootState) => {
    return state.institutes?.institutes
  })
  const fields = useSelector((state: RootState) => {
    return state.fields?.fields
  })
  const courses = useSelector((state: RootState) => {
    return state.courses?.courses
  })

  const createUserSuccess = useSelector((state: RootState) => {
    return state.createUser?.success
  })
  const createUserBackendError = useSelector((state: RootState) => {
    return state.createUser?.error
  })

  const loadCreateUser = useSelector((state: RootState) => {
    return state.createUser?.loading
  })

  const [instituteSelected, setInstituteSelected] = React.useState<
    null | number
  >(null)

  React.useEffect(() => {
    //Hides error notification toast on mount
    Toast.hide()
  }, [])

  React.useEffect(() => {
    //shows error notification toast if sending message threw an error by backend
    if (createUserBackendError) {
      Toast.show({
        type: 'error',
        text1: '',
        visibilityTime: 3000,
        text2: createUserBackendError,
        topOffset: 700,
        autoHide: true,
        bottomOffset: 200,
        onHide: () => {
          dispatch(resetRegisterErrors())
        },
        onPress: () => {
          dispatch(resetRegisterErrors())
        },
      })
    }
  }, [createUserBackendError])
  //random number from 1 to 10 to generate a placeholder avatar
  const [randomAvatar, setRandomAvatar] = React.useState(
    Math.floor(Math.random() * 10) + 1,
  )

  const [entryDate, setEntryDate] = React.useState<string | null>(null)
  const [exitDate, setExitDate] = React.useState<string | null>(null)
  const [isEntryDatePickerVisible, setEntryDatePickerVisible] = React.useState(
    false,
  )
  const [isExitDatePickerVisible, setExitDatePickerVisible] = React.useState(
    false,
  )
  const [isProfessor, setIsProfessor] = React.useState(true)

  React.useEffect(() => {
    //Resetting errors on mount
    //fetches all necessary data from backend
    dispatch(resetRegister())
    dispatch(fetchInstitutes())
    dispatch(fetchFields())
    dispatch(fetchCourses(false))
  }, [])
  React.useEffect(() => {
    //on mount:
    //activates permission overlay for user in order to get access to images on phone
    //if it has not been done yet
    ;(async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          console.log('Permission is needed to have access to your images!')
        }
      }
    })()
  }, [])

  const pickImage = async (setFieldValue: any) => {
    //algorithm for picking image with Expo Image Picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.cancelled) {
      setFieldValue('user_image', result)
      return result
    }
    return null
  }

  React.useEffect(() => {
    //fetches fields of studies again if user has chosen an institute
    //because fields of studies are dependent on institutes
    if (instituteSelected && typeof instituteSelected === 'number') {
      dispatch(fetchFields(instituteSelected))
    }
  }, [instituteSelected])

  const onSubmit = (values: any) => {
    //starts posting data to backend for registration
    const {
      name,
      email,
      password,
      user_image,
      is_professor,
      is_student,
      field_of_studies_id: field_of_studies,
      institute_id: institute,
      entry_semester,
      approximated_exit_date: approx_exit_semester,
      courses_ids_professor,
      courses_ids_student,
    } = values

    const userAttributes = {
      name,
      email,
      password,
      is_professor,
      is_student,
      avatar_num: randomAvatar,
    }

    const roleAttributes = isProfessor
      ? {
          field_of_studies,
          institute,
        }
      : {
          field_of_studies,
          institute,
          entry_semester,
          approx_exit_semester,
        }

    const completeData = isProfessor
      ? {
          user: userAttributes,
          professor: roleAttributes,
          courses: courses_ids_professor,
        }
      : {
          user: userAttributes,
          student: roleAttributes,
          courses: courses_ids_student,
        }
    dispatch(register(completeData, user_image && { email, user_image }))
  }

  const resetRegisterErrors = () => {
    //dispatches reset
    dispatch(resetRegister())
  }

  const navigateTo = () => {
    //navigates to LoginScreen
    navigation.navigate({
      name: 'Login',
      params: undefined,
    })
  }

  if (createUserSuccess) {
    //changes to success screen if registration successful
    return (
      <ScreenImageBackground
        isContentVerticallyCentered={false}
        paddingSides={30}
      >
        <S.AfterUserCreationView>
          <S.SuccessImage
            source={{
              uri: Asset.fromModule(require('../../files/rainbow2.png')).uri,
            }}
          ></S.SuccessImage>
          <S.SuccessText>{'Registration complete.'}</S.SuccessText>
          <S.BackToLoginContainer>
            <GradientButton
              onPress={navigateTo}
              isGradientReversed={false}
              buttonText="LOG INTO APP"
            />
          </S.BackToLoginContainer>
        </S.AfterUserCreationView>
      </ScreenImageBackground>
    )
  } else {
    return (
      <ScreenImageBackground isWithoutWhiteCutout={true}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
        >
          <S.Container>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                name: '',
                email: '',
                password: '',
                is_student: false,
                is_professor: true,
                field_of_studies_id: null,
                approximated_exit_date: null,
                institute_id: 1,
                entry_semester: null,
                user_image: null,
                courses_ids_professor: [],
                courses_ids_student: [],
              }}
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
                setFieldValue,
                setFieldTouched,
              }) => (
                <S.Container>
                  <S.InputContainerEmail>
                    <S.Input
                      placeholder="Name"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      onFocus={() => {
                        resetRegister()
                      }}
                      value={values.name}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.name && touched.name && (
                      <S.ErrorText>{errors.name}</S.ErrorText>
                    )}
                  </S.InputContainerEmail>

                  <S.InputContainerEmail>
                    <S.Input
                      placeholder="E-mail"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      onFocus={() => {
                        resetRegisterErrors()
                      }}
                      value={values.email}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.email && touched.email && (
                      <S.ErrorText>{errors.email}</S.ErrorText>
                    )}
                  </S.InputContainerEmail>

                  <S.InputContainerPassword>
                    <S.Input
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      onFocus={() => {
                        resetRegisterErrors()
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
                  </S.InputContainerPassword>
                  <SwitchSelector
                    initial={0}
                    onPress={(value) => {
                      resetRegisterErrors()
                      if (value === 0) {
                        setIsProfessor(false)
                        setFieldValue('is_student', true)
                        setFieldValue('is_professor', false)
                      } else {
                        setIsProfessor(true)

                        setFieldValue('is_student', false)
                        setFieldValue('is_professor', true)
                      }
                    }}
                    selectedColor={'black'}
                    buttonColor={'#c3dbd2'}
                    borderRadius={20}
                    height={50}
                    borderColor={'black'}
                    textColor={'#7f7f7f'}
                    hasPadding
                    options={[
                      { label: "I'm a Professor", value: 1 },
                      { label: "I'm a Student", value: 0 },
                    ]}
                    testID="gender-switch-selector"
                    accessibilityLabel="gender-switch-selector"
                  />
                  {values.is_student ? (
                    <S.EntryExitDatePickerLine>
                      <DateTimePickerModal
                        isVisible={isEntryDatePickerVisible}
                        mode="date"
                        locale="de_DE"
                        onConfirm={(date) => {
                          setEntryDate(format(date, 'yyyy-dd-MM'))

                          const dateWithoutDayTime = parse(
                            format(date, 'yyyy-dd-MM'),
                            'yyyy-dd-MM',
                            new Date(),
                          )
                          setFieldValue('entry_semester', dateWithoutDayTime)
                          setEntryDatePickerVisible(false)
                        }}
                        onCancel={() => {
                          setEntryDatePickerVisible(false)
                        }}
                      />
                      <DateTimePickerModal
                        isVisible={isExitDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => {
                          setExitDate(format(date, 'yyyy-dd-MM'))

                          const dateWithoutDayTime = parse(
                            format(date, 'yyyy-dd-MM'),
                            'yyyy-dd-MM',
                            new Date(),
                          )
                          setFieldValue(
                            'approximated_exit_date',
                            dateWithoutDayTime,
                          )
                          setExitDatePickerVisible(false)
                        }}
                        onCancel={() => {
                          setExitDatePickerVisible(false)
                        }}
                      />
                      <S.DatePickerButtons
                        onPress={() => {
                          resetRegisterErrors()
                          setEntryDatePickerVisible(true)
                          setFieldTouched('entry_semester')
                        }}
                      >
                        <S.DateIconContainer>
                          <Icon type="antdesign" name="calendar" />
                        </S.DateIconContainer>
                        <S.DateTextContainer>
                          <S.DatePickerText>
                            {entryDate || 'Entry Date'}
                          </S.DatePickerText>
                        </S.DateTextContainer>
                      </S.DatePickerButtons>

                      {/**Exit Date */}

                      <S.DatePickerButtons
                        onPress={() => {
                          resetRegisterErrors()
                          setExitDatePickerVisible(true)
                          setFieldTouched('approximated_exit_date')
                        }}
                      >
                        <S.DateIconContainer>
                          <Icon type="antdesign" name="calendar" />
                        </S.DateIconContainer>
                        <S.DateTextContainer>
                          <S.DatePickerText>
                            {exitDate || 'Exit date'}
                          </S.DatePickerText>
                        </S.DateTextContainer>
                      </S.DatePickerButtons>
                      {errors.entry_semester && touched.entry_semester && (
                        <S.DateErrorContainer>
                          <S.ErrorText>{errors.entry_semester}</S.ErrorText>
                        </S.DateErrorContainer>
                      )}
                      {errors.approximated_exit_date &&
                        touched.approximated_exit_date && (
                          <S.DateErrorContainer>
                            <S.ErrorText>
                              {errors.approximated_exit_date}
                            </S.ErrorText>
                          </S.DateErrorContainer>
                        )}
                    </S.EntryExitDatePickerLine>
                  ) : (
                    <></>
                  )}
                  <DropDownTriple
                    isRegister={true}
                    topPositionInstituteDropDown={30}
                    topPositionFieldDropDown={67}
                    topPositionCourseDropDown={105}
                    isProfessor={isProfessor}
                    institutes={institutes}
                    fields={fields}
                    courses={courses}
                    errors_institute={errors.institute_id}
                    touched_institute={touched.institute_id}
                    errors_fields={errors.field_of_studies_id}
                    touched_fields={touched.field_of_studies_id}
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    setSelectedInstitute={setInstituteSelected}
                  ></DropDownTriple>
                  <S.ButtonContainer>
                    <S.ImageUploadIconContainer>
                      <Icon
                        type="material-icon"
                        name={'add-a-photo'}
                        color={'white'}
                      />
                    </S.ImageUploadIconContainer>
                    <GradientButton
                      onPress={() => {
                        resetRegisterErrors()
                        pickImage(setFieldValue)
                      }}
                      colorArray={['black', 'black', 'black']}
                      isGradientReversed={false}
                      buttonText="Upload Your Avatar"
                    />

                    {!values.user_image && (
                      <S.ImageInfoView>
                        <S.ImageInfo>
                          {'Or just take this random image'}
                        </S.ImageInfo>
                      </S.ImageInfoView>
                    )}

                    {values.user_image ? (
                      <S.AvatarContainer>
                        <AvatarCircle
                          uri={values.user_image?.uri}
                          radius={130}
                          borderWidth={6}
                        ></AvatarCircle>
                      </S.AvatarContainer>
                    ) : (
                      <S.AvatarContainer>
                        <AvatarCircle
                          avatar_num={randomAvatar}
                          radius={130}
                          borderWidth={6}
                        ></AvatarCircle>
                      </S.AvatarContainer>
                    )}
                  </S.ButtonContainer>
                  <S.SubmitButtonContainer>
                    <GradientButton
                      onPress={handleSubmit}
                      disabled={!isValid || loadCreateUser || isSubmitting}
                      isGradientReversed={false}
                      buttonText="Register"
                    />
                  </S.SubmitButtonContainer>
                </S.Container>
              )}
            </Formik>
          </S.Container>
        </ScrollView>
      </ScreenImageBackground>
    )
  }
}

export default UserRegistrationScreen
