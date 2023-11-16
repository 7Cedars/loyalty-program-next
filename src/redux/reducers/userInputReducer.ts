import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInputState, ScreenDimensions } from '../../types'

const initialState: UserInputState = {
  // spaces: [], 
  // startDate: Date.now() - standardDateRange,
  // endDate: Date.now(),
  modalVisible: true,
  settings: {
    darkMode: false, 
    developerMode: false 
  }
}

// HERE needs to go through parsers... right?! 
export const selectedSpacesSlice = createSlice({
  name: 'userInput',
  initialState: initialState, 
  reducers: {
    updateModalVisible: (state, action: PayloadAction< boolean >) => {
      state.modalVisible = action.payload
    },
    setDarkMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.settings.darkMode = action.payload
    },
    setDeveloperMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.settings.developerMode = action.payload
  },
  }
})

export const { 
  updateModalVisible,
  setDarkMode,
  setDeveloperMode
 } = selectedSpacesSlice.actions

export default selectedSpacesSlice.reducer