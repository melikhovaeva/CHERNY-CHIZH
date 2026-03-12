import { CourseCreateEditForm } from '@/entities/course';
import { InfoSettingsTemplate } from '@/widgets';
import type { Course } from '@/shared/api/generated/courses.generated';

export const CourseCreateEditPage = () => {
  // TODO: Fetch data (if course exists) fill form with data, and control infoTemplate data (left pane active tab, left pane text, )

  const handleSubmit = (values: Course) => {
    // TODO: вызвать API создания/редактирования курса и показать toast об успехе
    void values;
  };

  return (
    <InfoSettingsTemplate>
      <CourseCreateEditForm onSubmit={handleSubmit} />
    </InfoSettingsTemplate>
  );
};
