import styled from 'styled-components/native'

/**
 * Styled components for ScreenImageBackground
 */

export const ImageBackground = styled.ImageBackground<{
  isContentVerticallyCentered?: boolean
  paddingSides?: number
}>`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;

  ${({ isContentVerticallyCentered }) =>
    isContentVerticallyCentered ? 'justify-content: center;' : ''}
  padding: 0 ${({ paddingSides }) => (paddingSides ? `${paddingSides}px` : '')};
`

export const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`
