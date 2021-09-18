import React, { ReactNode } from 'react'
import Toast, { ErrorToast } from 'react-native-toast-message'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import RootNavigator from './src/navigation/RootNavigator'
import { store, sagaMiddleware, persistor } from './src/rootReduxSaga/store'
import rootSaga from './src/rootReduxSaga/rootSaga'
import { withTheme } from 'react-native-elements'
import MessageSentErrorToast from './src/components/MessageSentErrorToast/MessageSentErrorToast'
sagaMiddleware.run(rootSaga)

const toastConfig = {
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#E77DA2' }}
      text1Style={{
        fontSize: 20,
        color: '#9a9c9e',
      }}
      text2Style={{
        fontSize: 14,
        color: '#9a9c9e',
      }}
      text3Style={{
        fontSize: 14,
        color: '#9a9c9e',
      }}
    />
  ),

  message_sent_error: ({ text1, props, ...rest }: any) => (
    <MessageSentErrorToast text={text1} />
  ),
}

const App: () => ReactNode = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
          <Toast
            height={300}
            config={toastConfig}
            ref={(ref) => Toast.setRef(ref)}
          />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
