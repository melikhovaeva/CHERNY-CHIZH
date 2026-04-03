import { useAppSelector } from '@/app/store';
import {
  CourseCreateEditForm,
  useCreateCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useUploadCourseImageMutation,
  type CourseFormData,
} from '@/entities/course';
import { usePatchCourseStatusMutation } from '@/entities/course/api/courseStatus.api';
import { selectInfoSettingsActiveSection } from '@/features/info-settings';
import { INFO_SETTINGS_SECTION } from '@/features/info-settings/model/types';
import { Tabs, type Tab } from '@/features/tabs-filter';
import type {
  CourseCreateUpdate,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';
import { getInfoDisplayTitle, INFO_TYPE } from '@/shared/config/info';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import {
  CourseConstructorTemplate,
  CoursePreviewTemplate,
  InfoActionsSection,
  InfoSettingsTemplate,
} from '@/widgets';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import styles from './CourseCreateEditPage.module.scss';

const COURSE_PAGE_TAB = {
  PREVIEW: 'preview',
  CONSTRUCTOR: 'constructor',
  SETTINGS: 'settings',
} as const;

const COURSE_CABINET_LIST_PATH = '/cabinet/courses' as const;

const WORKSPACE_TITLE_MAX_LENGTH = 16;

type CoursePageTab = (typeof COURSE_PAGE_TAB)[keyof typeof COURSE_PAGE_TAB];

function toCreateUpdatePayload(values: CourseFormData): CourseCreateUpdate {
  return {
    title: values.title,
    description: values.description,
    actionText: values.actionText,
    difficulty: values.difficulty ?? undefined,
    tags: values.tags?.map((t: InfoTagRead) => t.id) ?? [],
  };
}

export const CourseCreateEditPage = () => {
  const activeSettingsSection = useAppSelector(selectInfoSettingsActiveSection);
  const { courseSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const showSuccess = useSuccess();
  const showError = useError();

  const isEdit = Boolean(courseSlug);

  const [activeTab, setActiveTab] = useState<CoursePageTab>(
    COURSE_PAGE_TAB.SETTINGS,
  );

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'preview',
        label: 'Предпросмотр',
        value: COURSE_PAGE_TAB.PREVIEW,
        disabled: !isEdit,
      },
      {
        id: 'constructor',
        label: 'Конструктор',
        value: COURSE_PAGE_TAB.CONSTRUCTOR,
        disabled: !isEdit,
      },
      {
        id: 'settings',
        label: 'Настройки',
        value: COURSE_PAGE_TAB.SETTINGS,
      },
    ],
    [isEdit],
  );

  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery(
    undefined,
    {
      skip: !isEdit,
    },
  );

  const course = courses?.find((c) => c.slug === courseSlug) ?? null;
  const courseId = course?.id ?? null;

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [uploadCourseImage] = useUploadCourseImageMutation();
  const [patchCourseStatus] = usePatchCourseStatusMutation();

  const handleSubmit = async (values: CourseFormData) => {
    const payload = toCreateUpdatePayload(values);

    try {
      let targetCourseId: number;
      let targetCourseSlug: string | null = null;

      if (isEdit && courseId) {
        await updateCourse({
          id: courseId,
          courseCreateUpdate: payload,
        }).unwrap();
        targetCourseId = courseId;
        targetCourseSlug = courseSlug ?? null;
        showSuccess('Курс обновлён');
      } else {
        const created = await createCourse({
          courseCreateUpdate: payload,
        }).unwrap();
        targetCourseId = created.id;
        targetCourseSlug = created.slug;
        showSuccess('Курс создан');
      }

      if (values.imageFile) {
        try {
          await uploadCourseImage({
            id: targetCourseId,
            file: values.imageFile,
          }).unwrap();
        } catch {
          showError('Не удалось загрузить изображение курса');
        }
      }

      if (!isEdit && targetCourseSlug) {
        navigate({
          to: '/cabinet/courses/$courseSlug',
          params: { courseSlug: targetCourseSlug },
        });
      }
    } catch {
      showError(
        isEdit ? 'Не удалось обновить курс' : 'Не удалось создать курс',
      );
    }
  };

  const renderSettingsSection = (): React.ReactNode => {
    if (activeSettingsSection === INFO_SETTINGS_SECTION.INFO) {
      return (
        <CourseCreateEditForm
          data={course ?? undefined}
          onSubmit={handleSubmit}
        />
      );
    }
    if (activeSettingsSection === INFO_SETTINGS_SECTION.ACTIONS) {
      if (!course || !courseId) return null;

      const handlePublishToggle = async (
        nextStatus: 'published' | 'unpublished',
      ) => {
        try {
          await patchCourseStatus({
            id: courseId,
            status: nextStatus,
          }).unwrap();
          showSuccess(
            nextStatus === 'published'
              ? 'Курс опубликован'
              : 'Курс снят с публикации',
          );
        } catch {
          showError('Не удалось изменить статус курса');
        }
      };

      return (
        <InfoActionsSection
          infoType={INFO_TYPE.COURSE}
          initialStatus={
            course.status?.code === 'published' ? 'published' : 'unpublished'
          }
          onPublish={handlePublishToggle}
        />
      );
    }
    return null;
  };

  if (isEdit && isCoursesLoading && !course) {
    return null;
  }

  const infoTitle = isEdit ? (course?.title ?? 'Курс') : 'Создание курса';
  const displayTitle = getInfoDisplayTitle(infoTitle, 'course');
  const isTitleTruncated = displayTitle.length > WORKSPACE_TITLE_MAX_LENGTH;
  const truncatedWorkspaceTitle = isTitleTruncated
    ? `${displayTitle.slice(0, WORKSPACE_TITLE_MAX_LENGTH).trimEnd()}`
    : displayTitle;

  const renderActiveTab = () => {
    switch (activeTab) {
      case COURSE_PAGE_TAB.CONSTRUCTOR:
        return <CourseConstructorTemplate courseId={courseId} />;
      case COURSE_PAGE_TAB.PREVIEW:
        return <CoursePreviewTemplate />;
      case COURSE_PAGE_TAB.SETTINGS:
      default:
        return (
          <InfoSettingsTemplate
            availableSections={
              isEdit ? undefined : [INFO_SETTINGS_SECTION.INFO]
            }
          >
            {renderSettingsSection()}
          </InfoSettingsTemplate>
        );
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.workspaceHeader}>
        <Link
          to={COURSE_CABINET_LIST_PATH}
          className={styles.backNav}
          aria-label="Назад"
        >
          <ArrowLeftIcon className={styles.backNavIcon} aria-hidden />
          <span className={styles.backNavLabel}>Назад</span>
        </Link>
        <h2
          className={cn([styles.workspaceTitle], {
            [styles.workspaceTitleTruncated]: isTitleTruncated,
          })}
          title={displayTitle}
        >
          {truncatedWorkspaceTitle}
        </h2>
      </header>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value as CoursePageTab)}
        variant="secondary"
        className={styles.tabs}
      />
      <div className={styles.content}>{renderActiveTab()}</div>
    </div>
  );
};
