import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: API_CONFIG.API_REDUCER_PATH,
  baseQuery,
  tagTypes: Object.values(API_CONFIG.TAG_TYPES),
  endpoints: () => ({}),
});
