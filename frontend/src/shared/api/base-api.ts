import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api';

const UPLOAD_IMAGE_ENDPOINT = 'v1EducationCoursesUploadImageCreate';
const UPLOAD_ARTICLE_MEDIA_ENDPOINT = 'uploadArticleMedia';

const ENDPOINTS_WITHOUT_JSON_BODY = new Set<string>([
  UPLOAD_IMAGE_ENDPOINT,
  UPLOAD_ARTICLE_MEDIA_ENDPOINT,
]);

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { endpoint }) => {
    if (endpoint && ENDPOINTS_WITHOUT_JSON_BODY.has(endpoint)) {
      return headers;
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: API_CONFIG.ENDPOINTS.REFRESH,
        method: 'POST',
      },
      api,
      extraOptions,
    );

    if (!refreshResult.error) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: API_CONFIG.API_REDUCER_PATH,
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(API_CONFIG.TAG_TYPES),
  endpoints: () => ({}),
});
