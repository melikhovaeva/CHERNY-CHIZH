import clsx from 'clsx';
import { API_CONFIG } from '../config/api';

const cn = (
  classes: string[],
  options?: { [key: string]: boolean | undefined },
) => clsx(...classes, { ...options });
export { cn };

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function getImageUrl(
  path: string | null | undefined,
): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
