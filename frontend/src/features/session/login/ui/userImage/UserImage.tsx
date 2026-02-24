import { selectCurrentUser, useAppSelector } from '@/app/redux';
import { useMemo } from 'react';
import styles from './UserImage.module.scss';

const PALETTE = [
  '#e17055',
  '#00b894',
  '#6c5ce7',
  '#fdcb6e',
  '#0984e3',
  '#e84393',
  '#00cec9',
  '#d63031',
  '#a29bfe',
  '#55efc4',
  '#fd79a8',
  '#74b9ff',
  '#fab1a0',
  '#81ecec',
  '#636e72',
  '#2d3436',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

interface UserImageProps {
  size?: number;
}

export function UserImage({ size = 50 }: UserImageProps) {
  const user = useAppSelector(selectCurrentUser);

  const { initials, color } = useMemo(() => {
    if (!user) return { initials: '', color: PALETTE[0] };

    const first = user.first_name?.charAt(0).toUpperCase() ?? '';
    const last = user.last_name?.charAt(0).toUpperCase() ?? '';

    const key = `${user.first_name ?? ''}${user.last_name ?? ''}`;
    const idx = hashString(key) % PALETTE.length;

    return { initials: `${first}${last}` || '?', color: PALETTE[idx] };
  }, [user]);

  if (!user) return null;

  const fontSize = Math.round(size * 0.4);

  return (
    <div
      className={styles.container}
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <span className={styles.initials} style={{ fontSize }}>
        {initials}
      </span>
    </div>
  );
}
