import React from 'react'
import { Icon } from 'react-native-elements'
import * as S from './styles'

type MessageSentErrorToastProps = {
  /** Text for toast */
  text: string
}

/**
 * Renders error toast for when message not sent
 */

const MessageSentErrorToast: React.FC<MessageSentErrorToastProps> = ({
  text,
}) => {
  return (
    <S.ToastContainer>
      <S.IconContainer>
        <Icon type="material-icons" name={'sms-failed'} color={'white'} />
      </S.IconContainer>
      <S.Text>{text}</S.Text>
    </S.ToastContainer>
  )
}

export default MessageSentErrorToast
