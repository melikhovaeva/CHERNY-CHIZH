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
        query: (queryArg) => ({
          url: `/api/v1/requests/`,
          params: {
            status: queryArg?.status,
            request_type: queryArg?.requestType,
          },
        }),
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
      v1RequestsPartialUpdate: build.mutation<
        V1RequestsPartialUpdateApiResponse,
        V1RequestsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/requests/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedRequest,
        }),
        invalidatesTags: ["Requests"],
      }),
      v1RequestsDestroy: build.mutation<
        V1RequestsDestroyApiResponse,
        V1RequestsDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/requests/${queryArg.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["Requests"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };

export type RequestStatus = "new" | "in_work" | "closed" | "rejected";
export type RequestType = "consultation" | "booking" | "waiting_list";
export type PrepaymentStatus = "not_paid" | "paid";

export type DogRef = { id: number; name: string };
export type BreedRef = { id: number; name: string };

export type Request = {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
  status?: RequestStatus;
  requestType?: RequestType;
  prepaymentStatus?: PrepaymentStatus;
  prepaymentAmount?: string | null;
  plannedDate?: string | null;
  city?: string | null;
  street?: string | null;
  house?: string | null;
  apartment?: string | null;
  breed?: number | null;
  comment?: string | null;
};

export type RequestRead = {
  id: number;
  user: string | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: DogRef | null;
  status: RequestStatus;
  requestType: RequestType;
  prepaymentStatus: PrepaymentStatus;
  prepaymentAmount?: string | null;
  plannedDate?: string | null;
  city?: string | null;
  street?: string | null;
  house?: string | null;
  apartment?: string | null;
  breed?: BreedRef | null;
  comment?: string | null;
  createdAt?: string | null;
};

export type PatchedRequest = Partial<Request>;

export type V1RequestsListApiResponse = RequestRead[];
export type V1RequestsListApiArg = {
  status?: RequestStatus;
  requestType?: RequestType;
} | void;

export type V1RequestsCreateApiResponse = RequestRead;
export type V1RequestsCreateApiArg = {
  request: Request;
};

export type V1RequestsRetrieveApiResponse = RequestRead;
export type V1RequestsRetrieveApiArg = {
  id: number;
};

export type V1RequestsPartialUpdateApiResponse = RequestRead;
export type V1RequestsPartialUpdateApiArg = {
  id: number;
  patchedRequest: PatchedRequest;
};

export type V1RequestsDestroyApiResponse = void;
export type V1RequestsDestroyApiArg = {
  id: number;
};

export const {
  useV1RequestsListQuery,
  useV1RequestsCreateMutation,
  useV1RequestsRetrieveQuery,
  useV1RequestsPartialUpdateMutation,
  useV1RequestsDestroyMutation,
} = injectedRtkApi;
