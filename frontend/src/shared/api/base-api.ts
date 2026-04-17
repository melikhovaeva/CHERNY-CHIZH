import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api';

const UPLOAD_IMAGE_ENDPOINT = 'v1EducationCoursesUploadImageCreate';
const UPLOAD_ARTICLE_MEDIA_ENDPOINT = 'uploadArticleMedia';
const UPLOAD_DOG_PHOTO_ENDPOINT = 'nurseryUploadPhoto';
const UPLOAD_DOG_DOCUMENT_ENDPOINT = 'nurseryUploadDocument';

const ENDPOINTS_WITHOUT_JSON_BODY = new Set<string>([
  UPLOAD_IMAGE_ENDPOINT,
  UPLOAD_ARTICLE_MEDIA_ENDPOINT,
  UPLOAD_DOG_PHOTO_ENDPOINT,
  UPLOAD_DOG_DOCUMENT_ENDPOINT,
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

let refreshAccessInFlight: Promise<boolean> | null = null;

function refreshAccessToken(
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<boolean> {
  if (!refreshAccessInFlight) {
    refreshAccessInFlight = (async (): Promise<boolean> => {
      const refreshResult = await rawBaseQuery(
        {
          url: API_CONFIG.ENDPOINTS.REFRESH,
          method: 'POST',
        },
        api,
        extraOptions,
      );
      return !refreshResult.error;
    })().finally(() => {
      refreshAccessInFlight = null;
    });
  }
  return refreshAccessInFlight;
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshedOk = await refreshAccessToken(api, extraOptions);
    if (refreshedOk) {
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
