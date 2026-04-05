import { API_CONFIG } from '@/shared/config/api';

/** Абсолютный URL для превью медиа с API (относительные пути от бэкенда). */
export function resolveApiAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_CONFIG.BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
