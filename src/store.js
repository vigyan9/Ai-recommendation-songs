import { createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'

const initialState = {
  emotion:"",
}
// const userProfile = createReducer({
//   email: (state, action) => {
//     state.email = action.payload
//   },
//   password: (state, action) => {
//     state.password = action.payload
//   },
//   username: (state, action) => {
//     state.username = action.payload
//   },
//   name: (state, action) => {
//     state.name = action.payload
//   },
// })
const persistConfig = {
  key: 'root',
  // storage,
  storage: storageSession,
}
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'expression':
      return { ...state, ...rest }
    default:
      return state
  }
}
const persistedReducer = persistReducer(persistConfig, changeState)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export default store