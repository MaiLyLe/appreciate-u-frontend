import styled from 'styled-components/native'

/**
 * Styled components for AccountManagementScreen
 */

export const Container = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: center;
  padding-top: 30px;
`

export const Text = styled.Text`
  font-size: 18px;
  color: blue;
  font-weight: 500;
`
export const InputContainerEmail = styled.View`
  position: relative;
`

export const InputContainerPassword = styled.View`
  position: relative;
  margin-bottom: 7px;
`

export const Input = styled.TextInput`
  border: 1px solid black;
  width: 350px;
  margin-bottom: 25px;
  height: 50px;
  padding-left: 20px;
  border-radius: 20px;
  background-color: white;
`

export const ErrorText = styled.Text`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  color: red;
  top: 55px;
`

export const ShowHidePassword = styled.TouchableOpacity`
  position: absolute;
  right: 13px;
  top: 12px;
`
export const ButtonContainer = styled.View`
  top: 180px;
  width: 350px;
  height: 200px;
`
export const ButtonContainerRegister = styled.View`
  width: 300px;
  top: 50px;
`
export const ImageUploadIconContainer = styled.View`
  height: 20px;
  width: 20px;
  position: absolute;
  top: 12px;
  left: 15px;
  z-index: 100;
`
export const DropDownContainer = styled.View<{
  top: number
  open: boolean
  itemSize: number
  isCourses?: boolean
}>`
  top: ${({ top }) => `${top}px`};
  min-height: 1px;
  z-index: 1000;
  ${({ open, itemSize, isCourses }) =>
    open && itemSize
      ? `height: ${isCourses ? itemSize * 55 + 100 : itemSize * 55}px;`
      : ''}
  position: relative;
`

export const AvatarContainer = styled.View`
  flex: 1;
  top: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  height: 200px;
  min-height: 200px;
`

export const SubmitButtonContainer = styled.View`
  flex: 1;
  width: 350px;
  top: 300px;
  min-height: 200px;
`
export const ImageInfoView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const ImageInfo = styled.Text``

export const EntryExitDatePickerLine = styled.View`
  flex: 1;
  flex-direction: row;
  width: 350px;
  justify-content: space-between;
`

export const DatePickerButtons = styled.TouchableOpacity`
  border-radius: 20px;
  height: 50px;
  width: 100px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  flex: 1;
  flex-direction: row;
  position: relative;
  margin: 5px;
  margin-top: 10px;
`

export const DatePickerLabel = styled.Text`
  width: 175px;
  text-align: center;
`

export const DateIconContainer = styled.View`
  position: absolute;
  left: 10px;
`
export const DateTextContainer = styled.View`
  border-bottom-width: 2px;
  border-color: #c3dbd2;
`

export const DateFormLine = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 350px;
`
export const DatePickerText = styled.Text``

export const DateErrorContainer = styled.View`
  margin-top: 5px;
`

export const SelectCoursesView = styled.View`
  top: 10px;
  height: 50px;
`
export const SelectCoursesText = styled.Text`
  font-size: 20px;
  text-align: center;
`

export const MultiSelectContainer = styled.View<{ open: boolean }>`
  ${({ open }) =>
    !open
      ? `border: 1px solid black;
width: 351px;
height: 52px;
border-radius: 20px;
background-color: white;
position: absolute;
top: -1px;
z-index: -1;

`
      : ''}
`

export const AfterUserCreationView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: column;
  padding-bottom: 80px;
`

export const SuccessImage = styled.Image`
  height: 180px;
  width: 245px;
  opacity: 0.7;
  top: 350px;
  min-height: 180px;
`
export const SuccessText = styled.Text`
  top: 180px;
  font-size: 16px;
  color: #9a9c9e;
  height: 30px;
`
export const BackToLoginContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-self: flex-end;
`
