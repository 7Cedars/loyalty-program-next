import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoyaltyCard } from '../../types'
import { usePublicClient } from 'wagmi'
import { parseEthAddress } from '@/app/utils/parsers'


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
      state.selectedLoyaltyCard = action.payload
    }, 
    resetLoyaltyCard: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.selectedLoyaltyCard = undefined
      }
    }, 
  }
})

export const { selectLoyaltyCard, resetLoyaltyCard } = selectedLoyaltyProgramSlice.actions
export default selectedLoyaltyProgramSlice.reducer

