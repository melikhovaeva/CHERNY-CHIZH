import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  selectInfoSettingsActiveSection,
  setActiveSection,
  type InfoSettingsSection,
} from '@/features/info-settings';
import { useEffect } from 'react';
import { InfoSettingsLeftBar } from '../InfoSettingsLeftBar';
import styles from './InfoSettingsTemplate.module.scss';

export interface InfoSettingsTemplateProps {
  children: React.ReactNode;
  availableSections?: InfoSettingsSection[];
}

export const InfoSettingsTemplate = ({
  children,
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
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        availableSections={availableSections}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
