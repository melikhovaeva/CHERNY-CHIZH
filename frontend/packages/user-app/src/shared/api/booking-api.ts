import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';

export interface SubmitBookingRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  messenger: string;
  message: string;
  dog?: number;
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
