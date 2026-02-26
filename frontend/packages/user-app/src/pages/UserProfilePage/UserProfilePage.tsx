import { useGetCoursesQuery, useGetMyCoursesQuery } from '@/entities/course';
import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateProfileMutation,
} from '@/entities/session';
import { UserImage } from '@/features/session';
import { API_CONFIG } from '@/shared/config/api';
import { cn } from '@/shared/lib/utils';
import {
  Button,
  EditableInput,
  EditSaveButton,
  Input,
  Modal,
  ProtectedRoute,
} from '@/shared/ui/components';
import { useEffect, useState } from 'react';
import styles from './UserProfilePage.module.scss';

type TabId = 'courses' | 'my-courses' | 'settings';
type ActiveField = 'password';

export function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('courses');

  const { data: user, isLoading: isUserLoading, refetch } = useMeQuery();
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery();
  const { data: myCourses, isLoading: isMyCoursesLoading } =
    useGetMyCoursesQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [profileForm, setProfileForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    messenger: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [activeField, setActiveField] = useState<ActiveField | null>(null);
  useEffect(() => {
    if (user) {
      setProfileForm({
        email: user.email,
        firstName: user.first_name ?? '',
        lastName: user.last_name ?? '',
        phone: user.phone ?? '',
        messenger: user.messenger ?? '',
      });
    }
  }, [user]);

  const handleChangeProfileField = (
    field: keyof typeof profileForm,
    value: string,
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenPasswordModal = () => {
    setActiveField('password');
  };

  const handleCloseModal = () => {
    setActiveField(null);
  };

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
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
        setAvatarError('Не удалось обновить аватар');
        return;
      }

      await refetch();
    } catch {
      setAvatarError('Не удалось обновить аватар');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleChangePasswordField = (
    field: keyof typeof passwordForm,
    value: string,
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    await changePassword(passwordForm).unwrap();
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    });
    setActiveField(null);
  };

  const renderCoursesTab = () => {
    if (isCoursesLoading) {
      return <div>Загружаем курсы…</div>;
    }

    if (!courses || courses.length === 0) {
      return <div>Пока нет доступных курсов.</div>;
    }

    return (
      <div className={styles.cardsGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            {course.imagePreview && (
              <img
                src={course.imagePreview}
                alt={course.title}
                className={styles.courseCardImage}
              />
            )}
            <div className={styles.courseCardBody}>
              <div className={styles.courseTags}>
                {course.tags.map((tag) => (
                  <span key={tag.id} className={styles.courseTag}>
                    {tag.label}
                  </span>
                ))}
                {course.status && (
                  <span className={styles.courseStatus}>
                    {course.status.label}
                  </span>
                )}
              </div>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseDescription}>{course.description}</p>
              <Button className={styles.courseAction}>
                {course.actionText || 'Записаться'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMyCoursesTab = () => {
    if (isMyCoursesLoading) {
      return <div>Загружаем ваши курсы…</div>;
    }

    if (!myCourses || myCourses.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>У вас пока нет записей на курсы.</p>
          <Button onClick={() => setActiveTab('courses')}>
            Перейти к списку курсов
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.cardsGrid}>
        {myCourses.map((enrollment) => (
          <div key={enrollment.id} className={styles.courseCard}>
            {enrollment.course.imagePreview && (
              <img
                src={enrollment.course.imagePreview}
                alt={enrollment.course.title}
                className={styles.courseCardImage}
              />
            )}
            <div className={styles.courseCardBody}>
              <div className={styles.courseTags}>
                {enrollment.course.tags.map((tag) => (
                  <span key={tag.id} className={styles.courseTag}>
                    {tag.label}
                  </span>
                ))}
              </div>
              <h3 className={styles.courseTitle}>{enrollment.course.title}</h3>
              <p className={styles.courseDescription}>
                {enrollment.course.description}
              </p>
              <div className={styles.courseMeta}>
                <span className={styles.courseStatusBadge}>
                  {enrollment.status}
                </span>
                {enrollment.progress != null && (
                  <span className={styles.courseProgress}>
                    Прогресс: {enrollment.progress}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSettingsTab = () => {
    if (isUserLoading || !user) {
      return <div>Загружаем профиль…</div>;
    }

    return (
      <div className={styles.settingsLayout}>
        <div className={styles.profileForm}>
          <h2 className={styles.sectionTitle}>Профиль</h2>
          <div className={styles.avatarRow}>
            <UserImage size={64} />
            <div className={styles.avatarControls}>
              <label className={styles.avatarUploadLabel}>
                <span>
                  Загрузить новый аватар{isUploadingAvatar ? '…' : ''}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.avatarFileInput}
                  onChange={handleAvatarFileChange}
                  disabled={isUploadingAvatar}
                />
              </label>
              {avatarError && (
                <p className={styles.avatarError}>{avatarError}</p>
              )}
            </div>
          </div>

          <EditableInput
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeProfileField('email', e.target.value)
            }
            onSave={async (raw) => {
              const email = raw.trim();
              setProfileForm((prev) => ({ ...prev, email }));
              await updateProfile({ email }).unwrap();
            }}
          />

          <EditableInput
            label="Имя"
            value={profileForm.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeProfileField('firstName', e.target.value)
            }
            onSave={async (raw) => {
              const first_name = raw.trim();
              setProfileForm((prev) => ({ ...prev, firstName: first_name }));
              await updateProfile({ first_name }).unwrap();
            }}
          />

          <EditableInput
            label="Фамилия"
            value={profileForm.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeProfileField('lastName', e.target.value)
            }
            onSave={async (raw) => {
              const trimmed = raw.trim();
              const last_name = trimmed || null;
              setProfileForm((prev) => ({ ...prev, lastName: trimmed }));
              await updateProfile({ last_name }).unwrap();
            }}
          />

          <EditableInput
            label="Телефон"
            type="tel"
            value={profileForm.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeProfileField('phone', e.target.value)
            }
            onSave={async (raw) => {
              const trimmed = raw.trim();
              const phone = trimmed || null;
              setProfileForm((prev) => ({ ...prev, phone: trimmed }));
              await updateProfile({ phone }).unwrap();
            }}
          />

          <EditableInput
            label="Мессенджер"
            value={profileForm.messenger}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeProfileField('messenger', e.target.value)
            }
            onSave={async (raw) => {
              const trimmed = raw.trim();
              const messenger = trimmed || null;
              setProfileForm((prev) => ({ ...prev, messenger: trimmed }));
              await updateProfile({ messenger }).unwrap();
            }}
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
          isOpen={activeField === 'password'}
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
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'courses':
        return renderCoursesTab();
      case 'my-courses':
        return renderMyCoursesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <section className={styles.container}>
        <h1 className={styles.pageTitle}>Профиль</h1>

        <div className={styles.tabs}>
          <button
            type="button"
            className={
              activeTab === 'courses'
                ? styles.tabButtonActive
                : styles.tabButton
            }
            onClick={() => setActiveTab('courses')}
          >
            Курсы
          </button>
          <button
            type="button"
            className={
              activeTab === 'my-courses'
                ? styles.tabButtonActive
                : styles.tabButton
            }
            onClick={() => setActiveTab('my-courses')}
          >
            Мои курсы
          </button>
          <button
            type="button"
            className={
              activeTab === 'settings'
                ? styles.tabButtonActive
                : styles.tabButton
            }
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </button>
        </div>

        <div className={styles.tabContent}>{renderActiveTab()}</div>
      </section>
    </ProtectedRoute>
  );
}
