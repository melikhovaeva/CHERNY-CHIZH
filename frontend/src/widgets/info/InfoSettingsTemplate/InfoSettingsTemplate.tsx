import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  selectInfoSettingsActiveSection,
  setActiveSection,
  type InfoSettingsSection,
} from '@/features/info-settings';
import type { EntityType } from '@/shared/ui';
import { InfoSettingsLeftBar } from '../InfoSettingsLeftBar';
import styles from './InfoSettingsTemplate.module.scss';

export interface InfoSettingsTemplateProps {
  children: React.ReactNode;
  backUrl: string;
  title: string;
  entityType: EntityType;
}

export const InfoSettingsTemplate = ({
  children,
  backUrl,
  title,
  entityType,
}: InfoSettingsTemplateProps) => {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector(selectInfoSettingsActiveSection);

  const handleSectionChange = (section: InfoSettingsSection) => {
    dispatch(setActiveSection(section));
  };

  return (
    <div className={styles.root}>
      <InfoSettingsLeftBar
        backUrl={backUrl}
        title={title}
        entityType={entityType}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
