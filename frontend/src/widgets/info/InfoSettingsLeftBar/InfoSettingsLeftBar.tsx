import type { InfoSettingsSection } from '@/features';
import { INFO_SETTINGS_SECTION_LABELS } from '@/features/info-settings';
import { getInfoDisplayTitle, type InfoType } from '@/shared/config/info';
import { cn } from '@/shared/lib/utils';
import { LeftBar } from '@/shared/ui';
import styles from './InfoSettingsLeftBar.module.scss';

export interface InfoSettingsLeftBarProps {
  backUrl: string;
  title: string;
  infoType: InfoType;
  activeSection?: InfoSettingsSection;
  onSectionChange?: (section: InfoSettingsSection) => void;
  availableSections?: InfoSettingsSection[];
}

export const InfoSettingsLeftBar = ({
  backUrl,
  title,
  infoType,
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

  const displayTitle = getInfoDisplayTitle(title, infoType);

  return (
    <LeftBar backUrl={backUrl} title={displayTitle}>
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
