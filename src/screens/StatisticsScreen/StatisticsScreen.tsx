import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import SwitchSelector from 'react-native-switch-selector'
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit'
import { RouteProp } from '@react-navigation/native'
import { format, getMonth } from 'date-fns'
import { StatisticsStackParamsList } from '../../navigation/navigatorTypes'
import { useWindowDimensions } from 'react-native'
import { RootState } from '../../rootReduxSaga/interfaces'
import ScreenImageBackground from '../../components/ScreenImageBackground/ScreenImageBackground'
import * as S from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { PieChartStats, BarChartStats } from '../../globalTypes'
import { getPieChartStats, getBarChartStats } from './actions'

type StatisticsScreenProps = {
  /** navigation object to enable navigating to another screen*/
  navigation: StackNavigationProp<StatisticsStackParamsList, 'Statistics'>
  /** route object mainly to get params passed to this screen */
  route: RouteProp<StatisticsStackParamsList, 'Statistics'>
}

/**
 * StatisticsScreen displays data on sent data and received data
 */

const months = [
  'Jan',
  'Feb',
  'March',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const getMonthArrayForCase = (
  barChartStats: BarChartStats,
  keyString: string,
  isDays: boolean,
) => {
  // @ts-ignore
  return barChartStats?.[keyString]?.map((el, index) => {
    return isDays
      ? index === 0
        ? 'Today'
        : format(new Date(el.time), 'E')
      : months[getMonth(new Date(el.time)) + 1]
  })
}

const getMessageAmountArrayForCase = (
  barChartStats: BarChartStats,
  isSentMessagesChosen: boolean,
  isLastMonthChosen: boolean,
) => {
  if (!isLastMonthChosen) {
    return !isSentMessagesChosen
      ? barChartStats['messages_received_7_days'].map((el) => el.count)
      : barChartStats['messages_sent_7_days'].map((el) => el.count)
  } else {
    return !isSentMessagesChosen
      ? barChartStats['messages_received_6_months'].map((el) => el.count)
      : barChartStats['messages_sent_6_months'].map((el) => el.count)
  }
}

const getMonthArrayForBarChart = (
  barChartStats: BarChartStats,
  isSentMessagesChosen: boolean,
  isLastMonthChosen: boolean,
) => {
  if (!isLastMonthChosen) {
    return !isSentMessagesChosen
      ? getMonthArrayForCase(barChartStats, 'messages_received_7_days', true)
      : getMonthArrayForCase(barChartStats, 'messages_sent_7_days', true)
  } else {
    return !isSentMessagesChosen
      ? getMonthArrayForCase(barChartStats, 'messages_received_6_months', false)
      : getMonthArrayForCase(barChartStats, 'messages_sent_6_months', false)
  }
}

const getPieChartNumbers = (
  pieChartStats: PieChartStats,
  isSentMessagesChosen: boolean,
  isLastMonthChosen: boolean,
) => {
  if (!isLastMonthChosen) {
    return !isSentMessagesChosen
      ? [
          pieChartStats.seven_days_received_professor_total,
          pieChartStats.seven_days_received_student_total,
        ]
      : [
          pieChartStats.seven_days_sent_professor_total,
          pieChartStats.seven_days_sent_student_total,
        ]
  } else {
    return !isSentMessagesChosen
      ? [
          pieChartStats.six_months_received_professor_total,
          pieChartStats.six_months_received_student_total,
        ]
      : [
          pieChartStats.six_months_sent_professor_total,
          pieChartStats.six_months_sent_student_total,
        ]
  }
}
const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#FFFFFF',
  backgroundColor: 'white',
  color: (opacity = 1) => `rgba(35, 184, 223, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

  strokeWidth: 0.1, // optional, default 3
  barPercentage: 0.6,
  useShadowColorFromDataset: false, // optional
}

const data = [
  {
    name: 'Students',
    population: 100,
    color: '#b4dee0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Profs',
    population: 78,
    color: '#e0c8cf',
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
]

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  route,
  navigation,
}) => {
  const pieChartStats = useSelector((state: RootState) => {
    return state.pieChartStats?.stats
  })
  const barChartStats = useSelector((state: RootState) => {
    return state.barChartStats?.stats
  })
  const [isSentMessagesChosen, setIsSentMessagesChosen] = React.useState(true)
  const [isLastMonthChosen, setIsLastMonthChosen] = React.useState(true)
  const [
    barChartLabelsAndNumbers,
    setBarChartLabelsAndNumbers,
  ] = React.useState<{
    labels: string[]
    numbers: number[]
  }>({
    labels: [],
    numbers: [],
  })

  const [pieChartNumbers, setPieChartNumbers] = React.useState<number[]>([])

  const dispatch = useDispatch()
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height

  useFocusEffect(React.useCallback(() => {}, []))

  React.useEffect(() => {
    //performs getMessageIdsRecentlySeen
    //when user gets back to ReceivedMessagesOverviewScreen via back button
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getPieChartStats())
      dispatch(getBarChartStats())
    })
    return unsubscribe
  }, [navigation])

  React.useEffect(() => {
    if (barChartStats && Object.keys(barChartStats).length) {
      setBarChartLabelsAndNumbers({
        labels: getMonthArrayForBarChart(
          barChartStats,
          isSentMessagesChosen,
          isLastMonthChosen,
        ),
        numbers: getMessageAmountArrayForCase(
          barChartStats,
          isSentMessagesChosen,
          isLastMonthChosen,
        ),
      })
    }
  }, [barChartStats, isSentMessagesChosen, isLastMonthChosen])

  React.useEffect(() => {
    if (pieChartStats && Object.keys(pieChartStats).length) {
      setPieChartNumbers(
        getPieChartNumbers(
          pieChartStats,
          isSentMessagesChosen,
          isLastMonthChosen,
        ),
      )
    }
  }, [pieChartStats, isSentMessagesChosen, isLastMonthChosen])

  return (
    <ScreenImageBackground>
      <S.SwitchContainer>
        <S.SingleSwitchContainer>
          <SwitchSelector
            initial={0}
            onPress={(value) =>
              value === 's'
                ? setIsSentMessagesChosen(true)
                : setIsSentMessagesChosen(false)
            }
            selectedColor={'black'}
            buttonColor={'#c3dbd2'}
            borderColor={'#9a9c9e'}
            textColor={'#7f7f7f'}
            hasPadding
            options={[
              { label: 'SENT MESSAGES', value: 's' },
              { label: 'RECEIVED MESSAGES', value: 'r' },
            ]}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
          />
        </S.SingleSwitchContainer>
        <S.SingleSwitchContainer>
          <SwitchSelector
            initial={0}
            onPress={(value) => {
              value === 'm'
                ? setIsLastMonthChosen(true)
                : setIsLastMonthChosen(false)
            }}
            selectedColor={'black'}
            buttonColor={'#c3dbd2'}
            borderColor={'#9a9c9e'}
            textColor={'#7f7f7f'}
            hasPadding
            options={[
              {
                label: 'LAST 6 MONTHS',
                value: 'm',
              },
              {
                label: 'LAST 7 DAYS',
                value: 'd',
              },
            ]}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
          />
        </S.SingleSwitchContainer>
      </S.SwitchContainer>

      <S.PieChartContainer>
        <S.ChartTitle>
          {isLastMonthChosen
            ? isSentMessagesChosen
              ? 'Messages you sent to students or professors in last 6 month'
              : 'Messages you received that came from students or professors in last 6 months'
            : isSentMessagesChosen
            ? 'Messages you sent to students or professors in last 7 days'
            : 'Messages you received that came from students or professors in last 7 days'}
        </S.ChartTitle>
        {pieChartStats &&
        Object.keys(pieChartStats).length &&
        pieChartNumbers.length ? (
          <PieChart
            data={[
              {
                name:
                  (pieChartNumbers[1] === 1 ? `Student` : 'Students') +
                  `, ${Math.floor(
                    (pieChartNumbers[1] * 100) /
                      (pieChartNumbers[1] + pieChartNumbers[0]),
                  )}%`,
                population: pieChartNumbers[1],
                color: '#b4dee0',
                legendFontColor: '#7F7F7F',
                legendFontSize: 14,
              },
              {
                name:
                  (pieChartNumbers[0] === 1 ? 'Prof' : 'Profs') +
                  `, ${Math.floor(
                    (pieChartNumbers[0] * 100) /
                      (pieChartNumbers[1] + pieChartNumbers[0]),
                  )}%`,
                population: pieChartNumbers[0],
                color: '#e0c8cf',
                legendFontColor: '#7F7F7F',
                legendFontSize: 14,
              },
            ]}
            width={windowWidth - 0.2 * windowWidth}
            height={windowHeight - 0.79 * windowHeight}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'1'}
            center={[10, 13]}
            absolute
            hasLegend={true}
          ></PieChart>
        ) : (
          <></>
        )}
      </S.PieChartContainer>
      <S.BarChartContainer>
        <S.ChartTitle>
          {isLastMonthChosen
            ? isSentMessagesChosen
              ? 'Total messages sent by you last 6 month'
              : 'Total messages you received last 6 months'
            : isSentMessagesChosen
            ? 'Total messages sent by you last 7 days'
            : 'Total messages you received last 7 days'}
        </S.ChartTitle>

        {barChartStats && Object.keys(barChartStats).length && (
          <BarChart
            style={{ backgroundColor: 'white' }}
            data={{
              labels: barChartLabelsAndNumbers.labels.reverse(),
              datasets: [
                {
                  data: barChartLabelsAndNumbers.numbers.reverse(),
                },
              ],
            }}
            width={windowWidth - 0.12 * windowWidth}
            height={windowHeight - windowHeight * 0.695}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={70}
            yAxisSuffix=""
          />
        )}
      </S.BarChartContainer>
    </ScreenImageBackground>
  )
}

export default StatisticsScreen
