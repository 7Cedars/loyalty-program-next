import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoyaltyGift } from '../../types'

interface LoyaltyGiftState {
  loyaltyGifts: LoyaltyGift[]
}

const initialState: LoyaltyGiftState = {
  loyaltyGifts: []
}

export const loyaltyGiftsSlice = createSlice({
  name: 'loyaltyGifts',
  initialState: initialState,
  reducers: {
    saveLoyaltyGifts: (state, action: PayloadAction<LoyaltyGift[]>) => {
      state.loyaltyGifts = action.payload
    }, 
    resetLoyaltyGifts: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.loyaltyGifts = []
      }
    }, 
  }
})

export const { saveLoyaltyGifts, resetLoyaltyGifts } = loyaltyGiftsSlice.actions

export default loyaltyGiftsSlice.reducer