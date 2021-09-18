import styled from 'styled-components/native'

/**
 * Styled components for TabNavigator
 */

export const TabContainerOuter = styled.View`
  position: relative;
`

export const TabContainer = styled.View<{ focused?: boolean }>`
  align-items: center;
  flex: 1;
  ${({ focused }) =>
    focused
      ? 'border-top-width: 1px; border-top-color: #91CFA2; padding-top: 7px;'
      : 'padding-top: 8px;'}
`

export const TabLabel = styled.Text<{ focused?: boolean }>`
  margin-top: 6px;
  width: 100%;
  ${({ focused }) => (focused ? 'color: #91CFA2;' : 'color: #ACBAC3;')}
`

export const NumberOfMessagesReceivedBadge = styled.View`
  position: absolute;
  background-color: #f7819f;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  right: 25px;
  top: -5px;
`

export const NumberOfMessagesLabel = styled.Text`
  color: white;
  text-align: center;
  margin-top: 3px;
`

export const Label = styled.Text``
