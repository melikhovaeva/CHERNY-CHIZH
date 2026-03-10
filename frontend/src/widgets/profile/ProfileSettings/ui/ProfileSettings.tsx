import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateProfileMutation,
} from '@/entities/session';
import { UserImage } from '@/features/session';
import { getFirstApiErrorMessage } from '@/shared';
import { API_CONFIG } from '@/shared/config/api';
import { cn } from '@/shared/lib/utils';
import {
  Button,
  EditableInput,
  EditSaveButton,
  Input,
  Modal,
} from '@/shared/ui/components';
import { useError, useSuccess } from '@/shared/ui/components';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ProfileForm, ProfilePasswordForm } from '../model/types';
import UploadIcon from './assets/image.svg?react';
import styles from './ProfileSettings.module.scss';

const PROFILE_ERROR_FIELDS = ['email', 'first_name', 'last_name', 'detail'];
const PASSWORD_ERROR_FIELDS = [
  'old_password',
  'new_password',
  'new_password2',
  'detail',
];

export function ProfileSettings() {
  const addError = useError();
  const addSuccess = useSuccess();

  const { data: user, isLoading: isUserLoading, refetch } = useMeQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    control,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      messenger: '',
    },
  });

  const [passwordForm, setPasswordForm] = useState<ProfilePasswordForm>({
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        messenger: user.messenger ?? '',
      });
    }
  }, [user, reset]);

  if (isUserLoading || !user) {
    return <div>Загружаем профиль…</div>;
  }

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar_image', file);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`,
        {
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        },
      );

      if (!response.ok) {
        addError('Не удалось обновить аватар');
        return;
      }

      await refetch();
      addSuccess('Аватар обновлён');
    } catch {
      addError('Не удалось обновить аватар');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleUpdateProfile = async (
    payload: Parameters<typeof updateProfile>[0],
  ) => {
    try {
      await updateProfile(payload).unwrap();
      addSuccess('Профиль обновлён');
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err, PROFILE_ERROR_FIELDS) ??
        'Не удалось обновить профиль';
      addError(message);
      throw err;
    }
  };

  const handleChangePassword = async (payload: ProfilePasswordForm) => {
    try {
      await changePassword(payload).unwrap();
      addSuccess('Пароль изменён');
    } catch (err) {
      const message =
        getFirstApiErrorMessage(err, PASSWORD_ERROR_FIELDS) ??
        'Не удалось изменить пароль';
      addError(message);
      throw err;
    }
  };

  const handleChangePasswordField = (
    field: keyof ProfilePasswordForm,
    value: string,
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleChangePassword(passwordForm);
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    });
    setIsPasswordModalOpen(false);
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <div className={styles.settingsLayout}>
      <div className={styles.profileForm}>
        <div className={styles.avatarRow}>
          <label className={styles.avatarWrapper}>
            <UserImage className={styles.avatarImage} size={128} />
            <span className={styles.avatarOverlay}>
              <UploadIcon className={styles.avatarOverlayIcon} aria-hidden />
              <span className={styles.avatarOverlayText}>
                {isUploadingAvatar ? 'Загрузка…' : 'Загрузить'}
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              className={styles.avatarFileInput}
              onChange={handleAvatarFileChange}
              disabled={isUploadingAvatar}
            />
          </label>
        </div>

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Введите email',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Некорректный адрес email',
            },
          }}
          render={({ field }) => (
            <EditableInput
              label="Email"
              type="email"
              value={field.value}
              onChange={field.onChange}
              onSave={async (raw) => {
                const email = raw.trim();
                setValue('email', email);
                const valid = await trigger('email');
                if (valid) await handleUpdateProfile({ email });
              }}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name="firstName"
          control={control}
          rules={{ required: 'Введите имя' }}
          render={({ field }) => (
            <EditableInput
              label="Имя"
              value={field.value}
              onChange={field.onChange}
              onSave={async (raw) => {
                const first_name = raw.trim();
                setValue('firstName', first_name);
                const valid = await trigger('firstName');
                if (valid) await handleUpdateProfile({ first_name });
              }}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <EditableInput
              label="Фамилия"
              value={field.value}
              onChange={field.onChange}
              onSave={async (raw) => {
                const trimmed = raw.trim();
                const last_name = trimmed || null;
                field.onChange(trimmed);
                await handleUpdateProfile({ last_name });
              }}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableInput
              label="Телефон"
              type="tel"
              value={field.value}
              onChange={field.onChange}
              onSave={async (raw) => {
                const trimmed = raw.trim();
                const phone = trimmed || null;
                field.onChange(trimmed);
                await handleUpdateProfile({ phone });
              }}
            />
          )}
        />

        <Controller
          name="messenger"
          control={control}
          render={({ field }) => (
            <EditableInput
              label="Мессенджер"
              value={field.value}
              onChange={field.onChange}
              onSave={async (raw) => {
                const trimmed = raw.trim();
                const messenger = trimmed || null;
                field.onChange(trimmed);
                await handleUpdateProfile({ messenger });
              }}
            />
          )}
        />

        <div className={cn([styles.settingsFieldRow, styles.passwordRow])}>
          <Input
            type="password"
            label="Пароль"
            value="************"
            readOnly
            showPasswordToggle={false}
          />
          <EditSaveButton
            editing={false}
            onClick={handleOpenPasswordModal}
            ariaLabelView="Изменить пароль"
            ariaLabelEdit="Сохранить пароль"
          />
        </div>
      </div>

      <Modal
        mode="small"
        isOpen={isPasswordModalOpen}
        onClose={handleCloseModal}
        title="Смена пароля"
      >
        <form className={styles.modalForm} onSubmit={handleSubmitPassword}>
          <div className={styles.formColumn}>
            <Input
              type="password"
              label="Текущий пароль"
              value={passwordForm.oldPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangePasswordField('oldPassword', e.target.value)
              }
            />
            <Input
              type="password"
              label="Новый пароль"
              value={passwordForm.newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangePasswordField('newPassword', e.target.value)
              }
            />
            <Input
              type="password"
              label="Повторите новый пароль"
              value={passwordForm.newPassword2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangePasswordField('newPassword2', e.target.value)
              }
            />
          </div>
          <Button type="submit" disabled={isChangingPassword}>
            Обновить пароль
          </Button>
        </form>
      </Modal>
    </div>
  );
}
