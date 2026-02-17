import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';
import type { FAQItem } from '../model/types';

export type GetFAQItemsArg = { category: string };

export const faqItemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFAQItems: build.query<FAQItem[], GetFAQItemsArg>({
      query: ({ category }) => ({
        url: API_CONFIG.ENDPOINTS.FAQ,
        params: { category },
      }),
      providesTags: (result, _error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_CONFIG.TAG_TYPES.FAQ,
                id,
              })),
              { type: API_CONFIG.TAG_TYPES.FAQ, id: `LIST-${arg.category}` },
            ]
          : [{ type: API_CONFIG.TAG_TYPES.FAQ, id: `LIST-${arg.category}` }],
    }),
  }),
});

export const { useGetFAQItemsQuery } = faqItemsApi;
