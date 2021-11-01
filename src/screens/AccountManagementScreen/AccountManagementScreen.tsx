import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Platform, ScrollView } from 'react-native'
import { Asset } from 'expo-asset'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-toast-message'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSelector, useDispatch } from 'react-redux'
import GradientButton from '../../components/GradientButton/GradientButton'
import { Icon } from 'react-native-elements'
import { RootState } from '../../rootReduxSaga/interfaces'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import { Formik } from 'formik'
import { format, parse } from 'date-fns'
import { fetchUserData, resetUpdateUser, updateUser } from './actions'

import {
  fetchInstitutes,
  fetchFields,
  fetchCourses,
} from '../../screens/UserRegistrationScreen/actions'
import { validationSchema } from './validationSchema'
import DropDownTriple from '../../components/DropDownPickerTriple/DropDownPickerTriple'
import { AccountStackParamsList } from '../../navigation/navigatorTypes'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import * as S from './styles'

type AccountManagementScreenNavigationProp = StackNavigationProp<
  AccountStackParamsList,
  'Account'
>

type AccountManagementProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: AccountManagementScreenNavigationProp
}

/**
 * AccountManagementScreen displays a form to change data about user
 */

const AccountManagementScreen: React.FC<AccountManagementProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch()

  const [role, setRole] = React.useState<null | string>(null)

  const userData = useSelector((state: RootState) => {
    return state.profileData?.userData
  })

  const updateUserBackendError = useSelector((state: RootState) => {
    return state.updateUser?.error
  })
  const [isPasswordHidden, setPasswordHidden] = React.useState(true)
  const [isConfirmPasswordHidden, setConfirmPasswordHidden] = React.useState(
    true,
  )
  const [entryDate, setEntryDate] = React.useState<string | null>(null)
  const [exitDate, setExitDate] = React.useState<string | null>(null)

  const [isEntryDatePickerVisible, setEntryDatePickerVisible] = React.useState(
    false,
  )
  const [isExitDatePickerVisible, setExitDatePickerVisible] = React.useState(
    false,
  )
  const [instituteSelected, setInstituteSelected] = React.useState<
    null | number
  >(null)
  const institutes = useSelector((state: RootState) => {
    return state.institutes?.institutes
  })
  const fields = useSelector((state: RootState) => {
    return state.fields?.fields
  })
  const courses = useSelector((state: RootState) => {
    return state.courses?.courses
  })

  const updateUserSuccess = useSelector((state: RootState) => {
    return state.updateUser?.success
  })

  const loadCreateUser = useSelector((state: RootState) => {
    return state.createUser?.loading
  })

  const [initialEmail, setInitialEmail] = React.useState('')

  const getRoleOfCurrentUser = async () => {
    //get role of logged-in user from AsyncSrorage
    const role = await AsyncStorage.getItem('role')
    setRole(role)
  }

  React.useEffect(() => {
    //on mount:
    //performs getRoleOfCurrentUser and getAccessToken on mount of component
    //resets errors on form
    //gets all necessary data from backend
    //Hides error notification toast on mount
    getRoleOfCurrentUser()
    dispatch(resetUpdateUser())
    dispatch(fetchUserData())
    dispatch(fetchInstitutes())
    dispatch(fetchFields())
    dispatch(fetchCourses(false))
    Toast.hide()
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

  React.useEffect(() => {
    //shows error notification toast if backend throws error on update
    if (updateUserBackendError) {
      Toast.show({
        type: 'error',
        text1: '',
        visibilityTime: 3000,
        text2: updateUserBackendError,
        topOffset: 700,
        autoHide: true,
        bottomOffset: 200,
        onHide: () => {
          dispatch(resetUpdateUser())
        },
        onPress: () => {
          dispatch(resetUpdateUser())
        },
      })
    }
  }, [updateUserBackendError])

  React.useEffect(() => {
    //saves initial email in case user wants to change email
    //email have to be unique in backend
    //so special care needs to be taken here
    if (userData && Object.keys(userData).length) {
      if (userData.user) {
        setInitialEmail(userData?.user?.email)
      }
    }
  }, [userData])

  React.useEffect(() => {
    //on update success: refetches data in case user wants to make a another change
    dispatch(fetchUserData())
    dispatch(fetchInstitutes())
    dispatch(fetchFields())
    dispatch(fetchCourses(false))
  }, [updateUserSuccess])

  React.useEffect(() => {
    //refetches fields of studies in case another institute has been selected
    //because fields of studies are dependent on institutes
    if (instituteSelected) {
      dispatch(fetchFields(instituteSelected))
    }
  }, [instituteSelected])

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
  const onSubmit = (values: any) => {
    //starts sending update data to backend
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

    let baseUserData: any = {
      name,
      is_professor,
      is_student,
      avatar_num: userData?.user?.avatar_num,
    }
    //only sends email if email has been changed
    baseUserData =
      initialEmail === email ? baseUserData : { ...baseUserData, email }

    const userAttributes = password
      ? { ...baseUserData, password }
      : baseUserData

    const roleAttributes =
      role !== 'STUDENT'
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

    const completeData: any =
      role !== 'STUDENT'
        ? courses_ids_professor.length
          ? {
              user: userAttributes,
              professor: roleAttributes,
              courses: courses_ids_professor,
            }
          : {
              user: userAttributes,
              professor: roleAttributes,
            }
        : courses_ids_student
        ? {
            user: userAttributes,
            student: roleAttributes,
            courses: courses_ids_student,
          }
        : {
            user: userAttributes,
            student: roleAttributes,
          }

    dispatch(updateUser(completeData, user_image && { user_image }))
  }
  if (updateUserSuccess) {
    //changes to success screen if update successful
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
          <S.SuccessText>{'Update Complete.'}</S.SuccessText>
          <S.BackToLoginContainer>
            <GradientButton
              onPress={() => {
                dispatch(resetUpdateUser())
                dispatch(fetchUserData())
              }}
              isGradientReversed={false}
              buttonText="MAKE ANOTHER CHANGE"
            />
          </S.BackToLoginContainer>
        </S.AfterUserCreationView>
      </ScreenImageBackground>
    )
  } else {
    if (
      courses &&
      institutes &&
      fields &&
      userData &&
      userData.user &&
      userData.user.name &&
      userData.user.email
    ) {
      return (
        <ScreenImageBackground isWithoutWhiteCutout={false}>
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
                  name: userData.user.name,
                  email: userData?.user?.email,
                  password: '',
                  password_repeat: '',
                  is_student: role === 'STUDENT',
                  is_professor: role !== 'STUDENT',
                  field_of_studies_id: userData?.field_of_studies?.id,
                  approximated_exit_date:
                    role === 'STUDENT' ? userData?.approx_exit_semester : null,
                  institute_id: 1,
                  entry_semester: userData?.entry_semester,
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
                  isValid,
                  setFieldValue,
                  setFieldTouched,
                }) => (
                  <S.Container>
                    <S.InputContainerEmail>
                      <S.Input
                        placeholder={userData.user.name}
                        onChangeText={handleChange('name')}
                        onBlur={() => {
                          handleBlur('name')
                        }}
                        onFocus={() => {
                          dispatch(resetUpdateUser())
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
                        placeholder={userData?.user?.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        onFocus={() => {
                          dispatch(resetUpdateUser())
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
                          dispatch(resetUpdateUser())
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

                    <S.InputContainerPassword>
                      <S.Input
                        placeholder="Repeat New Password"
                        onChangeText={handleChange('password_repeat')}
                        onBlur={handleBlur('password_repeat')}
                        onFocus={() => {
                          dispatch(resetUpdateUser())
                        }}
                        autoCorrect={false}
                        value={values.password_repeat}
                        autoCapitalize="none"
                        secureTextEntry={isConfirmPasswordHidden}
                      />

                      {isConfirmPasswordHidden ? (
                        <S.ShowHidePassword
                          onPress={() => {
                            setConfirmPasswordHidden(false)
                          }}
                        >
                          <Icon type="feather" name="eye" />
                        </S.ShowHidePassword>
                      ) : (
                        <S.ShowHidePassword
                          onPress={() => {
                            setConfirmPasswordHidden(true)
                          }}
                        >
                          <Icon type="feather" name="eye-off" />
                        </S.ShowHidePassword>
                      )}
                      {errors.password_repeat && touched.password_repeat && (
                        <S.ErrorText>{errors.password_repeat}</S.ErrorText>
                      )}
                    </S.InputContainerPassword>
                    {role === 'STUDENT' ? (
                      <>
                        <S.DateFormLine>
                          <S.DatePickerLabel>{'ENTRY DATE'}</S.DatePickerLabel>
                          <S.DatePickerLabel>{'EXIT DATE'} </S.DatePickerLabel>
                        </S.DateFormLine>
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
                              setFieldValue(
                                'entry_semester',
                                dateWithoutDayTime,
                              )
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
                              dispatch(resetUpdateUser())
                              setEntryDatePickerVisible(true)
                              setFieldTouched('entry_semester')
                            }}
                          >
                            <S.DateIconContainer>
                              <Icon type="antdesign" name="calendar" />
                            </S.DateIconContainer>
                            <S.DateTextContainer>
                              <S.DatePickerText>
                                {entryDate ||
                                  (userData?.entry_semester &&
                                    format(
                                      new Date(userData?.entry_semester),
                                      'yyyy-dd-MM',
                                    )) ||
                                  'None picked'}
                              </S.DatePickerText>
                            </S.DateTextContainer>
                          </S.DatePickerButtons>

                          {/**Exit Date */}
                          <S.DatePickerButtons
                            onPress={() => {
                              dispatch(resetUpdateUser())
                              setExitDatePickerVisible(true)
                              setFieldTouched('approximated_exit_date')
                            }}
                          >
                            <S.DateIconContainer>
                              <Icon type="antdesign" name="calendar" />
                            </S.DateIconContainer>
                            <S.DateTextContainer>
                              <S.DatePickerText>
                                {exitDate ||
                                  (userData?.approx_exit_semester &&
                                    format(
                                      new Date(userData?.approx_exit_semester),
                                      'yyyy-dd-MM',
                                    )) ||
                                  'None picked'}
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
                      </>
                    ) : (
                      <></>
                    )}

                    {institutes && courses && fields && userData ? (
                      <DropDownTriple
                        userData={userData}
                        isRegister={false}
                        topPositionInstituteDropDown={30}
                        topPositionFieldDropDown={67}
                        topPositionCourseDropDown={105}
                        isProfessor={role !== 'STUDENT'}
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
                    ) : (
                      <></>
                    )}
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
                          dispatch(resetUpdateUser())
                          pickImage(setFieldValue)
                        }}
                        colorArray={['black', 'black', 'black']}
                        isGradientReversed={false}
                        buttonText="Upload Your Avatar"
                      />

                      {userData?.user?.user_image ? (
                        <S.AvatarContainer>
                          <AvatarCircle
                            uri={
                              values?.user_image?.uri ||
                              userData?.user?.user_image
                            }
                            radius={130}
                            borderWidth={6}
                          ></AvatarCircle>
                        </S.AvatarContainer>
                      ) : (
                        <S.AvatarContainer>
                          <AvatarCircle
                            avatar_num={userData?.user?.avatar_num}
                            radius={130}
                            borderWidth={6}
                          ></AvatarCircle>
                        </S.AvatarContainer>
                      )}
                    </S.ButtonContainer>
                    <S.SubmitButtonContainer>
                      <GradientButton
                        onPress={handleSubmit}
                        disabled={!isValid}
                        isGradientReversed={false}
                        buttonText="Save"
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
    return null
  }
}

export default AccountManagementScreen
