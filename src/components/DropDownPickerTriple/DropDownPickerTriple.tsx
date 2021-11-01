import React from 'react'
import DropDownPicker from 'react-native-dropdown-picker' //used for institutes & fields of studies
import MultiSelect from 'react-native-multiple-select' //used for courses
import { useDispatch } from 'react-redux'
import {
  Institute,
  FieldOfStudies,
  Course,
  ProfileData,
} from '../../globalTypes'
import { resetRegister } from '../../screens/UserRegistrationScreen/actions'
import { resetUpdateUser } from '../../screens/AccountManagementScreen/actions'
import * as S from './styles'

type DropDownTripleProps = {
  /** Boolean to tell component whether it is used in registration or user update */
  isRegister: boolean
  /** userData needed for update user as user has to see which values are prechosen */
  userData?: ProfileData
  /** position from top of institute dropdown */
  topPositionInstituteDropDown: number
  /** position from top of fields of studies dropdown */
  topPositionFieldDropDown: number
  /** position from top of courses dropdown */
  topPositionCourseDropDown: number
  /** tells component if user is a professor or a student */
  isProfessor: boolean
  /** institute values fetched from backend*/
  institutes?: Institute[]
  /** fields of studies values fetched from backend*/
  fields?: FieldOfStudies[]
  /** courses values fetched from backend*/
  courses?: Course[]
  /** errors for institute dropdown determined by Formik library*/
  errors_institute?: string
  /** boolean marker for institute dropdown determined by
   * Formik library to see if dropdown has been touched by user*/
  touched_institute?: boolean
  /** errors for fields of studies dropdown determined by Formik library*/
  errors_fields?: string
  /** boolean marker for fields of studuies dropdown determined by
   * Formik library to see if dropdown has been touched by user*/
  touched_fields?: boolean
  /** function to set a field as touched, function also from Formik*/
  setFieldTouched: (field_id: string) => void
  /** function to set a field value, function also from Formik*/
  setFieldValue: (field_id: string, value: string | number | null) => void
  /** function to set selected institute value
   * needed by parent to select dependent fields of sutdies*/
  setSelectedInstitute: (id: number) => void
}

/**
 * Renders all DropDown components that enables users to select
 * their Institute, Field of Studies & Courses
 */

const DropDownTriple: React.FC<DropDownTripleProps> = ({
  isRegister,
  topPositionInstituteDropDown,
  topPositionFieldDropDown,
  topPositionCourseDropDown,
  isProfessor,
  institutes,
  fields,
  courses,
  errors_institute,
  touched_institute,
  errors_fields,
  touched_fields,
  setFieldTouched,
  setFieldValue,
  userData,
  setSelectedInstitute,
}) => {
  const dispatch = useDispatch()
  const [openInstituteDropdown, setOpenInstituteDropdown] = React.useState(
    false,
  )
  const [openFieldsDropdown, setOpenFieldsDropdown] = React.useState(false)
  const [
    openCoursesDropdownStudent,
    setOpenCoursesDropDownStudent,
  ] = React.useState(false)
  const [
    openCoursesDropdownProfessor,
    setOpenCoursesDropDownProfessor,
  ] = React.useState(false)
  const [instituteValue, setInstituteValue] = React.useState<
    number | undefined
  >(undefined)
  const [fieldsValue, setFieldsValue] = React.useState(null)
  const [coursesValuesProfessor, setCoursesValuesProfessor] = React.useState([])
  const [coursesValuesStudent, setCoursesValuesStudent] = React.useState([])
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

  React.useEffect(() => {
    //function for AccountManagementScreen (update) to preselect chosen values
    //so that user sees what they have selected before
    if (!isRegister) {
      if (userData && Object.keys(userData).length) {
        // @ts-ignore
        setInstituteValue(userData?.institute?.id)

        if (userData?.institute?.id) {
          setSelectedInstitute(parseInt(userData?.institute?.id as string))
        }
        // @ts-ignore
        setFieldsValue(userData?.field_of_studies?.id)
        if (!isProfessor) {
          if (userData?.courses?.length) {
            // @ts-ignore
            setCoursesValuesStudent(userData?.courses.map((el: any) => el.id))
          }
        } else {
          if (userData?.taught_courses?.length) {
            setCoursesValuesProfessor(
              // @ts-ignore
              userData?.taught_courses?.map((el: any) => el.id),
            )
          }
        }
      }
    }
  }, [userData, isProfessor])

  React.useEffect(() => {
    //sets all available institute items in dropdown
    //formats them so they can be used by dropdown libary
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
    //sets all available fields of studies items in dropdown for UserRegistrationScreen
    //formats them so they can be used by dropdown libary
    if (isRegister) {
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
    }
  }, [fields, isRegister])

  React.useEffect(() => {
    //sets all available fields of studies items in dropdown for AccountManagementScreen
    //formats them so they can be used by dropdown libary
    if (!isRegister) {
      if (instituteValue) {
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
      }
    }
  }, [fields, instituteValue, isRegister])

  React.useEffect(() => {
    //sets all available courses items in dropdown for UserRegistrationScreen
    //formats them so they can be used by dropdown libary
    //professors only see courses that don't have a professor yet
    if (isRegister) {
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
    }
  }, [courses, isProfessor])

  React.useEffect(() => {
    //sets all available courses items in dropdown for AccountManagementScreen
    //professors only see courses that don't have a professor yet and their own chosen
    //courses if they want to remove them
    if (!isRegister) {
      if (courses && courses.length && userData) {
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
            })
            ?.concat(
              // @ts-ignore
              userData?.taught_courses?.map((el) => {
                return {
                  name: el.name,
                  id: el.id,
                }
              }),
            ),
        )
      }
    }
  }, [courses, userData, isProfessor])

  const onInstituteOpen = React.useCallback(() => {
    setOpenFieldsDropdown(false)
  }, [])

  const onFieldsOpen = React.useCallback(() => {
    setOpenInstituteDropdown(false)
  }, [])

  const toggleOpenCoursesDropdownProfessor = () => {
    setOpenCoursesDropDownProfessor(!openCoursesDropdownProfessor)
  }
  const toggleOpenCoursesDropdownStudent = () => {
    setOpenCoursesDropDownStudent(!openCoursesDropdownStudent)
  }

  const onSelectCourses = React.useCallback(
    (courses: any, formikCallback: any, isProfessor: boolean) => {
      if (isProfessor) {
        setCoursesValuesProfessor(courses)

        setFieldValue('courses_ids_professor', courses)
      } else {
        setCoursesValuesStudent(courses)
        setFieldValue('courses_ids_student', courses)
      }
    },
    [isProfessor],
  )

  return (
    <>
      {instituteItems && instituteItems.length ? (
        <S.DropDownContainer
          top={topPositionInstituteDropDown}
          open={openInstituteDropdown}
          itemSize={instituteItems.length}
        >
          <S.DropDownLabelContainer>
            <S.DropDownLabel>{'INSTITUTE'}</S.DropDownLabel>
          </S.DropDownLabelContainer>
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
            containerStyle={containerStyle}
            // @ts-ignore
            style={overallDropDownStyle}
            itemStyle={dropDownItemStyle}
            dropDownStyle={dropDownStyle}
            setOpen={setOpenInstituteDropdown}
            onChangeValue={(value) => {
              if (openInstituteDropdown) {
                if (isRegister) {
                  dispatch(resetRegister())
                } else {
                  dispatch(resetUpdateUser())
                }
                setFieldTouched('institute_id')
              }
              // @ts-ignore
              setFieldValue('institute_id', value)
              setSelectedInstitute(value as number)
            }}
            setValue={setInstituteValue}
          />

          {isRegister && errors_institute && touched_institute && (
            <S.ErrorText>{errors_institute}</S.ErrorText>
          )}
        </S.DropDownContainer>
      ) : (
        <></>
      )}
      {fieldsItems && fieldsItems.length ? (
        <S.DropDownContainer
          top={topPositionFieldDropDown}
          open={openFieldsDropdown}
          itemSize={fieldsItems.length}
        >
          <S.DropDownLabelContainer>
            <S.DropDownLabel>{'FIELD OF STUDIES'}</S.DropDownLabel>
          </S.DropDownLabelContainer>
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
            containerStyle={containerStyle}
            // @ts-ignore
            style={overallDropDownStyle}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={dropDownItemStyle}
            setOpen={setOpenFieldsDropdown}
            onChangeValue={(value) => {
              if (openFieldsDropdown) {
                if (isRegister) {
                  dispatch(resetRegister())
                } else {
                  dispatch(resetUpdateUser())
                }
                setFieldTouched('field_of_studies_id')
              }
              // @ts-ignore
              setFieldValue('field_of_studies_id', value)
            }}
            setValue={setFieldsValue}
          />
          {isRegister && errors_fields && touched_fields && (
            <S.ErrorText>{errors_fields}</S.ErrorText>
          )}
        </S.DropDownContainer>
      ) : (
        <></>
      )}
      {coursesItemsProfessor && coursesItemsProfessor.length ? (
        <S.DropDownContainer
          top={topPositionCourseDropDown}
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
          <S.DropDownLabelContainer>
            <S.DropDownLabel>{'COURSES'}</S.DropDownLabel>
          </S.DropDownLabelContainer>
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
                  if (isRegister) {
                    dispatch(resetRegister())
                  } else {
                    dispatch(resetUpdateUser())
                  }
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
                  if (isRegister) {
                    dispatch(resetRegister())
                  } else {
                    dispatch(resetUpdateUser())
                  }
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
            </>
          )}
        </S.DropDownContainer>
      ) : (
        <></>
      )}
    </>
  )
}

export default DropDownTriple

//styles for DropDown libraries
//should be instantiated outside of component as they are constant
const containerStyle = {
  height: 40,
  width: 350,
  borderRadius: 20,
}
const overallDropDownStyle = {
  backgroundColor: '#fff',
  width: 350,
  paddingTop: 2,
  paddingLeft: 20,
  borderColor: 'black',
  overflow: 'hidden',
  borderRadius: 20,
}

const dropDownItemStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center;',
  textAlign: 'center',
  paddingLeft: 30,
}
const dropDownStyle = {
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
}
