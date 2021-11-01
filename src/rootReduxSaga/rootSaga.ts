import watchLoginAll from '../screens/LoginScreen/sagas'
import watchGetRecommendations from '../screens/AddresseeListScreen/sagas'
import watchPostMessageWatcher from '../screens/SendMessageScreen/sagas'
import watchGettingMessages from '../screens/ReceivedMessagesOverviewScreen/sagas'
import watchGetMessageDetail from '../screens/DetailReceivedMessageScreen/sagas'
import watchFetchGeneralUserDataAndLogoutTimerSagas from '../navigation/sagas'
import watchPollNumberUnreadMessages from '../navigation/TabNavigation/sagas'
import watchPostGoogleContacts from '../overlays/GoogleSigninOverlay/sagas'
import watchGetStats from '../screens/StatisticsScreen/sagas'
import watchRegistrationRequests from '../screens/UserRegistrationScreen/sagas'
import watchProfileChange from '../screens/AccountManagementScreen/sagas'
import { fork, call } from 'redux-saga/effects'

/**
 * Root saga that combines all sagas from across the app
 */

export default function* rootSaga() {
  //combines all sagas and runs them separately
  yield fork(watchPostGoogleContacts)
  yield fork(watchLoginAll)
  yield fork(watchGetRecommendations)
  yield fork(watchFetchGeneralUserDataAndLogoutTimerSagas)
  yield fork(watchGettingMessages)
  yield fork(watchPostMessageWatcher)
  yield fork(watchGetMessageDetail)
  yield fork(watchPollNumberUnreadMessages)
  yield fork(watchGetStats)
  yield fork(watchRegistrationRequests)
  yield fork(watchProfileChange)
}

export function delay(duration: number) {
  //creates delay
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true), duration)
  })
  return promise
}

export function fetchMethod(requestURL: string, accessToken: string) {
  //fetch function for sagas
  if (accessToken) {
    return fetch(requestURL, {
      credentials: 'include',
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ` + accessToken,
        Accept: '*/*',
      },
    }).then((response) =>
      response
        .json()
        .then((data) => ({ status: response.status, body: data }))
        .then((obj) => {
          return obj
        })
        .catch((err) => {
          console.log(err)
          throw err
        }),
    )
  }
}
