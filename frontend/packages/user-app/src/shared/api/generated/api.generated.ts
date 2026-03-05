import { baseApi as api } from "../base-api";
export const addTagTypes = [
  "Articles",
  "Breeds",
  "Dogs",
  "Courses",
  "Dictionaries",
  "FAQ",
  "Requests",
  "Users",
  "Auth",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      v1ArticlesList: build.query<
        V1ArticlesListApiResponse,
        V1ArticlesListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/articles/`,
          params: {
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Articles"],
      }),
      v1ArticlesRetrieve: build.query<
        V1ArticlesRetrieveApiResponse,
        V1ArticlesRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/articles/${queryArg.slug}/` }),
        providesTags: ["Articles"],
      }),
      v1ArticlesHomeLibraryRetrieve: build.query<
        V1ArticlesHomeLibraryRetrieveApiResponse,
        V1ArticlesHomeLibraryRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/articles/home-library/` }),
        providesTags: ["Articles"],
      }),
      v1BreedsList: build.query<V1BreedsListApiResponse, V1BreedsListApiArg>({
        query: () => ({ url: `/api/v1/breeds/` }),
        providesTags: ["Breeds"],
      }),
      v1BreedsDogsList: build.query<
        V1BreedsDogsListApiResponse,
        V1BreedsDogsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/breeds/${queryArg.breedSlug}/dogs/`,
          params: {
            age_group: queryArg.ageGroup,
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Dogs"],
      }),
      v1BreedsDogsRetrieve: build.query<
        V1BreedsDogsRetrieveApiResponse,
        V1BreedsDogsRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/breeds/${queryArg.breedSlug}/dogs/${queryArg.id}/`,
        }),
        providesTags: ["Dogs"],
      }),
      v1BreedsRetrieve: build.query<
        V1BreedsRetrieveApiResponse,
        V1BreedsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/breeds/${queryArg.id}/` }),
        providesTags: ["Breeds"],
      }),
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
      v1DictionariesRetrieve: build.query<
        V1DictionariesRetrieveApiResponse,
        V1DictionariesRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/dictionaries/` }),
        providesTags: ["Dictionaries"],
      }),
      v1DictionariesRetrieve2: build.query<
        V1DictionariesRetrieve2ApiResponse,
        V1DictionariesRetrieve2ApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/dictionaries/${queryArg.id}/` }),
        providesTags: ["Dictionaries"],
      }),
      v1DictionariesRetrieve3: build.query<
        V1DictionariesRetrieve3ApiResponse,
        V1DictionariesRetrieve3ApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/dictionaries/${queryArg.id}/${queryArg.dictIdentifier}/`,
        }),
        providesTags: ["Dictionaries"],
      }),
      v1DogsList: build.query<V1DogsListApiResponse, V1DogsListApiArg>({
        query: (queryArg) => ({
          url: `/api/v1/dogs/`,
          params: {
            age_group: queryArg.ageGroup,
            limit: queryArg.limit,
            offset: queryArg.offset,
          },
        }),
        providesTags: ["Dogs"],
      }),
      v1DogsRetrieve: build.query<
        V1DogsRetrieveApiResponse,
        V1DogsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/dogs/${queryArg.id}/` }),
        providesTags: ["Dogs"],
      }),
      v1FaqList: build.query<V1FaqListApiResponse, V1FaqListApiArg>({
        query: (queryArg) => ({
          url: `/api/v1/faq/`,
          params: {
            category: queryArg.category,
          },
        }),
        providesTags: ["FAQ"],
      }),
      v1FaqRetrieve: build.query<V1FaqRetrieveApiResponse, V1FaqRetrieveApiArg>(
        {
          query: (queryArg) => ({ url: `/api/v1/faq/${queryArg.id}/` }),
          providesTags: ["FAQ"],
        },
      ),
      v1RequestsList: build.query<
        V1RequestsListApiResponse,
        V1RequestsListApiArg
      >({
        query: () => ({ url: `/api/v1/requests/` }),
        providesTags: ["Requests"],
      }),
      v1RequestsCreate: build.mutation<
        V1RequestsCreateApiResponse,
        V1RequestsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/requests/`,
          method: "POST",
          body: queryArg.request,
        }),
        invalidatesTags: ["Requests"],
      }),
      v1RequestsRetrieve: build.query<
        V1RequestsRetrieveApiResponse,
        V1RequestsRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/requests/${queryArg.id}/` }),
        providesTags: ["Requests"],
      }),
      v1UsersAdminUsersList: build.query<
        V1UsersAdminUsersListApiResponse,
        V1UsersAdminUsersListApiArg
      >({
        query: () => ({ url: `/api/v1/users/admin/users/` }),
        providesTags: ["Users"],
      }),
      v1UsersAdminUsersRetrieve: build.query<
        V1UsersAdminUsersRetrieveApiResponse,
        V1UsersAdminUsersRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/admin/users/${queryArg.id}/`,
        }),
        providesTags: ["Users"],
      }),
      v1UsersAdminUsersPartialUpdate: build.mutation<
        V1UsersAdminUsersPartialUpdateApiResponse,
        V1UsersAdminUsersPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/admin/users/${queryArg.id}/`,
          method: "PATCH",
          body: queryArg.patchedUserRoleUpdate,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersAuthLoginCreate: build.mutation<
        V1UsersAuthLoginCreateApiResponse,
        V1UsersAuthLoginCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/auth/login/`,
          method: "POST",
          body: queryArg.tokenObtainPair,
        }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersAuthLogoutCreate: build.mutation<
        V1UsersAuthLogoutCreateApiResponse,
        V1UsersAuthLogoutCreateApiArg
      >({
        query: () => ({ url: `/api/v1/users/auth/logout/`, method: "POST" }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersAuthRefreshCreate: build.mutation<
        V1UsersAuthRefreshCreateApiResponse,
        V1UsersAuthRefreshCreateApiArg
      >({
        query: () => ({ url: `/api/v1/users/auth/refresh/`, method: "POST" }),
        invalidatesTags: ["Auth"],
      }),
      v1UsersMeRetrieve: build.query<
        V1UsersMeRetrieveApiResponse,
        V1UsersMeRetrieveApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/` }),
        providesTags: ["Users"],
      }),
      v1UsersMeUpdate: build.mutation<
        V1UsersMeUpdateApiResponse,
        V1UsersMeUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/`,
          method: "PUT",
          body: queryArg.currentUser,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMePartialUpdate: build.mutation<
        V1UsersMePartialUpdateApiResponse,
        V1UsersMePartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/`,
          method: "PATCH",
          body: queryArg.patchedCurrentUser,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeDestroy: build.mutation<
        V1UsersMeDestroyApiResponse,
        V1UsersMeDestroyApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/`, method: "DELETE" }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeChangePasswordCreate: build.mutation<
        V1UsersMeChangePasswordCreateApiResponse,
        V1UsersMeChangePasswordCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/me/change-password/`,
          method: "POST",
          body: queryArg.changePassword,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersMeCoursesList: build.query<
        V1UsersMeCoursesListApiResponse,
        V1UsersMeCoursesListApiArg
      >({
        query: () => ({ url: `/api/v1/users/me/courses/` }),
        providesTags: ["Users"],
      }),
      v1UsersRegisterStep1Create: build.mutation<
        V1UsersRegisterStep1CreateApiResponse,
        V1UsersRegisterStep1CreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/register/step1/`,
          method: "POST",
          body: queryArg.registerStep1,
        }),
        invalidatesTags: ["Users"],
      }),
      v1UsersRegisterStep2Create: build.mutation<
        V1UsersRegisterStep2CreateApiResponse,
        V1UsersRegisterStep2CreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/users/register/step2/`,
          method: "POST",
          body: queryArg.registerStep2,
        }),
        invalidatesTags: ["Users"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as generatedApi };
export type V1ArticlesListApiResponse =
  /** status 200  */ PaginatedArticleListListRead;
export type V1ArticlesListApiArg = {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1ArticlesRetrieveApiResponse = /** status 200  */ ArticleRead;
export type V1ArticlesRetrieveApiArg = {
  slug: string;
};
export type V1ArticlesHomeLibraryRetrieveApiResponse =
  /** status 200  */ ArticleRead;
export type V1ArticlesHomeLibraryRetrieveApiArg = void;
export type V1BreedsListApiResponse = /** status 200  */ BreedListRead[];
export type V1BreedsListApiArg = void;
export type V1BreedsDogsListApiResponse =
  /** status 200  */ PaginatedDogByBreedListListRead;
export type V1BreedsDogsListApiArg = {
  /** Возрастная группа собаки. Допустимые значения: `${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые). */
  ageGroup?: string;
  /** Slug породы (например, `shpits`). */
  breedSlug: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1BreedsDogsRetrieveApiResponse =
  /** status 200  */ DogByBreedListRead;
export type V1BreedsDogsRetrieveApiArg = {
  breedSlug: string;
  id: string;
};
export type V1BreedsRetrieveApiResponse = /** status 200  */ BreedListRead;
export type V1BreedsRetrieveApiArg = {
  /** A unique integer value identifying this Порода. */
  id: number;
};
export type V1CoursesListApiResponse = /** status 200  */ CourseRead[];
export type V1CoursesListApiArg = void;
export type V1CoursesRetrieveApiResponse = /** status 200  */ CourseDetailRead;
export type V1CoursesRetrieveApiArg = {
  /** A unique integer value identifying this course. */
  id: number;
};
export type V1DictionariesRetrieveApiResponse = unknown;
export type V1DictionariesRetrieveApiArg = void;
export type V1DictionariesRetrieve2ApiResponse = unknown;
export type V1DictionariesRetrieve2ApiArg = {
  id: string;
  /** Идентификатор группы: числовой ID или строковый ключ группы (например, `dogs_filters`). */
  pk: string;
};
export type V1DictionariesRetrieve3ApiResponse = unknown;
export type V1DictionariesRetrieve3ApiArg = {
  /** Идентификатор конкретного словаря внутри группы (ID или ключ). */
  dictIdentifier: string;
  id: string;
  /** Идентификатор группы словарей (ID или ключ). */
  pk: string;
};
export type V1DogsListApiResponse = /** status 200  */ PaginatedDogListListRead;
export type V1DogsListApiArg = {
  /** Возрастная группа собаки. Допустимые значения: `${Dog.AGE_GROUP_PUPPY}` (щенки) или `${Dog.AGE_GROUP_ADULT}` (взрослые). */
  ageGroup?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
};
export type V1DogsRetrieveApiResponse = /** status 200  */ DogListRead;
export type V1DogsRetrieveApiArg = {
  /** A unique integer value identifying this Собака. */
  id: number;
};
export type V1FaqListApiResponse = /** status 200  */ FaqItemRead[];
export type V1FaqListApiArg = {
  /** Категория FAQ (если указана, вернутся только элементы этой категории). */
  category?: string;
};
export type V1FaqRetrieveApiResponse = /** status 200  */ FaqItemRead;
export type V1FaqRetrieveApiArg = {
  /** A unique integer value identifying this FAQ элемент. */
  id: number;
};
export type V1RequestsListApiResponse = /** status 200  */ RequestRead[];
export type V1RequestsListApiArg = void;
export type V1RequestsCreateApiResponse = /** status 201  */ RequestRead;
export type V1RequestsCreateApiArg = {
  request: Request;
};
export type V1RequestsRetrieveApiResponse = /** status 200  */ RequestRead;
export type V1RequestsRetrieveApiArg = {
  id: string;
};
export type V1UsersAdminUsersListApiResponse = /** status 200  */ UserRead[];
export type V1UsersAdminUsersListApiArg = void;
export type V1UsersAdminUsersRetrieveApiResponse = /** status 200  */ UserRead;
export type V1UsersAdminUsersRetrieveApiArg = {
  id: number;
};
export type V1UsersAdminUsersPartialUpdateApiResponse =
  /** status 200  */ UserRead;
export type V1UsersAdminUsersPartialUpdateApiArg = {
  id: number;
  patchedUserRoleUpdate: PatchedUserRoleUpdate;
};
export type V1UsersAuthLoginCreateApiResponse =
  /** status 200  */ CurrentUserRead;
export type V1UsersAuthLoginCreateApiArg = {
  tokenObtainPair: TokenObtainPairWrite;
};
export type V1UsersAuthLogoutCreateApiResponse = unknown;
export type V1UsersAuthLogoutCreateApiArg = void;
export type V1UsersAuthRefreshCreateApiResponse = unknown;
export type V1UsersAuthRefreshCreateApiArg = void;
export type V1UsersMeRetrieveApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeRetrieveApiArg = void;
export type V1UsersMeUpdateApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeUpdateApiArg = {
  currentUser: CurrentUser;
};
export type V1UsersMePartialUpdateApiResponse =
  /** status 200  */ CurrentUserRead;
export type V1UsersMePartialUpdateApiArg = {
  patchedCurrentUser: PatchedCurrentUser;
};
export type V1UsersMeDestroyApiResponse = /** status 200  */ CurrentUserRead;
export type V1UsersMeDestroyApiArg = void;
export type V1UsersMeChangePasswordCreateApiResponse = unknown;
export type V1UsersMeChangePasswordCreateApiArg = {
  changePassword: ChangePasswordWrite;
};
export type V1UsersMeCoursesListApiResponse =
  /** status 200  */ CourseEnrollmentRead[];
export type V1UsersMeCoursesListApiArg = void;
export type V1UsersRegisterStep1CreateApiResponse = /** status 200  */ {
  [key: string]: any;
};
export type V1UsersRegisterStep1CreateApiArg = {
  registerStep1: RegisterStep1Write;
};
export type V1UsersRegisterStep2CreateApiResponse =
  /** status 201  */ CurrentUserRead;
export type V1UsersRegisterStep2CreateApiArg = {
  registerStep2: RegisterStep2Write;
};
export type ArticleList = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
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
export type ArticleListRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  tags: InfoTagRead[];
  createdAt: string;
  author: {
    [key: string]: any;
  };
};
export type PaginatedArticleListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleList[];
};
export type PaginatedArticleListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleListRead[];
};
export type Article = {
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
};
export type ArticleRead = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview?: string | null;
  status: string;
  tags: InfoTagRead[];
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
};
export type BreedList = {
  name: string;
  fullName: string;
};
export type RatingBlock = {
  rating: number;
  text: string;
};
export type BreedDescription = {
  appearance: string;
  character: RatingBlock;
  adaptability: RatingBlock;
  care: RatingBlock;
  activity: RatingBlock;
};
export type BreedListRead = {
  id: number;
  slug: string;
  name: string;
  fullName: string;
  photo: string;
  description: BreedDescription;
  articleSlug: string;
};
export type AgeGroupEnum = "puppy" | "adult";
export type DogByBreedList = {
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
  ageGroup?: AgeGroupEnum;
};
export type BreedBrief = {
  name: string;
  fullName: string;
};
export type BreedBriefRead = {
  slug: string;
  name: string;
  fullName: string;
  photo: string;
};
export type DogPhotos = {
  url: string;
};
export type DogPhotosRead = {
  id: number;
  url: string;
};
export type DogDocuments = {
  name: string;
};
export type DogDocumentsRead = {
  id: number;
  name: string;
};
export type DogByBreedListRead = {
  id: number;
  breed: BreedBriefRead;
  status: string;
  sex: string;
  potential: string;
  photos: DogPhotosRead[];
  documents: DogDocumentsRead[];
  createdAt: string;
  updatedAt: string;
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
  ageGroup?: AgeGroupEnum;
};
export type PaginatedDogByBreedListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogByBreedList[];
};
export type PaginatedDogByBreedListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogByBreedListRead[];
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
  status: string;
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
  status: string;
  tags: InfoTagRead[];
  createdAt: string;
  updatedAt: string;
  steps: CourseStepRead[];
};
export type DogList = {
  name: string;
  birthDate: string;
  color: string;
  description?: string | null;
};
export type DogListRead = {
  id: number;
  name: string;
  internationalName: string;
  birthDate: string;
  color: string;
  description?: string | null;
  breed: BreedBriefRead;
  status: string;
  sex: string;
  potential: string;
  photos: DogPhotosRead[];
  documents: DogDocumentsRead[];
  parents: string;
};
export type PaginatedDogListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogList[];
};
export type PaginatedDogListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: DogListRead[];
};
export type CategoryEnum = "general" | "delivery";
export type FaqItem = {
  title: string;
  content: string;
  category?: CategoryEnum;
};
export type FaqItemRead = {
  id: number;
  title: string;
  content: string;
  category?: CategoryEnum;
};
export type Request = {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
};
export type RequestRead = {
  id: number;
  user: number | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  messenger: string;
  message: string;
  dog?: number | null;
};
export type User = {
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
};
export type Role = {};
export type RoleRead = {
  code: string;
  label: string;
};
export type UserRead = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
  role: RoleRead | null;
  dateJoined: string;
  isActive: boolean;
};
export type PatchedUserRoleUpdate = {
  role?: number | null;
};
export type CurrentUser = {
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
};
export type CurrentUserRead = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
  role: RoleRead | null;
};
export type TokenObtainPair = {};
export type TokenObtainPairRead = {
  access: string;
  refresh: string;
};
export type TokenObtainPairWrite = {
  email: string;
  password: string;
};
export type PatchedCurrentUser = {
  email?: string;
  firstName?: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
};
export type PatchedCurrentUserRead = {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string | null;
  phone?: string | null;
  messenger?: string | null;
  avatarImage?: string | null;
  role?: RoleRead | null;
};
export type ChangePassword = {};
export type ChangePasswordWrite = {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
};
export type StatusEnum = "enrolled" | "completed" | "cancelled";
export type CourseEnrollment = {
  status?: StatusEnum;
  /** Прогресс прохождения курса в процентах */
  progress?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
};
export type CourseEnrollmentRead = {
  id: number;
  course: CourseRead;
  status?: StatusEnum;
  /** Прогресс прохождения курса в процентах */
  progress?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
};
export type RegisterStep1 = {
  email: string;
};
export type RegisterStep1Write = {
  email: string;
  password: string;
  password2: string;
};
export type RegisterStep2 = {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  messenger?: string;
};
export type RegisterStep2Write = {
  email: string;
  password: string;
  password2: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  messenger?: string;
};
export const {
  useV1ArticlesListQuery,
  useV1ArticlesRetrieveQuery,
  useV1ArticlesHomeLibraryRetrieveQuery,
  useV1BreedsListQuery,
  useV1BreedsDogsListQuery,
  useV1BreedsDogsRetrieveQuery,
  useV1BreedsRetrieveQuery,
  useV1CoursesListQuery,
  useV1CoursesRetrieveQuery,
  useV1DictionariesRetrieveQuery,
  useV1DictionariesRetrieve2Query,
  useV1DictionariesRetrieve3Query,
  useV1DogsListQuery,
  useV1DogsRetrieveQuery,
  useV1FaqListQuery,
  useV1FaqRetrieveQuery,
  useV1RequestsListQuery,
  useV1RequestsCreateMutation,
  useV1RequestsRetrieveQuery,
  useV1UsersAdminUsersListQuery,
  useV1UsersAdminUsersRetrieveQuery,
  useV1UsersAdminUsersPartialUpdateMutation,
  useV1UsersAuthLoginCreateMutation,
  useV1UsersAuthLogoutCreateMutation,
  useV1UsersAuthRefreshCreateMutation,
  useV1UsersMeRetrieveQuery,
  useV1UsersMeUpdateMutation,
  useV1UsersMePartialUpdateMutation,
  useV1UsersMeDestroyMutation,
  useV1UsersMeChangePasswordCreateMutation,
  useV1UsersMeCoursesListQuery,
  useV1UsersRegisterStep1CreateMutation,
  useV1UsersRegisterStep2CreateMutation,
} = injectedRtkApi;
