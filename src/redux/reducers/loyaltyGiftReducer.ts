import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoyaltyGift } from '../../types'

interface FetchedLoyaltyGiftState {
  fetchedLoyaltyGifts: LoyaltyGift[]
}

const initialState: FetchedLoyaltyGiftState = {
  fetchedLoyaltyGifts: []
}

export const fetchedLoyaltyGiftsSlice = createSlice({
  name: 'fetchedLoyaltyGifts',
  initialState: initialState,
  reducers: {
    addLoyaltyGifts: (state, action: PayloadAction<LoyaltyGift[]>) => {
      state.fetchedLoyaltyGifts.push(...action.payload)
    }, 
    resetLoyaltyGifts: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.fetchedLoyaltyGifts = []
      }
    }, 
  }
})

export const { addLoyaltyGifts, resetLoyaltyGifts } = fetchedLoyaltyGiftsSlice.actions

export default fetchedLoyaltyGiftsSlice.reducer