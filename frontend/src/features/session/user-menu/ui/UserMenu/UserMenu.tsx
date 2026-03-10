import { UserDropdownMenu } from '@/entities/user';
import { selectCurrentUser, useLogoutMutation } from '@/entities/session';
import { useAppSelector } from '@/app/store';
import { useError } from '@/shared/ui/components';
import { useNavigate } from '@tanstack/react-router';
import DashboardIcon from '../CrmButton/assets/dashboard.svg?react';
import LogoutIcon from '../../../logout/ui/assets/logout.svg?react';
import ProfileIcon from '../ProfileButton/assets/profile.svg?react';

const AVATAR_SIZE = 50;

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logout, { isLoading }] = useLogoutMutation();
  const addError = useError();

  const handleProfile = () => {
    navigate({ to: '/user' });
  };

  const handleCrm = () => {
    navigate({ to: '/crm' });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error(error, 'Failed to logout');
      addError('Не удалось выйти');
    }
  };

  const items = [
    {
      id: 'profile',
      label: 'Профиль',
      icon: <ProfileIcon width={16} height={16} />,
      onClick: handleProfile,
    },
    {
      id: 'crm',
      label: 'Админка',
      icon: <DashboardIcon width={16} height={16} />,
      onClick: handleCrm,
    },
    {
      id: 'logout',
      label: 'Выйти',
      icon: <LogoutIcon width={16} height={16} />,
      onClick: () => {
        void handleLogout();
      },
      disabled: isLoading,
      tone: 'danger' as const,
    },
  ];

  return (
    <UserDropdownMenu
      avatarSrc={user?.avatarImage}
      avatarAlt={user?.firstName || user?.email || 'Пользователь'}
      avatarSize={AVATAR_SIZE}
      items={items}
    />
  );
}
