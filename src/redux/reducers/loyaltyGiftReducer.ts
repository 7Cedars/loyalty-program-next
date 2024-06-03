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
    saveLoyaltyGifts: (state, action: PayloadAction<LoyaltyGift[]>) => {
      state.fetchedLoyaltyGifts = action.payload
    }
  }
})

export const { saveLoyaltyGifts } = fetchedLoyaltyGiftsSlice.actions

export default fetchedLoyaltyGiftsSlice.reducer