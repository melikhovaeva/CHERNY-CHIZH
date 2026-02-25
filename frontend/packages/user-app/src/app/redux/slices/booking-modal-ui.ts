import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type BookingModalUiState = {
  isOpen: boolean
  dogId: number | null
}

const initialState: BookingModalUiState = {
  isOpen: false,
  dogId: null,
}

export const bookingModalUiSlice = createSlice({
  name: 'bookingModalUi',
  initialState,
  reducers: {
    openBookingModal: (state, action: PayloadAction<number | null>) => {
      state.isOpen = true
      state.dogId = action.payload ?? null
    },
    closeBookingModal: (state) => {
      state.isOpen = false
      state.dogId = null
    },
  },
})

export const { openBookingModal, closeBookingModal } =
  bookingModalUiSlice.actions

export const selectBookingModalIsOpen = (state: {
  bookingModalUi: BookingModalUiState
}) => state.bookingModalUi.isOpen

export const selectBookingModalDogId = (state: {
  bookingModalUi: BookingModalUiState
}) => state.bookingModalUi.dogId
