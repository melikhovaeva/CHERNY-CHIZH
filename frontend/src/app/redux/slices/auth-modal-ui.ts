import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
}

export const authModalUiSlice = createSlice({
  name: 'authModalUi',
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isOpen = true
    },
    closeAuthModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openAuthModal, closeAuthModal } = authModalUiSlice.actions

export const selectAuthModalIsOpen = (
  state: { authModalUi: { isOpen: boolean } }
) => state.authModalUi.isOpen
