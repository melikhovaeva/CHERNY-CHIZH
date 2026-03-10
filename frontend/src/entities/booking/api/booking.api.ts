import { useV1RequestsCreateMutation } from '@/shared/api/generated/requests.generated';
import type { Request } from '@/shared/api/generated/requests.generated';

export interface SubmitBookingRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  messenger: string;
  message: string;
  dog?: number;
}

function toRequest(p: SubmitBookingRequest): Request {
  return {
    firstName: p.first_name,
    lastName: p.last_name ?? null,
    email: p.email ?? null,
    phone: p.phone,
    messenger: p.messenger,
    message: p.message,
    dog: p.dog ?? null,
  };
}

export function useSubmitBookingMutation() {
  const [mutate, rest] = useV1RequestsCreateMutation();
  const submitBooking = (payload: SubmitBookingRequest) =>
    mutate({ request: toRequest(payload) });
  return [submitBooking, rest] as const;
}
