import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInputState, ScreenDimensions } from '../../types'

const initialState: UserInputState = {
  // spaces: [], 
  // startDate: Date.now() - standardDateRange,
  // endDate: Date.now(),
  modal: 'none',
  screenDimensions: {
    width: 0,
    height: 0
  },
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
    updateModal: (state, action: PayloadAction< 'infoSpace' | 'search' |'about' | 'settings' | 'savedSearches' | 'none'>) => {
      state.modal = action.payload
    },
    updateScreenDimensions: (state, action: PayloadAction<ScreenDimensions>) => {
      state.screenDimensions = action.payload
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
  updateModal,
  updateScreenDimensions, 
  setDarkMode,
  setDeveloperMode
 } = selectedSpacesSlice.actions

export default selectedSpacesSlice.reducer