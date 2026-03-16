import type { CourseEnrollmentRead } from '@/entities/course';

interface IsCourseAccessibleOptions {
  slug: string;
  enrollments: CourseEnrollmentRead[] | undefined;
  isAdmin: boolean;
}

export function isCourseAccessible({
  slug,
  enrollments,
  isAdmin,
}: IsCourseAccessibleOptions): boolean {
  if (isAdmin) {
    return true;
  }

  if (!enrollments || enrollments.length === 0) {
    return false;
  }

  return enrollments.some((enrollment) => enrollment.course.slug === slug);
}

