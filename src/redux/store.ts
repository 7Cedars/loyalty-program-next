import { configureStore } from '@reduxjs/toolkit'
import userInputReducer from './reducers/userInputReducer'
import notificationReducer from  './reducers/notificationReducer'
import loyaltyProgramReducer from './reducers/loyaltyProgramReducer'
import loyaltyCardReducer from './reducers/loyaltyCardReducer'

export const store = configureStore({
  reducer: {
    userInput: userInputReducer, 
    notification: notificationReducer, 
    selectedLoyaltyProgram: loyaltyProgramReducer,
    selectedLoyaltyCard: loyaltyCardReducer
  }
})

// see redux website for these typescript examples. 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store