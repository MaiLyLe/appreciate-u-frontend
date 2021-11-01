import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Platform, ScrollView } from 'react-native'
import { Asset } from 'expo-asset'
import { StackNavigationProp } from '@react-navigation/stack'
import Toast from 'react-native-toast-message'

import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSelector, useDispatch } from 'react-redux'
import MultiSelect from 'react-native-multiple-select'
import SwitchSelector from 'react-native-switch-selector'
import GradientButton from '../../components/GradientButton/GradientButton'
import { Icon } from 'react-native-elements'
import { RootState } from '../../rootReduxSaga/interfaces'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import DropDownPicker from 'react-native-dropdown-picker'
import { object, string, number, date, boolean, mixed, array } from 'yup'
import { Formik } from 'formik'
import { format, parse } from 'date-fns'

import {
  fetchInstitutes,
  fetchFields,
  fetchCourses,
  register,
  resetRegister,
} from './actions'
import { RegistrationJourneyStackParamsList } from '../../navigation/navigatorTypes'
import AvatarCircle from '../../components/AvatarCircle/AvatarCircle'
import * as S from './styles'

/** Validation schema for the register user form used for Formik library */

const FILE_SIZE = 3000000
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg']

export const validateImageType = (value: any) => {
  if (value) {
    let type = value.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
    return SUPPORTED_FORMATS.includes(type)
  }
}

export const validationSchema = object().shape({
  name: string().required('Please type in your name.'),
  email: string()
    .trim()
    .email()
    .required('Please type in your university e-mail.'),
  is_student: boolean().required(),
  is_professor: boolean().required(),
  password: string()
    .required('Please type in a password.')
    .min(6, 'Must be at least 6 characters.'),
  field_of_studies_id: number()
    .typeError('Please select your field of studies.')
    .required('Please select your field of studies.'),
  institute_id: number()
    .typeError('Please select your institute.')
    .required('Please select your institute.'),
  entry_semester: date()
    .nullable()
    // @ts-ignore
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .when('is_student', {
      is: true,
      then: date()
        .typeError('Please pick an entry date.')
        .required('Please pick an entry date.')
        .nullable()
        // @ts-ignore
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    }),
  courses_ids_professor: array().notRequired(),
  courses_ids_student: array().notRequired(),
  approximated_exit_date: date()
    .nullable()
    // @ts-ignore
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .when('is_student', {
      is: true,
      then: date()
        .typeError('Please pick an approximated exit date.')
        .required('Please pick an approximated exit date.')
        .nullable()
        // @ts-ignore
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    }),
  user_image: mixed().nullable().notRequired(),
})

const roleOptions = [
  {
    value: 0,
    label: "I'm a professor",
  },
  {
    value: 1,
    label: "I'm a student",
  },
]
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

  const [openInstituteDropdown, setOpenInstituteDropdown] = React.useState(
    false,
  )

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

  const [randomAvatar, setRandomAvatar] = React.useState(
    Math.floor(Math.random() * 10) + 1,
  )
  const [openFieldsDropdown, setOpenFieldsDropdown] = React.useState(false)
  const [
    openCoursesDropdownProfessor,
    setOpenCoursesDropDownProfessor,
  ] = React.useState(false)
  const [
    openCoursesDropdownStudent,
    setOpenCoursesDropDownStudent,
  ] = React.useState(false)

  const [instituteItems, setInstituteItems] = React.useState<
    {
      label?: string
      value?: number | string
    }[]
  >([])

  const [fieldsItems, setFieldsItems] = React.useState<
    {
      label?: string
      value?: number | string
    }[]
  >([])

  const [coursesItemsProfessor, setCoursesItemsProfessor] = React.useState<
    {
      name?: string
      id?: number | string
    }[]
  >([])

  const [coursesItemsStudent, setCoursesItemsStudent] = React.useState<
    {
      name?: string
      id?: number | string
    }[]
  >([])

  const [entryDate, setEntryDate] = React.useState<string | null>(null)
  const [exitDate, setExitDate] = React.useState<string | null>(null)

  const [instituteValue, setInstituteValue] = React.useState<
    number | undefined
  >(undefined)
  const [fieldsValue, setFieldsValue] = React.useState(null)
  const [coursesValuesProfessor, setCoursesValuesProfessor] = React.useState([])
  const [coursesValuesStudent, setCoursesValuesStudent] = React.useState([])

  const [isEntryDatePickerVisible, setEntryDatePickerVisible] = React.useState(
    false,
  )
  const [isExitDatePickerVisible, setExitDatePickerVisible] = React.useState(
    false,
  )
  const [isProfessor, setIsProfessor] = React.useState(true)

  const toggleOpenCoursesDropdownProfessor = () => {
    setOpenCoursesDropDownProfessor(!openCoursesDropdownProfessor)
  }
  const toggleOpenCoursesDropdownStudent = () => {
    setOpenCoursesDropDownProfessor(!openCoursesDropdownStudent)
  }

  const onSelectCourses = React.useCallback(
    (courses: any, formikCallback: any, isProfessor: boolean) => {
      if (isProfessor) {
        setCoursesValuesProfessor(courses)
        formikCallback('courses_ids_professor', courses)
      } else {
        setCoursesValuesStudent(courses)
        formikCallback('courses_ids_student', courses)
      }
    },
    [isProfessor],
  )
  React.useEffect(() => {
    dispatch(resetRegister())
  }, [])
  React.useEffect(() => {
    if (institutes) {
      setInstituteItems(
        institutes.map((el) => {
          return {
            label: el.name,
            value: el.id,
          }
        }),
      )
    }
  }, [institutes])

  React.useEffect(() => {
    if (fields && fields.length) {
      setFieldsItems(
        fields?.map((el) => {
          return {
            label: el.name,
            value: el.id,
          }
        }),
      )
    }
  }, [fields])

  React.useEffect(() => {
    if (courses && courses.length) {
      setCoursesItemsStudent(
        courses?.map((el) => {
          return {
            name: el.name,
            id: el.id,
          }
        }),
      )
      setCoursesItemsProfessor(
        courses
          ?.filter((el) => {
            if (!el.professor) {
              return el
            }
          })
          .map((el) => {
            return {
              name: el.name,
              id: el.id,
            }
          }),
      )
    }
  }, [courses])

  React.useEffect(() => {
    if (instituteValue && typeof instituteValue === 'number') {
      dispatch(fetchFields(instituteValue))
    }
  }, [instituteValue])

  const pickImage = async (setFieldValue: any) => {
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
    dispatch(fetchInstitutes())
    dispatch(fetchFields())
    dispatch(fetchCourses(false))
  }, [])

  const onInstituteOpen = React.useCallback(() => {
    setOpenFieldsDropdown(false)
  }, [])

  const onFieldsOpen = React.useCallback(() => {
    setOpenInstituteDropdown(false)
  }, [])

  const onSubmit = (values: any) => {
    //starts posting credentials to backend

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
                        resetRegisterErrors()
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
                  {instituteItems && instituteItems.length ? (
                    <S.DropDownContainer
                      top={30}
                      open={openInstituteDropdown}
                      itemSize={instituteItems.length}
                    >
                      <DropDownPicker
                        value={instituteValue ? instituteValue : null}
                        zIndex={999}
                        open={openInstituteDropdown}
                        searchable={false}
                        onOpen={onInstituteOpen}
                        placeholder={'Select an institute'}
                        closeAfterSelecting={true}
                        setItems={setInstituteItems}
                        multiple={false}
                        items={instituteItems}
                        containerStyle={{
                          height: 40,
                          width: 350,
                          borderRadius: 20,
                        }}
                        style={{
                          backgroundColor: '#fff',
                          width: 350,
                          paddingTop: 2,
                          paddingLeft: 20,
                          borderColor: 'black',
                          overflow: 'hidden',
                          borderRadius: 20,
                        }}
                        // @ts-ignore
                        itemStyle={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center;',
                          textAlign: 'center',
                          paddingLeft: 30,
                        }}
                        dropDownStyle={{
                          backgroundColor: '#fff',
                          padding: 10,
                          width: 200,
                          height: 100,
                          //maxHeight: 500,
                          borderStyle: 'solid',
                          zIndex: 1000,
                          borderColor: 'black',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.22,
                          shadowRadius: 2.22,
                          elevation: 3,
                        }}
                        setOpen={setOpenInstituteDropdown}
                        onChangeValue={(value) => {
                          if (openInstituteDropdown) {
                            resetRegisterErrors()
                            setFieldTouched('institute_id')
                          }
                          setFieldValue('institute_id', value)
                        }}
                        setValue={setInstituteValue}
                      />

                      {errors.institute_id && touched.institute_id && (
                        <S.ErrorText>{errors.institute_id}</S.ErrorText>
                      )}
                    </S.DropDownContainer>
                  ) : (
                    <></>
                  )}
                  {fieldsItems && fieldsItems.length ? (
                    <S.DropDownContainer
                      top={67}
                      open={openFieldsDropdown}
                      itemSize={fieldsItems.length}
                    >
                      <DropDownPicker
                        value={fieldsValue}
                        zIndex={999}
                        onOpen={onFieldsOpen}
                        open={openFieldsDropdown}
                        searchable={false}
                        placeholder={'Select an Field of Studies'}
                        closeAfterSelecting={true}
                        setItems={setFieldsItems}
                        multiple={false}
                        items={fieldsItems}
                        containerStyle={{
                          height: 40,
                          width: 350,
                          borderRadius: 20,
                        }}
                        style={{
                          backgroundColor: '#fff',
                          width: 350,
                          paddingTop: 2,
                          paddingLeft: 20,
                          borderColor: 'black',
                          overflow: 'hidden',
                          borderRadius: 20,
                        }}
                        // @ts-ignore
                        itemStyle={{
                          justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                          backgroundColor: '#fff',
                          padding: 10,
                          width: 200,
                          height: 100,
                          //maxHeight: 500,
                          borderStyle: 'solid',
                          zIndex: 999,
                          borderColor: 'black',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.22,
                          shadowRadius: 2.22,
                          elevation: 3,
                        }}
                        setOpen={setOpenFieldsDropdown}
                        onChangeValue={(value) => {
                          if (openFieldsDropdown) {
                            resetRegisterErrors()
                            setFieldTouched('field_of_studies_id')
                          }
                          setFieldValue('field_of_studies_id', value)
                        }}
                        setValue={setFieldsValue}
                      />
                      {errors.field_of_studies_id &&
                        touched.field_of_studies_id && (
                          <S.ErrorText>
                            {errors.field_of_studies_id}
                          </S.ErrorText>
                        )}
                    </S.DropDownContainer>
                  ) : (
                    <></>
                  )}
                  {coursesItemsProfessor && coursesItemsProfessor.length ? (
                    <S.DropDownContainer
                      top={105}
                      open={
                        isProfessor
                          ? openCoursesDropdownProfessor
                          : openCoursesDropdownStudent
                      }
                      itemSize={
                        !isProfessor
                          ? coursesItemsStudent.length
                          : coursesItemsProfessor.length
                      }
                      isCourses={true}
                    >
                      {isProfessor ? (
                        <>
                          <MultiSelect
                            hideTags
                            items={coursesItemsProfessor}
                            uniqueKey="id"
                            onSelectedItemsChange={(el) => {
                              onSelectCourses(el, setFieldValue, true)
                              toggleOpenCoursesDropdownProfessor()
                              toggleOpenCoursesDropdownStudent()
                            }}
                            selectedItems={coursesValuesProfessor}
                            selectText={'Select the courses you teach.'}
                            searchInputPlaceholderText="Search Courses..."
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            textColor="black"
                            selectedItemTextColor="#59B58E"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{
                              height: 60,
                              paddingLeft: 20,
                              color: 'black',
                            }}
                            submitButtonColor="black"
                            submitButtonText="Submit"
                            styleDropdownMenuSubsection={{
                              width: '90%',
                            }}
                            styleRowList={{
                              height: 50,
                            }}
                            styleDropdownMenu={{
                              height: 50,
                              paddingLeft: 20,
                              borderWidth: 1,
                              backgroundColor: 'white',
                            }}
                            // @ts-ignore
                            onToggleList={(el) => {
                              resetRegisterErrors()
                              toggleOpenCoursesDropdownProfessor()
                              toggleOpenCoursesDropdownStudent()
                            }}
                            styleSelectorContainer={{
                              borderWidth: 1,
                              borderColor: 'black',
                            }}
                            onClearSelector={() => {
                              toggleOpenCoursesDropdownProfessor()
                              toggleOpenCoursesDropdownStudent()
                            }}
                          />
                          {errors.courses_ids_professor &&
                            touched.courses_ids_professor && (
                              <S.ErrorText>
                                {errors.courses_ids_professor}
                              </S.ErrorText>
                            )}
                        </>
                      ) : (
                        <>
                          <MultiSelect
                            hideTags
                            items={coursesItemsStudent}
                            uniqueKey="id"
                            onSelectedItemsChange={(el) => {
                              onSelectCourses(el, setFieldValue, false)
                            }}
                            selectedItems={coursesValuesStudent}
                            selectText={'Select your current courses.'}
                            searchInputPlaceholderText="Search Courses..."
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            textColor="black"
                            selectedItemTextColor="#59B58E"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{
                              height: 60,
                              paddingLeft: 20,
                              color: 'black',
                            }}
                            submitButtonColor="black"
                            submitButtonText="Submit"
                            styleDropdownMenuSubsection={{}}
                            styleRowList={{
                              height: 50,
                            }}
                            styleDropdownMenu={{
                              height: 50,
                              paddingLeft: 20,
                              borderWidth: 1,
                              backgroundColor: 'white',
                            }}
                            // @ts-ignore
                            onToggleList={(el) => {
                              resetRegisterErrors()
                              toggleOpenCoursesDropdownStudent()
                              toggleOpenCoursesDropdownProfessor()
                            }}
                            styleSelectorContainer={{
                              borderWidth: 1,
                              borderColor: 'black',
                            }}
                            onClearSelector={() => {
                              toggleOpenCoursesDropdownStudent()
                              toggleOpenCoursesDropdownProfessor()
                            }}
                          />
                          {errors.courses_ids_student &&
                            touched.courses_ids_student && (
                              <S.ErrorText>
                                {errors.courses_ids_student}
                              </S.ErrorText>
                            )}
                        </>
                      )}
                    </S.DropDownContainer>
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
                      //disabled={!isValid || loadCreateUser || isSubmitting}
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
