import { baseApi } from '@/shared/api/base-api';
import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice } from '@/entities/session';
import { authModalUiSlice } from '@/features/auth-modal';
import { bookingModalUiSlice } from '@/features/booking-modal';
import { selectedBreedSlice } from '@/features/selected-breed';

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

