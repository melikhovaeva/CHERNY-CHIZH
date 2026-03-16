import type {
  Course,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';
import type { RegisterOptions } from 'react-hook-form';

export type FieldValidationLike = Partial<
  Pick<RegisterOptions<Course>, 'required'>
>;

export type CourseFormData = Course & {
  tags?: InfoTagRead[];
  imageFile?: File | null;
};

export interface CourseCreateEditFormProps {
  data?: CourseFormData;
  onSubmit?: (data: CourseFormData) => void;
}
