import styled from 'styled-components/native'

/**
 * Styled components for LoginScreen
 */

export const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`
export const Text = styled.Text`
  font-size: 18px;
  color: blue;
  font-weight: 500;
`
export const InputContainer = styled.View`
  position: relative;
`

export const Input = styled.TextInput`
  border: 1px solid black;
  width: 300px;
  margin-bottom: 25px;
  margin-top: 10px;
  height: 50px;
  padding-left: 20px;
  border-radius: 20px;
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
  top: 65px;
`

export const ShowHidePassword = styled.TouchableOpacity`
  position: absolute;
  right: 13px;
  top: 22px;
`
export const ButtonContainer = styled.View`
  margin-top: 20px;
  width: 300px;
`
