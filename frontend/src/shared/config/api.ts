const API_VERSION = 'v1' as const;
const API_PREFIX = `api/${API_VERSION}/` as const;

export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL_LOCAL,
  API_VERSION,
  API_PREFIX,
  API_REDUCER_PATH: 'api',
  ENDPOINTS: {
    DOGS: `${API_PREFIX}dogs/`,
    DOGS_BY_BREED: (breedSlug: string) =>
      `${API_PREFIX}breeds/${breedSlug}/dogs/`,
    BREEDS: `${API_PREFIX}breeds/`,
    FAQ: `${API_PREFIX}faq/`,
    DICTIONARIES: `${API_PREFIX}dictionaries/`,
    REGISTER_STEP1: `${API_PREFIX}users/register/step1/`,
    REGISTER_STEP2: `${API_PREFIX}users/register/step2/`,
    REQUESTS: `${API_PREFIX}requests/`,
    LOGIN: `${API_PREFIX}users/auth/login/`,
    ME: `${API_PREFIX}users/me/`,
    REFRESH: `${API_PREFIX}users/auth/refresh/`,
    LOGOUT: `${API_PREFIX}users/auth/logout/`,
  } as const,
  TAG_TYPES: {
    PUPPIES: 'Puppies',
    BREEDS: 'Breeds',
    FAQ: 'FAQ',
    DICTIONARIES: 'Dictionaries',
    SESSION: 'Session',
  } as const,
} as const;
