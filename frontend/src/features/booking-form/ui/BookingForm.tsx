import { Button, Form, Input, TextArea } from '@/shared/ui/components';
import { useError } from '@/shared/ui/components';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useRef } from 'react';
import formImage from '../assets/form-image.webp';
import type { BookingFormFields } from '../model';
import { BookingFormFieldsEnum } from '../model/enums';
import styles from './BookingForm.module.scss';

interface PrefilledData {
  firstName?: string;
  phone?: string;
  messenger?: string;
}

interface BookingFormProps {
  onSubmit: SubmitHandler<BookingFormFields>;
  prefilledData?: PrefilledData;
}

function formatPhoneDigits(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return '+7';
  let result = '+7 (' + d.slice(0, 3);
  if (d.length < 3) return result;
  result += ') ' + d.slice(3, 6);
  if (d.length < 6) return result;
  result += '-' + d.slice(6, 8);
  if (d.length < 8) return result;
  result += '-' + d.slice(8, 10);
  return result;
}

function extractDigits(value: string): string {
  const raw = value.replace(/\D/g, '');
  if (raw.startsWith('7') || raw.startsWith('8')) return raw.slice(1);
  return raw;
}

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const BookingForm = ({ onSubmit, prefilledData }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookingFormFields>();
  const addError = useError();
  const prevPhoneRef = useRef('');

  const showFirstName = !prefilledData?.firstName;
  const showPhone = !prefilledData?.phone;
  const showMessenger = !prefilledData?.messenger;

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch {
      // error handled by parent
    }
  }, () => addError('Проверьте заполнение полей'));

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className={styles.root}>
        <div className={styles.fieldsContainer}>
          {showFirstName && (
            <Input
              placeholder="Ваше имя"
              type="text"
              invalid={!!errors.firstName}
              {...register(BookingFormFieldsEnum.FIRST_NAME, {
                required: true,
              })}
            />
          )}
          {showPhone && (
            <Controller
              name={BookingFormFieldsEnum.PHONE}
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: PHONE_PATTERN,
                  message: 'Введите номер в формате +7 (XXX) XXX-XX-XX',
                },
              }}
              render={({ field }) => (
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  invalid={!!errors.phone}
                  error={errors.phone?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const prev = prevPhoneRef.current;
                    let digits = extractDigits(raw);
                    if (raw.length < prev.length) {
                      const prevDigits = extractDigits(prev);
                      if (digits.length === prevDigits.length && digits.length > 0) {
                        digits = digits.slice(0, -1);
                      }
                    }
                    const formatted = formatPhoneDigits(digits);
                    prevPhoneRef.current = formatted;
                    field.onChange(formatted);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          )}
          {showMessenger && (
            <Input
              type="text"
              placeholder="Мессенджер для связи (например, Telegram)"
              invalid={!!errors.messenger}
              {...register(BookingFormFieldsEnum.MESSENGER, {
                required: true,
              })}
            />
          )}
          <TextArea
            placeholder="Введите ваш вопрос"
            error={errors.message?.message}
            className={styles.textareaGrow}
            {...register(BookingFormFieldsEnum.MESSAGE, {
              required: true,
            })}
          />
          <div>
            <Button type="submit" className={styles.submitButton}>
              Отправить
            </Button>
            <p className={styles.consent}>
              Отправляя заявку, вы соглашаетесь на{' '}
              <a href="#">обработку персональных данных</a>
            </p>
          </div>
        </div>
        <div className={styles.formImageWrapper}>
          <img className={styles.formImage} src={formImage} alt="Form" />
        </div>
      </div>
    </Form>
  );
};
