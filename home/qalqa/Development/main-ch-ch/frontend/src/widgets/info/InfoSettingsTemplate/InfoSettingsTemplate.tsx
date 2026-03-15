import type { EntityType } from '@/shared/ui';
import { InfoSettingsLeftBar, type InfoSettingsSection } from '@/widgets/info/InfoSettingsLeftBar';
import styles from './InfoSettingsTemplate.module.scss';

export interface InfoSettingsTemplateProps {
  children: React.ReactNode;
  backUrl: string;
  title: string;
  entityType: EntityType;
  activeSection?: InfoSettingsSection;
  onSectionChange?: (section: InfoSettingsSection) => void;
}

export const InfoSettingsTemplate = ({
  children,
  backUrl,
  title,
  entityType,
  activeSection,
  onSectionChange,
}: InfoSettingsTemplateProps) => {
  return (
    <div className={styles.root}>
      <InfoSettingsLeftBar
        backUrl={backUrl}
        title={title}
        entityType={entityType}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
