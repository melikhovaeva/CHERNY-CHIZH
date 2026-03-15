import { CourseCreateEditForm } from '@/entities/course';
import type { Course } from '@/shared/api/generated/courses.generated';
import { InfoSettingsTemplate } from '@/widgets';

export const CourseCreateEditPage = () => {
  // TODO: Fetch data (if course exists) fill form with data, and control infoTemplate data (left pane active tab, left pane text, )

  const handleSubmit = (values: Course) => {
    // TODO: вызвать API создания/редактирования курса и показать toast об успехе
    void values;
  };

  return (
    <InfoSettingsTemplate
      backUrl="/cabinet/courses"
      title=""
      entityType="course"
      activeSection="info"
    >
      <CourseCreateEditForm onSubmit={handleSubmit} />
    </InfoSettingsTemplate>
  );
};
