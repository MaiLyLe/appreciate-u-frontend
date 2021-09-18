import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { combineReducers } from 'redux'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import { jwtTokenReducer } from '../screens/LoginScreen/reducer'
import { sendMessageReducer } from '../screens/SendMessageScreen/reducer'
import { pollMessagesReducer } from '../screens/ReceivedMessagesOverviewScreen/reducer'
import { getMessageDetailReducer } from '../screens/DetailReceivedMessageScreen/reducer'
import { pollNumberUnreadMessagesReducer } from '../navigation/TabNavigation/reducer'
import {
  userDataReducer,
  pollTokenVerificationReducer,
} from '../navigation/reducer'
import { recommendationsListReducer } from '../screens/AddresseeListScreen/reducer'

/**
 * Root reducer that combines all reducers from across the app
 * Also contains some config
 */

const rootPersistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  blacklist: ['navigation'],
  stateReconciler: autoMergeLevel1,
}

const appReducer = combineReducers({
  jwtToken: jwtTokenReducer,
  userData: userDataReducer,
  verifyTokenPolling: pollTokenVerificationReducer,
  recommendations: recommendationsListReducer,
  sendMessage: sendMessageReducer,
  messageList: pollMessagesReducer,
  messageDetail: getMessageDetailReducer,
  numberUnreadMessages: pollNumberUnreadMessagesReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

const persistedRootReducer = persistReducer<any, any>(
  rootPersistConfig,
  rootReducer,
)

export default persistedRootReducer
