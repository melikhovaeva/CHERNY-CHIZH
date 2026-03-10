import { selectCurrentUser } from '@/entities/session';
import { useAppSelector } from '@/shared/lib/store';
import { UserAvatar } from 'common';
import styles from './UserImage.module.scss';

interface UserImageProps {
  size?: number;
  className?: string;
}

export function UserImage({ size = 50, className }: UserImageProps) {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  return (
    <UserAvatar
      src={user.avatarImage}
      alt={user.firstName || user.email}
      size={size}
      className={`${styles.container} ${className ?? ''}`}
      fallbackText="?"
    />
  );
}
