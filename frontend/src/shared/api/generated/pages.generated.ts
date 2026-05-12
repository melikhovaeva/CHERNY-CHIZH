import { baseApi as api } from "../base-api";
export const addTagTypes = [
  "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1PagesAboutRetrieve: build.query<
        V1PagesAboutRetrieveApiResponse,
        V1PagesAboutRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/pages/about/` }),
        providesTags: ["\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B"],
      }),
      v1PagesContactsRetrieve: build.query<
        V1PagesContactsRetrieveApiResponse,
        V1PagesContactsRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/pages/contacts/` }),
        providesTags: ["\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1PagesAboutRetrieveApiResponse = /** status 200  */ AboutPageRead;
export type V1PagesAboutRetrieveApiArg = void;
export type V1PagesContactsRetrieveApiResponse =
  /** status 200  */ ContactsPageRead;
export type V1PagesContactsRetrieveApiArg = void;
export type AboutPage = {
  title?: string;
  subtitle?: string;
  missionTitle?: string;
  missionText?: string;
  ctaTitle?: string;
  ctaText?: string;
};
export type AboutValue = {
  title: string;
  description: string;
  order?: number;
};
export type AboutValueRead = {
  id: number;
  title: string;
  description: string;
  order?: number;
};
export type AboutMilestone = {
  year: string;
  text: string;
  order?: number;
};
export type AboutMilestoneRead = {
  id: number;
  year: string;
  text: string;
  order?: number;
};
export type AboutPageRead = {
  title?: string;
  subtitle?: string;
  missionTitle?: string;
  missionText?: string;
  ctaTitle?: string;
  ctaText?: string;
  values: AboutValueRead[];
  milestones: AboutMilestoneRead[];
};
export type ContactsPage = {
  title?: string;
  subtitle?: string;
  address?: string;
  addressNote?: string;
  bannerTitle?: string;
  bannerText?: string;
  bannerEmail?: string;
};
export type ContactTypeEnum = "phone" | "email";
export type ContactInfo = {
  contactType: ContactTypeEnum;
  label: string;
  value: string;
  href: string;
  order?: number;
};
export type ContactInfoRead = {
  id: number;
  contactType: ContactTypeEnum;
  label: string;
  value: string;
  href: string;
  order?: number;
};
export type SocialLink = {
  /** vk, messenger, instagram, whatsapp */
  name: string;
  label: string;
  value: string;
  href: string;
  order?: number;
};
export type SocialLinkRead = {
  id: number;
  /** vk, messenger, instagram, whatsapp */
  name: string;
  label: string;
  value: string;
  href: string;
  order?: number;
};
export type Schedule = {
  days: string;
  hours: string;
  order?: number;
};
export type ScheduleRead = {
  id: number;
  days: string;
  hours: string;
  order?: number;
};
export type ContactsPageRead = {
  title?: string;
  subtitle?: string;
  address?: string;
  addressNote?: string;
  bannerTitle?: string;
  bannerText?: string;
  bannerEmail?: string;
  contacts: ContactInfoRead[];
  socials: SocialLinkRead[];
  schedule: ScheduleRead[];
};
export const { useV1PagesAboutRetrieveQuery, useV1PagesContactsRetrieveQuery } =
  injectedRtkApi;
