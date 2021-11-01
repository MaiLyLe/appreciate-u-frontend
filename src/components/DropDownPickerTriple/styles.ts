import styled from 'styled-components/native'

/**
 * Styled components for DropDownTriple
 */

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
      ? `height: ${isCourses ? itemSize * 50 + 100 : itemSize * 70}px;`
      : ''}
  position: relative;
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

export const DropDownLabelContainer = styled.View`
  margin-left: 10px;
  margin-bottom: 10px;
  border-bottom-width: 2px;
  border-color: #c3dbd2;
  margin-right: 10px;
`

export const DropDownLabel = styled.Text`
  padding-bottom: 2px;
`
