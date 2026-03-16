import {
  enhancedApi,
  useV1CoursesListQuery,
  useV1CoursesRetrieveQuery,
  useV1EducationCoursesCreateMutation,
  useV1EducationCoursesUpdateMutation,
} from '@/shared/api/generated/courses.generated';
import { useV1UsersMeCoursesListQuery } from '@/shared/api/generated/users.generated';

export const coursesApi = enhancedApi;

export const useGetCoursesQuery = useV1CoursesListQuery;
export const useGetCourseQuery = useV1CoursesRetrieveQuery;
export const useGetMyCoursesQuery = useV1UsersMeCoursesListQuery;
export const useCreateCourseMutation = useV1EducationCoursesCreateMutation;
export const useUpdateCourseMutation = useV1EducationCoursesUpdateMutation;

export type { CourseRead, CourseDetailRead } from '@/shared/api/generated/courses.generated';
export type { CourseEnrollmentRead } from '@/shared/api/generated/users.generated';
