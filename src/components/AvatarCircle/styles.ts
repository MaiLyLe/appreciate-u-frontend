import styled from 'styled-components/native'

/**
 * Styled components for AvatarCircle
 */

export const AvatarImage = styled.Image<{
  radius: number
  borderWidth?: number
}>`
  width: ${({ radius }) => `${radius}px`};
  height: ${({ radius }) => `${radius}px`};
  border-radius: ${({ radius }) => `${radius / 2}px`};
  border: ${({ borderWidth }) =>
    borderWidth ? `${borderWidth}px solid #c3dbd2` : '4px solid #c3dbd2'}; ;
`
