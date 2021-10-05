import styled from 'styled-components/native'

/**
 * Styled components for ReceivedMessagesOverviewScreen
 */

export const TextField = styled.View`
  padding-top: 15px;
  color: #9a9c9e;
  font-weight: 500;
  max-height: 50px;
`

export const Text = styled.Text`
  font-size: 14px;
  color: #9a9c9e;
`

export const MessageText = styled.Text`
  font-size: 14px;
  margin-top: 10px;
  color: #9a9c9e;
`

export const TouchableOpacity = styled.TouchableOpacity``

export const MessageList = styled.FlatList`
  padding-top: 80px;
  width: 90%;
  overflow: scroll;
`
//  // border-color: ${({ isSeen }) => (isSeen ? '#ebe8e8' : '#FBF2EF')};

export const MessageCard = styled.TouchableOpacity<{ isSeen: boolean }>`
  flex: 1;
  margin-left: 3%;
  height: 100px;
  width: 95%;
  min-height: 100px;
  margin-bottom: 15px;
  border-color: white;
  background-color: ${({ isSeen }) => (isSeen ? 'white' : '#FBF2EF')};
  border-width: 1px;
  border-radius: 10px;
  flex-direction: row;

  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 1;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84;

  elevation: 3;
`

export const AvatarField = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  max-width: 100px;
`

export const PaginatorContainer = styled.View`
  flex: 1;
  flex-direction: row;
  position: absolute;
  bottom: 30px;
`

export const PageNumer = styled.Text`
  font-size: 18px;
  color: #91cfa2;
  padding: 0 5px;
`
export const PaginationButtonContainer = styled.View`
  min-width: 25px;
`

export const NumberOfMessagesReceivedBadge = styled.View`
  position: absolute;
  background-color: #f7819f;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  right: 25px;
  top: -10px;
`

export const NewLabel = styled.Text`
  color: white;
  text-align: center;
  margin-top: 3px;
`

export const EmptyMailBoxMessage = styled.Text`
  font-size: 20px;
  color: #9a9c9e;
  font-weight: 700;
  padding-top: 250px;
`
