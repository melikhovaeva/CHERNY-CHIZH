import { baseApi as api } from "../base-api";
export const addTagTypes = ["Education", "v1"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1EducationArticlesList: build.query<
        V1EducationArticlesListApiResponse,
        V1EducationArticlesListApiArg
      >({
        query: () => ({ url: `/api/v1/education/articles/` }),
        providesTags: ["Education"],
      }),
      v1EducationArticlesCreate: build.mutation<
        V1EducationArticlesCreateApiResponse,
        V1EducationArticlesCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/`,
          method: "POST",
          body: queryArg.articleAdminCreate,
        }),
        invalidatesTags: ["v1"],
      }),
      v1EducationArticlesRetrieve: build.query<
        V1EducationArticlesRetrieveApiResponse,
        V1EducationArticlesRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationArticlesUpdate: build.mutation<
        V1EducationArticlesUpdateApiResponse,
        V1EducationArticlesUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/`,
          method: "PUT",
          body: queryArg.articleAdminWrite,
        }),
        invalidatesTags: ["v1"],
      }),
      v1EducationArticlesPartialUpdate: build.mutation<
        V1EducationArticlesPartialUpdateApiResponse,
        V1EducationArticlesPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/`,
          method: "PATCH",
          body: queryArg.patchedArticleAdminWrite,
        }),
        invalidatesTags: ["v1"],
      }),
      v1EducationArticlesDestroy: build.mutation<
        V1EducationArticlesDestroyApiResponse,
        V1EducationArticlesDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["v1"],
      }),
      v1EducationArticlesUploadImageCreate: build.mutation<
        V1EducationArticlesUploadImageCreateApiResponse,
        V1EducationArticlesUploadImageCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/upload-image/`,
          method: "POST",
          body: queryArg.articleAdminRead,
        }),
        invalidatesTags: ["v1"],
      }),
      v1EducationArticlesUploadMediaCreate: build.mutation<
        V1EducationArticlesUploadMediaCreateApiResponse,
        V1EducationArticlesUploadMediaCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/articles/${queryArg.slug}/upload-media/`,
          method: "POST",
          body: queryArg.articleAdminRead,
        }),
        invalidatesTags: ["v1"],
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
      v1EducationCoursesStepsLessonsTasksList: build.query<
        V1EducationCoursesStepsLessonsTasksListApiResponse,
        V1EducationCoursesStepsLessonsTasksListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsTasksCreate: build.mutation<
        V1EducationCoursesStepsLessonsTasksCreateApiResponse,
        V1EducationCoursesStepsLessonsTasksCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/`,
          method: "POST",
          body: queryArg.courseTaskCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsTasksRetrieve: build.query<
        V1EducationCoursesStepsLessonsTasksRetrieveApiResponse,
        V1EducationCoursesStepsLessonsTasksRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/${queryArg.id}/`,
        }),
        providesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsTasksUpdate: build.mutation<
        V1EducationCoursesStepsLessonsTasksUpdateApiResponse,
        V1EducationCoursesStepsLessonsTasksUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/${queryArg.id}/`,
          method: "PUT",
          body: queryArg.courseTaskCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsTasksPartialUpdate: build.mutation<
        V1EducationCoursesStepsLessonsTasksPartialUpdateApiResponse,
        V1EducationCoursesStepsLessonsTasksPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedCourseTaskCreateUpdate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationCoursesStepsLessonsTasksDestroy: build.mutation<
        V1EducationCoursesStepsLessonsTasksDestroyApiResponse,
        V1EducationCoursesStepsLessonsTasksDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/courses/${queryArg.coursePk}/steps/${queryArg.stepPk}/lessons/${queryArg.lessonPk}/tasks/${queryArg.id}/`,
          method: "DELETE",
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
      v1EducationTagsList: build.query<
        V1EducationTagsListApiResponse,
        V1EducationTagsListApiArg
      >({
        query: () => ({ url: `/api/v1/education/tags/` }),
        providesTags: ["Education"],
      }),
      v1EducationTagsCreate: build.mutation<
        V1EducationTagsCreateApiResponse,
        V1EducationTagsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/tags/`,
          method: "POST",
          body: queryArg.infoTag,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationTaskAttemptsList: build.query<
        V1EducationTaskAttemptsListApiResponse,
        V1EducationTaskAttemptsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/task-attempts/`,
          params: {
            task: queryArg.task,
          },
        }),
        providesTags: ["Education"],
      }),
      v1EducationTaskAttemptsCreate: build.mutation<
        V1EducationTaskAttemptsCreateApiResponse,
        V1EducationTaskAttemptsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/task-attempts/`,
          method: "POST",
          body: queryArg.userTaskAttemptCreate,
        }),
        invalidatesTags: ["Education"],
      }),
      v1EducationTaskAttemptsResetDestroy: build.mutation<
        V1EducationTaskAttemptsResetDestroyApiResponse,
        V1EducationTaskAttemptsResetDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/education/task-attempts/reset/`,
          method: "DELETE",
          params: {
            task: queryArg.task,
          },
        }),
        invalidatesTags: ["Education"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type V1EducationArticlesListApiResponse =
  /** status 200  */ ArticleAdminListRead[];
export type V1EducationArticlesListApiArg = void;
export type V1EducationArticlesCreateApiResponse =
  /** status 201  */ ArticleAdminCreate;
export type V1EducationArticlesCreateApiArg = {
  articleAdminCreate: ArticleAdminCreate;
};
export type V1EducationArticlesRetrieveApiResponse =
  /** status 200  */ ArticleAdminReadRead;
export type V1EducationArticlesRetrieveApiArg = {
  slug: string;
};
export type V1EducationArticlesUpdateApiResponse =
  /** status 200  */ ArticleAdminWrite;
export type V1EducationArticlesUpdateApiArg = {
  slug: string;
  articleAdminWrite: ArticleAdminWrite;
};
export type V1EducationArticlesPartialUpdateApiResponse =
  /** status 200  */ ArticleAdminWrite;
export type V1EducationArticlesPartialUpdateApiArg = {
  slug: string;
  patchedArticleAdminWrite: PatchedArticleAdminWrite;
};
export type V1EducationArticlesDestroyApiResponse = unknown;
export type V1EducationArticlesDestroyApiArg = {
  slug: string;
};
export type V1EducationArticlesUploadImageCreateApiResponse =
  /** status 200  */ ArticleAdminReadRead;
export type V1EducationArticlesUploadImageCreateApiArg = {
  slug: string;
  articleAdminRead: ArticleAdminRead;
};
export type V1EducationArticlesUploadMediaCreateApiResponse =
  /** status 200  */ ArticleAdminReadRead;
export type V1EducationArticlesUploadMediaCreateApiArg = {
  slug: string;
  articleAdminRead: ArticleAdminRead;
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
export type V1EducationCoursesStepsLessonsTasksListApiResponse =
  /** status 200  */ CourseTaskRead[];
export type V1EducationCoursesStepsLessonsTasksListApiArg = {
  coursePk: string;
  lessonPk: string;
  stepPk: string;
};
export type V1EducationCoursesStepsLessonsTasksCreateApiResponse =
  /** status 201  */ CourseTaskCreateUpdateRead;
export type V1EducationCoursesStepsLessonsTasksCreateApiArg = {
  coursePk: string;
  lessonPk: string;
  stepPk: string;
  courseTaskCreateUpdate: CourseTaskCreateUpdate;
};
export type V1EducationCoursesStepsLessonsTasksRetrieveApiResponse =
  /** status 200  */ CourseTaskRead;
export type V1EducationCoursesStepsLessonsTasksRetrieveApiArg = {
  coursePk: string;
  id: string;
  lessonPk: string;
  stepPk: string;
};
export type V1EducationCoursesStepsLessonsTasksUpdateApiResponse =
  /** status 200  */ CourseTaskCreateUpdateRead;
export type V1EducationCoursesStepsLessonsTasksUpdateApiArg = {
  coursePk: string;
  id: string;
  lessonPk: string;
  stepPk: string;
  courseTaskCreateUpdate: CourseTaskCreateUpdate;
};
export type V1EducationCoursesStepsLessonsTasksPartialUpdateApiResponse =
  /** status 200  */ CourseTaskCreateUpdateRead;
export type V1EducationCoursesStepsLessonsTasksPartialUpdateApiArg = {
  coursePk: string;
  id: string;
  lessonPk: string;
  stepPk: string;
  patchedCourseTaskCreateUpdate: PatchedCourseTaskCreateUpdate;
};
export type V1EducationCoursesStepsLessonsTasksDestroyApiResponse = unknown;
export type V1EducationCoursesStepsLessonsTasksDestroyApiArg = {
  coursePk: string;
  id: string;
  lessonPk: string;
  stepPk: string;
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
export type V1EducationTagsListApiResponse = /** status 200  */ InfoTagRead[];
export type V1EducationTagsListApiArg = void;
export type V1EducationTagsCreateApiResponse = /** status 201  */ InfoTagRead;
export type V1EducationTagsCreateApiArg = {
  infoTag: InfoTag;
};
export type V1EducationTaskAttemptsListApiResponse =
  /** status 200  */ UserTaskAttemptReadRead[];
export type V1EducationTaskAttemptsListApiArg = {
  /** ID задания для фильтрации ответов. */
  task?: number;
};
export type V1EducationTaskAttemptsCreateApiResponse =
  /** status 201  */ UserTaskAttemptReadRead;
export type V1EducationTaskAttemptsCreateApiArg = {
  userTaskAttemptCreate: UserTaskAttemptCreate;
};
export type V1EducationTaskAttemptsResetDestroyApiResponse = unknown;
export type V1EducationTaskAttemptsResetDestroyApiArg = {
  /** ID задания для сброса прогресса. */
  task: number;
};
export type ArticleAdminList = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
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
export type ArticleAdminListRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  status: CodeLabel;
  tags: InfoTagRead[];
  createdAt: string;
};
export type ArticleAdminCreate = {
  title: string;
  description?: string;
  tags?: number[];
};
export type ArticleAdminRead = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
};
export type ArticleAdminReadRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  status: CodeLabel;
  tags: InfoTagRead[];
  contentBlocks: any[];
  createdAt: string;
  updatedAt: string;
};
export type InfoStatusEnum = "published" | "unpublished";
export type ArticleAdminWrite = {
  title?: string;
  description?: string;
  status?: InfoStatusEnum;
  contentBlocks?: any;
  tags?: number[];
};
export type PatchedArticleAdminWrite = {
  title?: string;
  description?: string;
  status?: InfoStatusEnum;
  contentBlocks?: any;
  tags?: number[];
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
export type CourseCreateUpdate = {
  title: string;
  description: string;
  actionText: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: InfoStatusEnum;
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
  status?: InfoStatusEnum;
  tags?: number[];
  createdAt: string;
  updatedAt: string;
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
  isPublished?: boolean;
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
  isPublished?: boolean;
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
export type CourseTaskAnswerWrite = {
  text: string;
  isCorrect?: boolean;
  order?: number;
};
export type CourseTaskQuestionWrite = {
  text: string;
  order?: number;
  answers: CourseTaskAnswerWrite[];
};
export type CourseTaskCreateUpdate = {
  title: string;
  description?: string | null;
  order?: number;
  isPublished?: boolean;
  questions?: CourseTaskQuestionWrite[];
};
export type CourseTaskCreateUpdateRead = {
  id: number;
  title: string;
  description?: string | null;
  order?: number;
  isPublished?: boolean;
  questions?: CourseTaskQuestionWrite[];
};
export type PatchedCourseTaskCreateUpdate = {
  title?: string;
  description?: string | null;
  order?: number;
  isPublished?: boolean;
  questions?: CourseTaskQuestionWrite[];
};
export type PatchedCourseTaskCreateUpdateRead = {
  id?: number;
  title?: string;
  description?: string | null;
  order?: number;
  isPublished?: boolean;
  questions?: CourseTaskQuestionWrite[];
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
export type CourseDetail = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  actionText: string;
  difficulty?: DifficultyEnum;
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
export type PatchedCourseCreateUpdate = {
  title?: string;
  description?: string;
  actionText?: string;
  imagePreview?: string | null;
  difficulty?: DifficultyEnum;
  status?: InfoStatusEnum;
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
  status?: InfoStatusEnum;
  tags?: number[];
  createdAt?: string;
  updatedAt?: string;
};
export type UserTaskAttemptRead = {};
export type UserTaskAttemptReadRead = {
  id: number;
  questionId: number;
  selectedAnswerId: number;
  isCorrect: boolean;
  createdAt: string;
};
export type UserTaskAttemptCreate = {
  questionId: number;
  answerId: number;
};
export const {
  useV1EducationArticlesListQuery,
  useV1EducationArticlesCreateMutation,
  useV1EducationArticlesRetrieveQuery,
  useV1EducationArticlesUpdateMutation,
  useV1EducationArticlesPartialUpdateMutation,
  useV1EducationArticlesDestroyMutation,
  useV1EducationArticlesUploadImageCreateMutation,
  useV1EducationArticlesUploadMediaCreateMutation,
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
  useV1EducationCoursesStepsLessonsTasksListQuery,
  useV1EducationCoursesStepsLessonsTasksCreateMutation,
  useV1EducationCoursesStepsLessonsTasksRetrieveQuery,
  useV1EducationCoursesStepsLessonsTasksUpdateMutation,
  useV1EducationCoursesStepsLessonsTasksPartialUpdateMutation,
  useV1EducationCoursesStepsLessonsTasksDestroyMutation,
  useV1EducationCoursesStepsLessonsRetrieveQuery,
  useV1EducationCoursesStepsLessonsUpdateMutation,
  useV1EducationCoursesStepsLessonsPartialUpdateMutation,
  useV1EducationCoursesStepsLessonsDestroyMutation,
  useV1EducationCoursesRetrieveQuery,
  useV1EducationCoursesUpdateMutation,
  useV1EducationCoursesPartialUpdateMutation,
  useV1EducationCoursesDestroyMutation,
  useV1EducationCoursesUploadImageCreateMutation,
  useV1EducationTagsListQuery,
  useV1EducationTagsCreateMutation,
  useV1EducationTaskAttemptsListQuery,
  useV1EducationTaskAttemptsCreateMutation,
  useV1EducationTaskAttemptsResetDestroyMutation,
} = injectedRtkApi;
