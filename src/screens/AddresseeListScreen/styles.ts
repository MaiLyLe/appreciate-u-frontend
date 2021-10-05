import styled from 'styled-components/native'

/**
 * Styled components for AddresseeListScreen
 */

export const Container = styled.View<{
  isFiltered: boolean
}>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  ${({ isFiltered }) => (isFiltered ? '  top: 30px;' : '')}
  ${({ isFiltered }) => (isFiltered ? '  padding-bottom: 30px' : '')}
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

export const Card = styled.View<{
  isFirstTwo: boolean
  isFiltered: boolean
  itemsLengthIsOne: boolean
}>`
  width: ${({ itemsLengthIsOne }) => (itemsLengthIsOne ? '100%' : '50%')};
  top: ${({ itemsLengthIsOne }) => (itemsLengthIsOne ? '50px' : '0')};

  height: ${({ isFiltered }) => (isFiltered ? '200px' : '165px')};
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

export const UsernameSearchInput = styled.TextInput`
  border: 1px solid #9a9c9e;
  width: 350px;
  margin-bottom: 25px;
  margin-top: 10px;
  height: 50px;
  padding-left: 20px;
  border-radius: 20px;
  background-color: white;
  padding-left: 50px;
`
export const SearchIconContainer = styled.View`
  position: absolute;
  top: 22px;
  left: 15px;
`

export const SearchInputContainer = styled.View`
  position: relative;
  top: 50px;
`
export const RoleName = styled.Text`
  color: #56585c;
  text-align: center;
`
