import {
  enhancedApi,
  useV1CoursesListQuery,
  useV1CoursesRetrieveQuery,
  useV1EducationCoursesCreateMutation,
  useV1EducationCoursesUpdateMutation,
  useV1EducationCoursesUploadImageCreateMutation,
  useV1EducationCoursesStepsListQuery,
  useV1EducationCoursesStepsCreateMutation,
  useV1EducationCoursesStepsPartialUpdateMutation,
  useV1EducationCoursesStepsUpdateMutation,
  useV1EducationCoursesStepsDestroyMutation,
  useV1EducationCoursesStepsLessonsCreateMutation,
  useV1EducationCoursesStepsLessonsPartialUpdateMutation,
  useV1EducationCoursesStepsLessonsUpdateMutation,
  useV1EducationCoursesStepsLessonsDestroyMutation,
} from "@/shared/api/generated/courses.generated";
import {
  enhancedApi as educationEnhancedApi,
  useV1EducationCoursesStepsLessonsTasksCreateMutation,
  useV1EducationCoursesStepsLessonsTasksPartialUpdateMutation,
  useV1EducationCoursesStepsLessonsTasksDestroyMutation,
  useV1EducationTaskAttemptsListQuery,
  useV1EducationTaskAttemptsCreateMutation,
  useV1EducationTaskAttemptsResetDestroyMutation,
} from "@/shared/api/generated/education.generated";
import {
  useV1UsersMeCoursesCreateMutation,
  useV1UsersMeCoursesListQuery,
} from "@/shared/api/generated/users.generated";

export const coursesApi = enhancedApi;

export const useGetCoursesQuery = useV1CoursesListQuery;
export const useGetCourseQuery = useV1CoursesRetrieveQuery;
export const useGetMyCoursesQuery = useV1UsersMeCoursesListQuery;
export const useCreateCourseMutation = useV1EducationCoursesCreateMutation;
export const useUpdateCourseMutation = useV1EducationCoursesUpdateMutation;

export const useEnrollToCourseMutation = useV1UsersMeCoursesCreateMutation;

// Steps CRUD
export const useGetCourseStepsQuery = useV1EducationCoursesStepsListQuery;
export const useCreateStepMutation = useV1EducationCoursesStepsCreateMutation;
export const useUpdateStepMutation = useV1EducationCoursesStepsUpdateMutation;
export const useUpdateStepPartialMutation =
  useV1EducationCoursesStepsPartialUpdateMutation;
export const useDeleteStepMutation = useV1EducationCoursesStepsDestroyMutation;

// Lessons CRUD
export const useCreateLessonMutation =
  useV1EducationCoursesStepsLessonsCreateMutation;
export const useUpdateLessonMutation =
  useV1EducationCoursesStepsLessonsUpdateMutation;
export const useUpdateLessonPartialMutation =
  useV1EducationCoursesStepsLessonsPartialUpdateMutation;
export const useDeleteLessonMutation =
  useV1EducationCoursesStepsLessonsDestroyMutation;

// Tasks CRUD
export const useCreateTaskMutation =
  useV1EducationCoursesStepsLessonsTasksCreateMutation;
export const useUpdateTaskPartialMutation =
  useV1EducationCoursesStepsLessonsTasksPartialUpdateMutation;
export const useDeleteTaskMutation =
  useV1EducationCoursesStepsLessonsTasksDestroyMutation;

// Task attempts (learner progress)
export const useGetTaskAttemptsQuery = useV1EducationTaskAttemptsListQuery;
export const useSubmitTaskAttemptMutation =
  useV1EducationTaskAttemptsCreateMutation;
export const useResetTaskAttemptsMutation =
  useV1EducationTaskAttemptsResetDestroyMutation;

/** Загрузка изображения курса (multipart/form-data). */
export function useUploadCourseImageMutation() {
  const [mutate, result] = useV1EducationCoursesUploadImageCreateMutation();
  const uploadCourseImage = (args: { id: number; file: File }) => {
    const formData = new FormData();
    formData.append("image", args.file);
    return mutate({
      id: args.id,
      body: formData as unknown as { image: Blob },
    });
  };
  return [uploadCourseImage, result] as const;
}

coursesApi.enhanceEndpoints({
  endpoints: {
    v1EducationCoursesCreate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesUploadImageCreate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsCreate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsPartialUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsDestroy: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsCreate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsPartialUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsDestroy: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsTasksCreate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsTasksUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsTasksPartialUpdate: {
      invalidatesTags: ["Education", "Courses"],
    },
    v1EducationCoursesStepsLessonsTasksDestroy: {
      invalidatesTags: ["Education", "Courses"],
    },
  },
});

educationEnhancedApi.enhanceEndpoints({
  endpoints: {
    v1EducationTaskAttemptsCreate: {
      invalidatesTags: ["Education"],
    },
    v1EducationTaskAttemptsResetDestroy: {
      invalidatesTags: ["Education"],
    },
  },
});

export type {
  CourseDetailRead,
  CourseRead,
} from "@/shared/api/generated/courses.generated";
export type { CourseEnrollmentRead } from "@/shared/api/generated/users.generated";
export type {
  CourseTaskRead,
  CourseTaskCreateUpdate,
  CourseTaskQuestionWrite,
  CourseTaskAnswerWrite,
  UserTaskAttemptReadRead,
  UserTaskAttemptCreate,
} from "@/shared/api/generated/education.generated";
