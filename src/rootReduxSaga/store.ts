import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import persistedRootReducer from './rootReducer'

/**
 * Here saga and redux come together to create a global state tore
 */

export const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  persistedRootReducer,
  applyMiddleware(sagaMiddleware),
)
export const persistor = persistStore(store)
