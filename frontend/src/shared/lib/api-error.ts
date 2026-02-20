export interface ApiErrorPayload {
  [field: string]: string | string[] | undefined;
}

export interface RtkQueryErrorWithData {
  status: number;
  data?: unknown;
}

function isRtkQueryErrorWithData(
  error: unknown,
): error is RtkQueryErrorWithData {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  );
}

function isApiErrorPayload(data: unknown): data is ApiErrorPayload {
  if (!data || typeof data !== 'object') return false;
  const o = data as Record<string, unknown>;
  return Object.values(o).every(
    (v) =>
      v === undefined ||
      typeof v === 'string' ||
      (Array.isArray(v) && v.every((s) => typeof s === 'string')),
  );
}

function getMessageFromValue(
  value: string | string[] | undefined,
): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value || null;
  return value[0] ?? null;
}

export function getFirstApiErrorMessage(
  error: unknown,
  fieldOrder?: string[],
): string | null {
  if (!isRtkQueryErrorWithData(error) || error.data == null) {
    return null;
  }

  const data = error.data;
  if (!isApiErrorPayload(data)) {
    return null;
  }

  if (fieldOrder?.length) {
    for (const field of fieldOrder) {
      const value = data[field];
      const msg = getMessageFromValue(value);
      if (msg) return msg;
    }
  }

  const detail = getMessageFromValue(data.detail);
  if (detail) return detail;

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const msg = getMessageFromValue(data[firstKey]);
    if (msg) return msg;
  }

  return null;
}
