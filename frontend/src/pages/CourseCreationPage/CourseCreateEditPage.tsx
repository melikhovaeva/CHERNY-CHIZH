import { useAppSelector } from '@/app/store';
import { CourseCreateEditForm } from '@/entities/course';
import { selectInfoSettingsActiveSection } from '@/features/info-settings';
import { INFO_SETTINGS_SECTION } from '@/features/info-settings/model/types';
import type { Course } from '@/shared/api/generated/courses.generated';
import { CourseActionsSection, InfoSettingsTemplate } from '@/widgets';

export const CourseCreateEditPage = () => {
  const activeSettingsSection = useAppSelector(selectInfoSettingsActiveSection);

  const handleSubmit = (values: Course) => {
    // TODO: вызвать API создания/редактирования курса и показать toast об успехе
    void values;
  };

  const renderSettingsSection = (): React.ReactNode => {
    if (activeSettingsSection === INFO_SETTINGS_SECTION.INFO) {
      return <CourseCreateEditForm onSubmit={handleSubmit} />;
    }
    if (activeSettingsSection === INFO_SETTINGS_SECTION.ACTIONS) {
      return <CourseActionsSection />;
    }
    return null;
  };

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
