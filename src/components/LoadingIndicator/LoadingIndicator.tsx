import React from 'react'
import { BallIndicator } from 'react-native-indicators'
import * as S from './styles'

type LoadingIndicatorProps = {}

/**
 * Animated loading indicator that covers whole screen
 */

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({}) => {
  return (
    <S.Container>
      <BallIndicator color={'#91CFA2'}></BallIndicator>
    </S.Container>
  )
}

export default LoadingIndicator
