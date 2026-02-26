import { baseApi } from '@/shared/api/base-api';
import { API_CONFIG } from '@/shared/config/api';

export interface CourseStatus {
  code: string;
  label: string;
}

export interface CourseTag {
  id: number;
  code: string;
  label: string;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview: string | null;
  actionText: string;
  difficulty: string;
  status: CourseStatus | null;
  tags: CourseTag[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: number;
  course: Course;
  status: string;
  progress: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query<Course[], void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.COURSES,
        method: 'GET',
      }),
      providesTags: [API_CONFIG.TAG_TYPES.COURSES],
    }),
    getMyCourses: build.query<CourseEnrollment[], void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.ME_COURSES,
        method: 'GET',
      }),
      providesTags: [API_CONFIG.TAG_TYPES.COURSES],
    }),
  }),
});

export const { useGetCoursesQuery, useGetMyCoursesQuery } = coursesApi;

