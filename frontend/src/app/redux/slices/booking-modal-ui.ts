import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
}

export const bookingModalUiSlice = createSlice({
  name: 'bookingModalUi',
  initialState,
  reducers: {
    openBookingModal: (state) => {
      state.isOpen = true
    },
    closeBookingModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openBookingModal, closeBookingModal } =
  bookingModalUiSlice.actions

export const selectBookingModalIsOpen = (
  state: { bookingModalUi: { isOpen: boolean } }
) => state.bookingModalUi.isOpen
