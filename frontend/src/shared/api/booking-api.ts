import { baseApi } from './base-api'

export interface SubmitBookingRequest {
  name: string
  phone: string
  email?: string
  comment?: string
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitBooking: build.mutation<void, SubmitBookingRequest>({
      query: (body) => ({
        url: '/booking',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useSubmitBookingMutation } = bookingApi
