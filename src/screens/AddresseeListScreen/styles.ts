import styled from 'styled-components/native'

/**
 * Styled components for AddresseeListScreen
 */

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`
export const NameText = styled.Text`
  font-size: 16px;
  color: #56585c;
  font-weight: 500;
  text-align: center;
  padding-top: 10px;
`

export const CourseOfStudiesName = styled.Text`
  padding-bottom: 10px;
  color: #56585c;
  text-align: center;
`

export const FlatList = styled.FlatList`
  width: 100%;
`

export const Card = styled.View<{ isFirstTwo: boolean }>`
  width: 50%;
  height: 165px;
  justify-content: center;
  align-items: center;
  ${({ isFirstTwo }) => (isFirstTwo ? 'margin-top: 30px;' : '')}
`

export const AvatarImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border: 4px solid #c3dbd2;
`

export const AvatarButton = styled.TouchableOpacity`
  width: 106px;
  height: 106px;
  border-radius: 53px;
  justify-content: center;
  align-items: center;
`
