import { baseApi } from '@/shared/api/base-api';
import { configureStore } from '@reduxjs/toolkit';
import { authModalUiSlice } from './slices/auth-modal-ui';
import { bookingModalUiSlice } from './slices/booking-modal-ui';
import { selectedBreedSlice } from './slices/selected-breed';
import { sessionSlice } from './slices/session';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authModalUiSlice.name]: authModalUiSlice.reducer,
    [bookingModalUiSlice.name]: bookingModalUiSlice.reducer,
    [selectedBreedSlice.name]: selectedBreedSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  closeAuthModal,
  openAuthModal,
  selectAuthModalIsOpen,
} from './slices/auth-modal-ui';
export {
  closeBookingModal,
  openBookingModal,
  selectBookingModalIsOpen,
  selectBookingModalDogId,
} from './slices/booking-modal-ui';
export {
  selectSelectedBreedSlug,
  setSelectedBreed,
} from './slices/selected-breed';

export {
  selectCurrentUser,
  selectIsAuthenticated,
  selectSessionStatus,
  selectSessionError,
  clearSession,
} from './slices/session';

import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
