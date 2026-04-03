const UNITS = ['Б', 'КБ', 'МБ', 'ГБ'] as const;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return `0 ${UNITS[0]}`;
  let v = bytes;
  let u = 0;
  while (v >= 1024 && u < UNITS.length - 1) {
    v /= 1024;
    u += 1;
  }
  const rounded = u === 0 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${rounded} ${UNITS[u]}`;
}
