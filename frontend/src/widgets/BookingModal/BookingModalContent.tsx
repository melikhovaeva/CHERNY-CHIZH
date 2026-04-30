import {
  BookingForm,
  type BookingFormFields,
} from '@/features/booking-form/ui';
import { useAuth } from '@/entities/session';
import { getFirstApiErrorMessage } from '@/shared';
import { useV1RequestsCreateMutation } from '@/shared/api/generated/requests.generated';
import { useError, useSuccess } from '@/shared/ui/components';
import { type SubmitHandler } from 'react-hook-form';

interface BookingModalContentProps {
  dogId?: number | null;
  onSuccess: () => void;
}

export function BookingModalContent({
  dogId,
  onSuccess,
}: BookingModalContentProps) {
  const [createRequest] = useV1RequestsCreateMutation();
  const addError = useError();
  const addSuccess = useSuccess();
  const { user, isAuthenticated } = useAuth();

  const prefilledData =
    isAuthenticated && user
      ? {
          firstName: user.firstName,
          phone: user.phone ?? undefined,
          messenger: user.messenger ?? undefined,
        }
      : undefined;

  const onSubmit: SubmitHandler<BookingFormFields> = async (data) => {
    try {
      await createRequest({
        request: {
          firstName: (prefilledData?.firstName ?? data.firstName ?? '').trim(),
          phone: (prefilledData?.phone ?? data.phone ?? '').trim(),
          messenger: (prefilledData?.messenger ?? data.messenger ?? '').trim(),
          message: data.message.trim(),
          dog: dogId ?? null,
          requestType: 'booking',
        },
      }).unwrap();
      addSuccess('Заявка отправлена');
      onSuccess();
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err) ?? 'Не удалось отправить заявку';
      addError(message);
      throw err;
    }
  };

  return <BookingForm onSubmit={onSubmit} prefilledData={prefilledData} />;
}
