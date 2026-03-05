import { selectCurrentUser } from '@/entities/session';
import { useAppSelector } from '@/shared/lib/store';
import { cn } from '@/shared/lib/utils';
import styles from './UserImage.module.scss';

interface UserImageProps {
  size?: number;
  className?: string;
}

export function UserImage({ size = 50, className }: UserImageProps) {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  if (user.avatarImage) {
    return (
      <img
        src={user.avatarImage}
        alt={user.firstName || user.email}
        className={cn([styles.container, className || ''])}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={styles.container}
      style={{ width: size, height: size, backgroundColor: '#e5e7eb' }}
    >
      <span
        className={styles.initials}
        style={{ fontSize: Math.round(size * 0.4) }}
      >
        ?
      </span>
    </div>
  );
}
