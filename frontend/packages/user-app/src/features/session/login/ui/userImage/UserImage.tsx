import { selectCurrentUser, useAppSelector } from '@/app/redux';
import styles from './UserImage.module.scss';

interface UserImageProps {
  size?: number;
}

export function UserImage({ size = 50 }: UserImageProps) {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  if (user.avatar_image) {
    return (
      <img
        src={user.avatar_image}
        alt={user.first_name || user.email}
        className={styles.container}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={styles.container}
      style={{ width: size, height: size, backgroundColor: '#e5e7eb' }}
    >
      <span className={styles.initials} style={{ fontSize: Math.round(size * 0.4) }}>
        ?
      </span>
    </div>
  );
}
