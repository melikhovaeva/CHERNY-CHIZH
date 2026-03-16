import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  selectInfoSettingsActiveSection,
  setActiveSection,
  type InfoSettingsSection,
} from '@/features/info-settings';
import type { EntityType } from '@/shared/ui';
import { InfoSettingsLeftBar } from '../InfoSettingsLeftBar';
import styles from './InfoSettingsTemplate.module.scss';
import { useEffect } from 'react';

export interface InfoSettingsTemplateProps {
  children: React.ReactNode;
  backUrl: string;
  title: string;
  entityType: EntityType;
  availableSections?: InfoSettingsSection[];
}

export const InfoSettingsTemplate = ({
  children,
  backUrl,
  title,
  entityType,
  availableSections,
}: InfoSettingsTemplateProps) => {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector(selectInfoSettingsActiveSection);

  useEffect(() => {
    if (
      availableSections &&
      availableSections.length > 0 &&
      !availableSections.includes(activeSection)
    ) {
      dispatch(setActiveSection(availableSections[0]));
    }
  }, [activeSection, availableSections, dispatch]);

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
        availableSections={availableSections}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
