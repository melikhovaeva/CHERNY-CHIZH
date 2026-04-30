import {
  enhancedApi as requestsGeneratedApi,
  useV1RequestsCreateMutation,
} from '@/shared/api/generated/requests.generated';
import type { Request } from '@/shared/api/generated/requests.generated';

requestsGeneratedApi.enhanceEndpoints({
  endpoints: {
    v1RequestsCreate: { invalidatesTags: ['Requests', 'NurseryDogs'] },
    v1RequestsPartialUpdate: { invalidatesTags: ['Requests', 'NurseryDogs'] },
    v1RequestsDestroy: { invalidatesTags: ['Requests', 'NurseryDogs'] },
  },
});

export interface SubmitBookingRequest {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
}

export function useSubmitBookingMutation() {
  const [mutate, rest] = useV1RequestsCreateMutation();
  const submitBooking = (payload: SubmitBookingRequest) =>
    mutate({ request: payload as Request });
  return [submitBooking, rest] as const;
}
