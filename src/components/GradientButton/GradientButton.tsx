import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import * as S from './styles'

type GradientButtonProps = {
  /** Boolean prop to choose direction of gradient*/
  isGradientReversed: boolean
  /** Callback for what should happen when clicking button*/
  onPress: () => void
  /** Text in button */
  buttonText: string
  /** Prop to disable or enable button */
  disabled?: boolean
}

/**
 * Button with rounded borders and color gradient
 */

const GradientButton: React.FC<GradientButtonProps> = ({
  isGradientReversed,
  buttonText,
  onPress,
  disabled,
}) => {
  return (
    <S.TouchableOpacity onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={['#91cfa2', '#abc1cf', '#e0b4cd']}
        style={
          !disabled
            ? { height: '99%', borderRadius: 20 }
            : { height: '99%', borderRadius: 20, opacity: 0.5 }
        }
        start={!isGradientReversed ? [0, 1] : [1, 0]}
        end={!isGradientReversed ? [1, 0] : [0, 1]}
      >
        <S.Text>{buttonText}</S.Text>
      </LinearGradient>
    </S.TouchableOpacity>
  )
}

export default GradientButton
