import watchLoginAll from '../screens/LoginScreen/sagas'
import watchGetRecommendations from '../screens/AddresseeListScreen/sagas'
import watchPostMessageWatcher from '../screens/SendMessageScreen/sagas'
import watchGettingMessages from '../screens/ReceivedMessagesOverviewScreen/sagas'
import watchGetMessageDetail from '../screens/DetailReceivedMessageScreen/sagas'
import watchUserInfoTokenVerificationAll from '../navigation/sagas'
import watchPollNumberUnreadMessages from '../navigation/TabNavigation/sagas'
import watchPostGoogleContacts from '../overlays/GoogleSigninOverlay/sagas'
import { fork } from 'redux-saga/effects'

/**
 * Root saga that combines all sagas from across the app
 */

export default function* rootSaga() {
  yield fork(watchPostGoogleContacts)
  yield fork(watchLoginAll)
  yield fork(watchGetRecommendations)
  yield fork(watchUserInfoTokenVerificationAll)
  yield fork(watchGettingMessages)
  yield fork(watchPostMessageWatcher)
  yield fork(watchGetMessageDetail)
  yield fork(watchPollNumberUnreadMessages)
}
