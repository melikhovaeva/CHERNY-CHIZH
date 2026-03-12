import { CourseCreateEditForm } from '@/entities/course';
import { InfoSettingsTemplate } from '@/widgets';

export const CourseCreateEditPage = () => {
  // TODO: Fetch data (if course exists) fill form with data, and control infoTemplate data (left pane active tab, left pane text, )
  return (
    <InfoSettingsTemplate>
      <CourseCreateEditForm />
    </InfoSettingsTemplate>
  );
};
