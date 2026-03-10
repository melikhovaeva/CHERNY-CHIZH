import styles from './UserAvatar.module.scss';

export interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallbackText?: string;
}

export function UserAvatar({
  src,
  alt = 'User avatar',
  size = 50,
  className,
  fallbackText = '?',
}: UserAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${styles.container} ${className ?? ''}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${styles.container} ${className ?? ''}`}
      style={{ width: size, height: size, backgroundColor: '#e5e7eb' }}
      aria-hidden
    >
      <span
        className={styles.initials}
        style={{ fontSize: Math.round(size * 0.4) }}
      >
        {fallbackText}
      </span>
    </div>
  );
}
