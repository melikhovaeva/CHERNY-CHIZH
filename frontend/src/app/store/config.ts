import { baseApi } from '@/shared/api/base-api';
import '@/shared/api/generated';
import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice } from '@/entities/session';
import { authModalUiSlice } from '@/features/auth-modal';
import { bookingModalUiSlice } from '@/features/booking-modal';
import { selectedBreedSlice } from '@/features/selected-breed';
import { infoSettingsUiSlice } from '@/features/info-settings';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authModalUiSlice.name]: authModalUiSlice.reducer,
    [bookingModalUiSlice.name]: bookingModalUiSlice.reducer,
    [selectedBreedSlice.name]: selectedBreedSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    [infoSettingsUiSlice.name]: infoSettingsUiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

