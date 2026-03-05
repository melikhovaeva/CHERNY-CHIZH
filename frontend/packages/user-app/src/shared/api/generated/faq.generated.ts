import { baseApi as api } from "../base-api";
export const addTagTypes = ["FAQ"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1FaqList: build.query<V1FaqListApiResponse, V1FaqListApiArg>({
        query: (queryArg) => ({
          url: `/api/v1/faq/`,
          params: {
            category: queryArg.category,
          },
        }),
        providesTags: ["FAQ"],
      }),
      v1FaqRetrieve: build.query<V1FaqRetrieveApiResponse, V1FaqRetrieveApiArg>(
        {
          query: (queryArg) => ({ url: `/api/v1/faq/${queryArg.id}/` }),
          providesTags: ["FAQ"],
        },
      ),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1FaqListApiResponse = /** status 200  */ FaqItemRead[];
export type V1FaqListApiArg = {
  /** Категория FAQ (если указана, вернутся только элементы этой категории). */
  category?: string;
};
export type V1FaqRetrieveApiResponse = /** status 200  */ FaqItemRead;
export type V1FaqRetrieveApiArg = {
  /** A unique integer value identifying this FAQ элемент. */
  id: number;
};
export type CategoryEnum = "general" | "delivery";
export type FaqItem = {
  title: string;
  content: string;
  category?: CategoryEnum;
};
export type FaqItemRead = {
  id: number;
  title: string;
  content: string;
  category?: CategoryEnum;
};
export const { useV1FaqListQuery, useV1FaqRetrieveQuery } = injectedRtkApi;
