import {
  enhancedApi,
  useV1FaqListQuery,
} from '@/shared/api/generated/faq.generated';

export const faqItemsApi = enhancedApi;
export const useGetFAQItemsQuery = useV1FaqListQuery;

export type { V1FaqListApiArg as GetFAQItemsArg } from '@/shared/api/generated/faq.generated';
