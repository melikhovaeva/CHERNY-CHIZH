import {
  useV1EducationCoursesPartialUpdateMutation,
  type CourseCreateUpdateStatusEnum,
  type PatchedCourseCreateUpdate,
} from '@/shared/api/generated/courses.generated';

export function usePatchCourseStatusMutation() {
  const [mutate, result] = useV1EducationCoursesPartialUpdateMutation();

  const patchCourseStatus = (args: { id: number; status: CourseCreateUpdateStatusEnum }) => {
    const body: PatchedCourseCreateUpdate = { status: args.status };
    return mutate({ id: args.id, patchedCourseCreateUpdate: body });
  };

  return [patchCourseStatus, result] as const;
}

