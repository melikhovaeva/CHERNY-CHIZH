import type {
  Course,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';

export type CourseFormData = Course & { tags?: InfoTagRead[] };

export interface CourseCreateEditFormProps {
  data?: CourseFormData;
  onSubmit?: (data: CourseFormData) => void;
}
