import styled from 'styled-components/native'

/**
 * Styled components for StatisticsScreen
 */

export const SwitchContainer = styled.View`
  top: 30px;
  width: 80%;
`

export const SingleSwitchContainer = styled.View`
  margin-bottom: 10px;
`
export const PieChartContainer = styled.View`
  top: 5%;
  height: 36%;
  width: 90%;
  border-width: 1px;
  border-radius: 10px;
  flex-direction: column;
  background-color: white;
  border-color: white;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 5;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
`

export const ChartTitle = styled.Text`
  height: 70px;
  padding: 10px 20px 0px 10px;
  color: #7f7f7f;
  margin-bottom: -35px;
`

export const BarChartContainer = styled.View`
  top: 7%;
  height: 42%;
  width: 90%;
  border-width: 1px;
  border-radius: 10px;
  flex-direction: column;
  background-color: white;
  border-color: white;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 5;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
`
