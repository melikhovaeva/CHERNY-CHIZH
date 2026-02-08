export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL_LOCAL,
  API_REDUCER_PATH: 'api',
  ENDPOINTS: {
    PUPPIES: '/puppies',
  } as const,
  TAG_TYPES: {
    PUPPIES: 'Puppies',
  } as const,
} as const;
