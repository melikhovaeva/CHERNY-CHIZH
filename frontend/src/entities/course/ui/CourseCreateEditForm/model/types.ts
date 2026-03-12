import type { Course } from '@/shared/api/generated/courses.generated';

export interface CourseCreateEditFormProps {
  data?: Course;
  onSubmit?: (data: Course) => void;
}
