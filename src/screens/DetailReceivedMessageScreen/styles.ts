import styled from 'styled-components/native'

/**
 * Styled components for DetailReceivedMessageScreen
 */

export const Container = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
`

export const MessageCard = styled.View`
  min-height: 150px;
  margin-bottom: 10px;
  border-color: #ebe8e8;
  background-color: white;
  border-width: 1px;
  border-radius: 10px;
  width: 90%;
  position: relative;
  margin-top: 250px;
`
export const Text = styled.Text`
  padding-top: 15px;
  color: #9a9c9e;
  font-weight: 500;
  width: 100%;
  padding: 20px;
`

export const TextDate = styled.Text`
  color: #9a9c9e;
  text-align: right;
  width: 100%;
  margin-right: 60px;
`

export const AvatarContainer = styled.View`
  position: absolute;
  right: 20px;
  z-index: 1000;
  top: 150px;
`
