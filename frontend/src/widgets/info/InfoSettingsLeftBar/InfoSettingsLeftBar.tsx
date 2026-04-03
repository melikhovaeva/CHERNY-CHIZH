import type { InfoSettingsSection } from '@/features';
import { INFO_SETTINGS_SECTION_LABELS } from '@/features/info-settings';
import { cn } from '@/shared/lib/utils';
import { LeftBar } from '@/shared/ui';
import styles from './InfoSettingsLeftBar.module.scss';

export interface InfoSettingsLeftBarProps {
  activeSection?: InfoSettingsSection;
  onSectionChange?: (section: InfoSettingsSection) => void;
  availableSections?: InfoSettingsSection[];
}

export const InfoSettingsLeftBar = ({
  activeSection,
  onSectionChange,
  availableSections,
}: InfoSettingsLeftBarProps) => {
  const sections = Object.entries(INFO_SETTINGS_SECTION_LABELS).map(
    ([id, label]) => ({
      id: id as InfoSettingsSection,
      label,
    }),
  );

  return (
    <LeftBar hideHeader>
      <nav className={styles.menu} aria-label="Настройки">
        {sections.map(({ id, label }) => {
          const isDisabled =
            availableSections != null &&
            availableSections.length > 0 &&
            !availableSections.includes(id);

          return (
            <button
              key={id}
              type="button"
              className={cn([styles.menuItem], {
                [styles.menuItemActive]: activeSection === id,
              })}
              disabled={isDisabled}
              onClick={isDisabled ? undefined : () => onSectionChange?.(id)}
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
