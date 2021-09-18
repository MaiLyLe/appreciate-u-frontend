import styled from 'styled-components/native'

/**
 * Styled components for SendMessageScreen
 */

export const MessageInput = styled.TextInput`
  height: 250px;
  border-radius: 20px;
  width: 100%;
  font-size: 20px;
  border: 1px solid #ebe8e8;
  background-color: white;
  position: relative;
  padding: 20px;
  margin-bottom: 20px;
`

export const ErrorText = styled.Text`
  color: red;
  margin-bottom: 30px;
  width: 100%;
`

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const MessageSubmitButtionView = styled.View`
  width: 100%;
  justify-content: flex-end;
`

export const PaddingViewForKeyboard = styled.View`
  flex: 1;
  padding-bottom: 300px;
`

export const AfterMessageSentView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const SuccessImage = styled.Image`
  height: 180px;
  width: 245px;
  opacity: 0.7;
  margin-top: 180px;
`
export const SuccessText = styled.Text`
  margin-top: 20px;
  font-size: 16px;
  color: #9a9c9e;
`

export const AfterMessageUpperScreen = styled.View<{ isSuccess: boolean }>``

export const AvatarContainer = styled.View`
  position: absolute;
  top: -100px;
  right: 10px;
  z-index: 1000;
`
