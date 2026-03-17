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
  useV1EducationCoursesRetrieveQuery,
  useV1EducationCoursesUpdateMutation,
  useV1EducationCoursesPartialUpdateMutation,
  useV1EducationCoursesDestroyMutation,
  useV1EducationCoursesUploadImageCreateMutation,
} = injectedRtkApi;
