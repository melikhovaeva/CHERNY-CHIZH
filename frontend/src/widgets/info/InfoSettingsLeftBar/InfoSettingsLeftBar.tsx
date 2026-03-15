import type { InfoSettingsSection } from '@/features';
import { INFO_SETTINGS_SECTION_LABELS } from '@/features/info-settings';
import { cn } from '@/shared/lib/utils';
import { LeftBar, type EntityType } from '@/shared/ui';
import styles from './InfoSettingsLeftBar.module.scss';

export interface InfoSettingsLeftBarProps {
  backUrl: string;
  title: string;
  entityType: EntityType;
  activeSection?: InfoSettingsSection;
  onSectionChange?: (section: InfoSettingsSection) => void;
}

export const InfoSettingsLeftBar = ({
  backUrl,
  title,
  entityType,
  activeSection,
  onSectionChange,
}: InfoSettingsLeftBarProps) => {
  const sections = Object.entries(INFO_SETTINGS_SECTION_LABELS).map(
    ([id, label]) => ({
      id: id as InfoSettingsSection,
      label,
    }),
  );
  return (
    <LeftBar backUrl={backUrl} title={title} entityType={entityType}>
      <nav className={styles.menu} aria-label="Настройки">
        {sections.map(({ id, label }) => {
          return (
            <button
              key={id}
              type="button"
              className={cn([styles.menuItem], {
                [styles.menuItemActive]: activeSection === id,
              })}
              onClick={() => onSectionChange?.(id)}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </LeftBar>
  );
};
