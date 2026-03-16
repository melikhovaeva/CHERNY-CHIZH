import {
  useCreateCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useUploadCourseImageMutation,
} from '@/entities/course';
import { usePatchCourseStatusMutation } from '@/entities/course/api/courseStatus.api';
import { useAppSelector } from '@/app/store';
import { selectInfoSettingsActiveSection } from '@/features/info-settings';
import { INFO_SETTINGS_SECTION } from '@/features/info-settings/model/types';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import type {
  CourseCreateUpdate,
  InfoTagRead,
} from '@/shared/api/generated/courses.generated';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  CourseCreateEditForm,
  type CourseFormData,
} from '@/entities/course';
import { CourseActionsSection, InfoSettingsTemplate } from '@/widgets';

function toCreateUpdatePayload(values: CourseFormData): CourseCreateUpdate {
  return {
    title: values.title,
    description: values.description,
    actionText: values.actionText,
    imagePreview: null,
    difficulty: values.difficulty ?? undefined,
    tags: values.tags?.map((t: InfoTagRead) => t.id) ?? [],
  };
}

export const CourseCreateEditPage = () => {
  const activeSettingsSection = useAppSelector(selectInfoSettingsActiveSection);
  const { courseId } = useParams({ strict: false });
  const navigate = useNavigate();
  const showSuccess = useSuccess();
  const showError = useError();

  const isEdit = Boolean(courseId);
  const courseIdNum = courseId ? Number(courseId) : null;

  const { data: course, isLoading: isCourseLoading } = useGetCourseQuery(
    { id: courseIdNum! },
    { skip: !courseIdNum },
  );

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [uploadCourseImage] = useUploadCourseImageMutation();
  const [patchCourseStatus] = usePatchCourseStatusMutation();

  const handleSubmit = async (values: CourseFormData) => {
    const payload = toCreateUpdatePayload(values);

    try {
      let courseId: number;
      if (isEdit && courseIdNum) {
        await updateCourse({
          id: courseIdNum,
          courseCreateUpdate: payload,
        }).unwrap();
        courseId = courseIdNum;
        showSuccess('Курс обновлён');
      } else {
        const created = await createCourse({
          courseCreateUpdate: payload,
        }).unwrap();
        courseId = created.id;
        showSuccess('Курс создан');
      }

      if (values.imageFile) {
        try {
          await uploadCourseImage({ id: courseId, file: values.imageFile }).unwrap();
        } catch {
          showError('Не удалось загрузить изображение курса');
        }
      }

      if (!isEdit) {
        navigate({ to: '/cabinet/courses/$courseId/edit', params: { courseId: String(courseId) } });
      } else {
        navigate({ to: '/cabinet/courses' });
      }
    } catch {
      showError(isEdit ? 'Не удалось обновить курс' : 'Не удалось создать курс');
    }
  };

  const renderSettingsSection = (): React.ReactNode => {
    if (activeSettingsSection === INFO_SETTINGS_SECTION.INFO) {
      return (
        <CourseCreateEditForm
          data={course}
          onSubmit={handleSubmit}
        />
      );
    }
    if (activeSettingsSection === INFO_SETTINGS_SECTION.ACTIONS) {
      if (!course || !courseIdNum) return null;

      const handlePublishToggle = async (
        nextStatus: 'published' | 'unpublished',
      ) => {
        try {
          await patchCourseStatus({
            id: courseIdNum,
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
        <CourseActionsSection
          initialStatus={
            course.status?.code === 'published' ? 'published' : 'unpublished'
          }
          onPublish={handlePublishToggle}
        />
      );
    }
    return null;
  };

  if (isEdit && courseIdNum && isCourseLoading) {
    return null;
  }

  return (
    <InfoSettingsTemplate
      backUrl="/cabinet/courses"
      title=""
      entityType="course"
    >
      {renderSettingsSection()}
    </InfoSettingsTemplate>
  );
};
