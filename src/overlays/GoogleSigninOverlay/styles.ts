import { Overlay } from 'react-native-elements'
import styled from 'styled-components/native'

/**
 * Styled components for GoogleSigninOverlay
 */

export const Wrapper = styled.View``

export const OverlayContainer = styled(Overlay).attrs({})``
export const OverlayInfoText = styled.Text`
  max-width: 70%;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px 5px 5px;

  font-size: 16px;
  color: #424242;
`

export const SignInButton = styled.Button`
  position: absolute;
  bottom: 0;
  left: 80%;
  right: 0;
  background-color: green;
`

export const NoButton = styled.Button``

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
