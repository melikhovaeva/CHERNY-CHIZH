import { baseApi as api } from "../base-api";
export const addTagTypes = ["Courses"] as const;
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
export const { useV1CoursesListQuery, useV1CoursesRetrieveQuery } =
  injectedRtkApi;
