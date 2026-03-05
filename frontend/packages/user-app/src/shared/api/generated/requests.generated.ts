import { baseApi as api } from "../base-api";
export const addTagTypes = ["Requests"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1RequestsList: build.query<
        V1RequestsListApiResponse,
        V1RequestsListApiArg
      >({
        query: () => ({ url: `/api/v1/requests/` }),
        providesTags: ["Requests"],
      }),
      v1RequestsCreate: build.mutation<
        V1RequestsCreateApiResponse,
        V1RequestsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/requests/`,
          method: "POST",
          body: queryArg.request,
        }),
        invalidatesTags: ["Requests"],
      }),
      v1RequestsRetrieve: build.query<
        V1RequestsRetrieveApiResponse,
        V1RequestsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/requests/${queryArg.id}/` }),
        providesTags: ["Requests"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1RequestsListApiResponse = /** status 200  */ RequestRead[];
export type V1RequestsListApiArg = void;
export type V1RequestsCreateApiResponse = /** status 201  */ RequestRead;
export type V1RequestsCreateApiArg = {
  request: Request;
};
export type V1RequestsRetrieveApiResponse = /** status 200  */ RequestRead;
export type V1RequestsRetrieveApiArg = {
  id: string;
  /** ID заявки. */
  pk: number;
};
export type Request = {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
};
export type RequestRead = {
  id: number;
  user: number | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
};
export const {
  useV1RequestsListQuery,
  useV1RequestsCreateMutation,
  useV1RequestsRetrieveQuery,
} = injectedRtkApi;
