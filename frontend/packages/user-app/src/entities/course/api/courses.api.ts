import { enhancedApi, useV1CoursesListQuery } from '@/shared/api/generated/courses.generated';
import { useV1UsersMeCoursesListQuery } from '@/shared/api/generated/users.generated';

export const coursesApi = enhancedApi;

export const useGetCoursesQuery = useV1CoursesListQuery;
export const useGetMyCoursesQuery = useV1UsersMeCoursesListQuery;

export type { CourseRead, CourseDetailRead } from '@/shared/api/generated/courses.generated';
export type { CourseEnrollmentRead } from '@/shared/api/generated/users.generated';
