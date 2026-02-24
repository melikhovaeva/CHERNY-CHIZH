import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';

export interface SubmitBookingRequest {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitBooking: build.mutation<void, SubmitBookingRequest>({
      query: (body) => ({
        url: API_CONFIG.ENDPOINTS.REQUESTS,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubmitBookingMutation } = bookingApi;
