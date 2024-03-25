import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoyaltyProgram } from '../../types'


interface LoyaltyProgramState {
  selectedLoyaltyProgram: LoyaltyProgram | undefined 
}

const initialState: LoyaltyProgramState = {
  selectedLoyaltyProgram: undefined
}

export const selectedLoyaltyProgramSlice = createSlice({
  name: 'selectedLoyaltyPrograms',
  initialState: initialState,
  reducers: {
    selectLoyaltyProgram: (state, action: PayloadAction<LoyaltyProgram>) => {
      state.selectedLoyaltyProgram = action.payload
    }, 
    resetLoyaltyProgram: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.selectedLoyaltyProgram = undefined
      }
    }, 
  }
})

export const { selectLoyaltyProgram, resetLoyaltyProgram } = selectedLoyaltyProgramSlice.actions

export default selectedLoyaltyProgramSlice.reducer