import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoyaltyCard } from '../../types'


interface LoyaltyCardState {
  selectedLoyaltyCard: LoyaltyCard | undefined 
}

const initialState: LoyaltyCardState = {
  selectedLoyaltyCard: undefined
}

export const selectedLoyaltyProgramSlice = createSlice({
  name: 'selectedLoyaltyPrograms',
  initialState: initialState,
  reducers: {
    selectLoyaltyCard: (state, action: PayloadAction<LoyaltyCard>) => {
      console.log(`selectLoyaltyProgram called. Action Payload: ${Object.values(action.payload)} `)
      state.selectedLoyaltyCard = action.payload
    }, 
    resetLoyaltyCard: (state, action: PayloadAction<boolean>) => {
      // console.log("prioritizeNotification called")
      if (action.payload === true) {
        state.selectedLoyaltyCard = undefined
      }
    }, 
  }
})

export const { selectLoyaltyCard, resetLoyaltyCard } = selectedLoyaltyProgramSlice.actions

export default selectedLoyaltyProgramSlice.reducer