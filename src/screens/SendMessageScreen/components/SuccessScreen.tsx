import React from 'react'
import * as S from '../styles'
type SuccessScreenProps = {}

/**
 * SuccessScreen displays success image if message successfully sent
 */

const SuccessScreen: React.FC<SuccessScreenProps> = ({}) => {
  return <S.AfterMessageSentView></S.AfterMessageSentView>
}

export default SuccessScreen
