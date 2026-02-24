export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL_LOCAL,
  API_REDUCER_PATH: 'api',
  ENDPOINTS: {
    DOGS: 'api/dogs/',
    DOGS_BY_BREED: (breedSlug: string) => `api/breeds/${breedSlug}/dogs/`,
    BREEDS: 'api/breeds/',
    FAQ: 'api/faq/',
    DICTIONARIES: 'api/dictionaries/',
    REGISTER_STEP1: 'api/users/register/step1/',
    REGISTER_STEP2: 'api/users/register/step2/',
  } as const,
  TAG_TYPES: {
    PUPPIES: 'Puppies',
    BREEDS: 'Breeds',
    FAQ: 'FAQ',
    DICTIONARIES: 'Dictionaries',
    SESSION: 'Session',
  } as const,
} as const;
