import { baseApi } from '@/shared/api/base-api'
import { configureStore } from '@reduxjs/toolkit'
import { bookingModalUiSlice } from './slices/booking-modal-ui'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [bookingModalUiSlice.name]: bookingModalUiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export {
  openBookingModal,
  closeBookingModal,
  selectBookingModalIsOpen,
} from './slices/booking-modal-ui'

import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
