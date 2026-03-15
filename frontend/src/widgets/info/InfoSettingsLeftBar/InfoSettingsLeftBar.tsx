import { cn } from '@/shared/lib/utils';
import { LeftBar, type EntityType } from '@/shared/ui';
import styles from './InfoSettingsLeftBar.module.scss';

export type InfoSettingsSection = 'info' | 'actions';

export interface InfoSettingsLeftBarProps {
  backUrl: string;
  title: string;
  entityType: EntityType;
  activeSection?: InfoSettingsSection;
  onSectionChange?: (section: InfoSettingsSection) => void;
}

const SECTIONS: { id: InfoSettingsSection; label: string }[] = [
  { id: 'info', label: 'Информация' },
  { id: 'actions', label: 'Действия' },
];

export const InfoSettingsLeftBar = ({
  backUrl,
  title,
  entityType,
  activeSection = 'info',
  onSectionChange,
}: InfoSettingsLeftBarProps) => {
  return (
    <LeftBar backUrl={backUrl} title={title} entityType={entityType}>
      <nav className={styles.menu} aria-label="Настройки">
        {SECTIONS.map(({ id, label }) => (
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
        ))}
      </nav>
    </LeftBar>
  );
};
