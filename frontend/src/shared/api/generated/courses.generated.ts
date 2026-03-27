import { baseApi as api } from "../base-api";
export const addTagTypes = ["Courses", "Education"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1CoursesList: build.query<V1CoursesListApiResponse, V1CoursesListApiArg>(
        {
          query: () => ({ url: `/api/v1/courses/` }),
          providesTags: ["Courses"],
        },
      ),
      v1CoursesRetrieve: build.query<
        V1CoursesRetrieveApiResponse,
        V1CoursesRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/courses/${queryArg.id}/` }),
        providesTags: ["Courses"],
      }),
      v1EducationCoursesList: build.query<
        V1EducationCoursesListApiResponse,
        V1EducationCoursesListApiArg
      >({
        query: () => ({ url: `/api/v1/education/courses/` }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesCreate: build.mutation<
        V1EducationCoursesCreateApiResponse,
        V1EducationCoursesCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/`,
          method: "POST",
          body: queryArg.courseCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsList: build.query<
        V1EducationCoursesStepsListApiResponse,
        V1EducationCoursesStepsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsCreate: build.mutation<
        V1EducationCoursesStepsCreateApiResponse,
        V1EducationCoursesStepsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/`,
          method: "POST",
          body: queryArg.courseStepCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsRetrieve: build.query<
        V1EducationCoursesStepsRetrieveApiResponse,
        V1EducationCoursesStepsRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.id}/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsUpdate: build.mutation<
        V1EducationCoursesStepsUpdateApiResponse,
        V1EducationCoursesStepsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.id}/`,
          method: "PUT",
          body: queryArg.courseStepCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsPartialUpdate: build.mutation<
        V1EducationCoursesStepsPartialUpdateApiResponse,
        V1EducationCoursesStepsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedCourseStepCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsDestroy: build.mutation<
        V1EducationCoursesStepsDestroyApiResponse,
        V1EducationCoursesStepsDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsList: build.query<
        V1EducationCoursesStepsLessonsListApiResponse,
        V1EducationCoursesStepsLessonsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsCreate: build.mutation<
        V1EducationCoursesStepsLessonsCreateApiResponse,
        V1EducationCoursesStepsLessonsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/`,
          method: "POST",
          body: queryArg.courseLessonCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsRetrieve: build.query<
        V1EducationCoursesStepsLessonsRetrieveApiResponse,
        V1EducationCoursesStepsLessonsRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.id}/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsUpdate: build.mutation<
        V1EducationCoursesStepsLessonsUpdateApiResponse,
        V1EducationCoursesStepsLessonsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.id}/`,
          method: "PUT",
          body: queryArg.courseLessonCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsPartialUpdate: build.mutation<
        V1EducationCoursesStepsLessonsPartialUpdateApiResponse,
        V1EducationCoursesStepsLessonsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedCourseLessonCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsDestroy: build.mutation<
        V1EducationCoursesStepsLessonsDestroyApiResponse,
        V1EducationCoursesStepsLessonsDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesRetrieve: build.query<
        V1EducationCoursesRetrieveApiResponse,
        V1EducationCoursesRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.id}/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesUpdate: build.mutation<
        V1EducationCoursesUpdateApiResponse,
        V1EducationCoursesUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.id}/`,
          method: "PUT",
          body: queryArg.courseCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesPartialUpdate: build.mutation<
        V1EducationCoursesPartialUpdateApiResponse,
        V1EducationCoursesPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedCourseCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesDestroy: build.mutation<
        V1EducationCoursesDestroyApiResponse,
        V1EducationCoursesDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesUploadImageCreate: build.mutation<
        V1EducationCoursesUploadImageCreateApiResponse,
        V1EducationCoursesUploadImageCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.id}/upload-image/`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Education"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1CoursesListApiResponse = /** status 200  */ CourseRead[];
export type V1CoursesListApiArg = void;
export type V1CoursesRetrieveApiResponse = /** status 200  */ CourseDetailRead;
export type V1CoursesRetrieveApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
};
export type V1EducationCoursesListApiResponse = /** status 200  */ CourseRead[];
export type V1EducationCoursesListApiArg = void;
export type V1EducationCoursesCreateApiResponse =
  /** status 201  */ CourseCreateUpdateRead;
export type V1EducationCoursesCreateApiArg = {
  courseCreateUpdate: CourseCreateUpdate;
};
export type V1EducationCoursesStepsListApiResponse =
  /** status 200  */ CourseStepRead[];
export type V1EducationCoursesStepsListApiArg = {
  coursePk: string;
};
export type V1EducationCoursesStepsCreateApiResponse =
  /** status 201  */ CourseStepCreateUpdateRead;
export type V1EducationCoursesStepsCreateApiArg = {
  coursePk: string;
  courseStepCreateUpdate: CourseStepCreateUpdate;
};
export type V1EducationCoursesStepsRetrieveApiResponse =
  /** status 200  */ CourseStepRead;
export type V1EducationCoursesStepsRetrieveApiArg = {
  coursePk: string;
  id: string;
};
export type V1EducationCoursesStepsUpdateApiResponse =
  /** status 200  */ CourseStepCreateUpdateRead;
export type V1EducationCoursesStepsUpdateApiArg = {
  coursePk: string;
  id: string;
  courseStepCreateUpdate: CourseStepCreateUpdate;
};
export type V1EducationCoursesStepsPartialUpdateApiResponse =
  /** status 200  */ CourseStepCreateUpdateRead;
export type V1EducationCoursesStepsPartialUpdateApiArg = {
  coursePk: string;
  id: string;
  patchedCourseStepCreateUpdate: PatchedCourseStepCreateUpdate;
};
export type V1EducationCoursesStepsDestroyApiResponse = unknown;
export type V1EducationCoursesStepsDestroyApiArg = {
  coursePk: string;
  id: string;
};
export type V1EducationCoursesStepsLessonsListApiResponse =
  /** status 200  */ CourseLessonRead[];
export type V1EducationCoursesStepsLessonsListApiArg = {
  coursePk: string;
  stepPk: string;
};
export type V1EducationCoursesStepsLessonsCreateApiResponse =
  /** status 201  */ CourseLessonCreateUpdateRead;
export type V1EducationCoursesStepsLessonsCreateApiArg = {
  coursePk: string;
  stepPk: string;
  courseLessonCreateUpdate: CourseLessonCreateUpdate;
};
export type V1EducationCoursesStepsLessonsRetrieveApiResponse =
  /** status 200  */ CourseLessonRead;
export type V1EducationCoursesStepsLessonsRetrieveApiArg = {
  coursePk: string;
  id: string;
  stepPk: string;
};
export type V1EducationCoursesStepsLessonsUpdateApiResponse =
  /** status 200  */ CourseLessonCreateUpdateRead;
export type V1EducationCoursesStepsLessonsUpdateApiArg = {
  coursePk: string;
  id: string;
  stepPk: string;
  courseLessonCreateUpdate: CourseLessonCreateUpdate;
};
export type V1EducationCoursesStepsLessonsPartialUpdateApiResponse =
  /** status 200  */ CourseLessonCreateUpdateRead;
export type V1EducationCoursesStepsLessonsPartialUpdateApiArg = {
  coursePk: string;
  id: string;
  stepPk: string;
  patchedCourseLessonCreateUpdate: PatchedCourseLessonCreateUpdate;
};
export type V1EducationCoursesStepsLessonsDestroyApiResponse = unknown;
export type V1EducationCoursesStepsLessonsDestroyApiArg = {
  coursePk: string;
  id: string;
  stepPk: string;
};
export type V1EducationCoursesRetrieveApiResponse =
  /** status 200  */ CourseDetailRead;
export type V1EducationCoursesRetrieveApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
};
export type V1EducationCoursesUpdateApiResponse =
  /** status 200  */ CourseCreateUpdateRead;
export type V1EducationCoursesUpdateApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
  courseCreateUpdate: CourseCreateUpdate;
};
export type V1EducationCoursesPartialUpdateApiResponse =
  /** status 200  */ CourseCreateUpdateRead;
export type V1EducationCoursesPartialUpdateApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
  patchedCourseCreateUpdate: PatchedCourseCreateUpdate;
};
export type V1EducationCoursesDestroyApiResponse = unknown;
export type V1EducationCoursesDestroyApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
};
export type V1EducationCoursesUploadImageCreateApiResponse =
  /** status 200  */ {
    [key: string]: any;
  };
export type V1EducationCoursesUploadImageCreateApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
  body: {
    /** Файл изображения (JPEG, PNG, GIF, WebP, макс. 5 МБ) */
    image: Blob;
  };
};
export type DifficultyEnum = "beginner" | "intermediate" | "advanced";
export type Course = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
};
export type CodeLabel = {
  code: string;
  label: string;
};
export type InfoTag = {
  code: string;
  label: string;
  order?: number;
};
export type InfoTagRead = {
  id: number;
  code: string;
  label: string;
  order?: number;
};
export type CourseRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
  status: CodeLabel;
  tags: InfoTagRead[];
  createdAt: string;
  updatedAt: string;
};
export type CourseDetail = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
};
export type CourseStep = {
  order?: number;
  title: string;
};
export type CourseLesson = {
  order?: number;
  title: string;
};
export type ArticleBrief = {
  title: string;
  slug: string;
};
export type ArticleBriefRead = {
  id: number;
  title: string;
  slug: string;
};
export type CourseTask = {
  order?: number;
  title: string;
  description?: string | null;
};
export type CourseTaskQuestion = {
  order?: number;
  text: string;
};
export type CourseTaskAnswer = {
  order?: number;
  text: string;
  isCorrect?: boolean;
};
export type CourseTaskAnswerRead = {
  id: number;
  order?: number;
  text: string;
  isCorrect?: boolean;
};
export type CourseTaskQuestionRead = {
  id: number;
  order?: number;
  text: string;
  answers: CourseTaskAnswerRead[];
};
export type CourseTaskRead = {
  id: number;
  order?: number;
  title: string;
  description?: string | null;
  questions: CourseTaskQuestionRead[];
};
export type CourseLessonRead = {
  id: number;
  order?: number;
  title: string;
  article: ArticleBriefRead;
  tasks: CourseTaskRead[];
};
export type CourseStepRead = {
  id: number;
  order?: number;
  title: string;
  lessons: CourseLessonRead[];
};
export type CourseDetailRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
  status: CodeLabel;
  tags: InfoTagRead[];
  createdAt: string;
  updatedAt: string;
  steps: CourseStepRead[];
};
export type CourseCreateUpdateStatusEnum = "published" | "unpublished";
export type CourseCreateUpdate = {
  title: string;
  description: string;
  actionText: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: CourseCreateUpdateStatusEnum;
  tags?: number[];
};
export type CourseCreateUpdateRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  actionText: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: CourseCreateUpdateStatusEnum;
  tags?: number[];
  createdAt: string;
  updatedAt: string;
};
export type CourseStepCreateUpdate = {
  title: string;
  order?: number;
};
export type CourseStepCreateUpdateRead = {
  id: number;
  course: number;
  title: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
};
export type PatchedCourseStepCreateUpdate = {
  title?: string;
  order?: number;
};
export type PatchedCourseStepCreateUpdateRead = {
  id?: number;
  course?: number;
  title?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};
export type CourseLessonCreateUpdate = {
  title: string;
  order?: number;
  articleId?: number | null;
};
export type CourseLessonCreateUpdateRead = {
  id: number;
  step: number;
  title: string;
  order?: number;
  articleId?: number | null;
  createdAt: string;
  updatedAt: string;
};
export type PatchedCourseLessonCreateUpdate = {
  title?: string;
  order?: number;
  articleId?: number | null;
};
export type PatchedCourseLessonCreateUpdateRead = {
  id?: number;
  step?: number;
  title?: string;
  order?: number;
  articleId?: number | null;
  createdAt?: string;
  updatedAt?: string;
};
export type PatchedCourseCreateUpdate = {
  title?: string;
  description?: string;
  actionText?: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: CourseCreateUpdateStatusEnum;
  tags?: number[];
};
export type PatchedCourseCreateUpdateRead = {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  actionText?: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: CourseCreateUpdateStatusEnum;
  tags?: number[];
  createdAt?: string;
  updatedAt?: string;
};
export const {
  useV1CoursesListQuery,
  useV1CoursesRetrieveQuery,
  useV1EducationCoursesListQuery,
  useV1EducationCoursesCreateMutation,
  useV1EducationCoursesStepsListQuery,
  useV1EducationCoursesStepsCreateMutation,
  useV1EducationCoursesStepsRetrieveQuery,
  useV1EducationCoursesStepsUpdateMutation,
  useV1EducationCoursesStepsPartialUpdateMutation,
  useV1EducationCoursesStepsDestroyMutation,
  useV1EducationCoursesStepsLessonsListQuery,
  useV1EducationCoursesStepsLessonsCreateMutation,
  useV1EducationCoursesStepsLessonsRetrieveQuery,
  useV1EducationCoursesStepsLessonsUpdateMutation,
  useV1EducationCoursesStepsLessonsPartialUpdateMutation,
  useV1EducationCoursesStepsLessonsDestroyMutation,
  useV1EducationCoursesRetrieveQuery,
  useV1EducationCoursesUpdateMutation,
  useV1EducationCoursesPartialUpdateMutation,
  useV1EducationCoursesDestroyMutation,
  useV1EducationCoursesUploadImageCreateMutation,
} = injectedRtkApi;
