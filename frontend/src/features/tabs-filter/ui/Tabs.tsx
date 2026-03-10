import { cn } from '@/shared/lib/utils';
import type { Tab } from '../model/types';
import styles from './Tabs.module.scss';

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange: (value: string) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  buttonClassName?: string;
  buttonActiveClassName?: string;
}

export function Tabs({
  tabs,
  variant = 'primary',
  activeTab = tabs[0]?.value ?? '',
  onTabChange,
  className,
  buttonClassName,
  buttonActiveClassName,
}: TabsProps) {
  return (
    <div
      className={cn([styles.scroll, className || ''], {
        [styles['variant--secondary']]: variant === 'secondary',
      })}
    >
      <ul className={styles.list} role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.item} role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              className={cn([
                styles.button,
                buttonClassName ?? '',
                activeTab === tab.value
                  ? (buttonActiveClassName ?? styles.button_active)
                  : '',
              ])}
              onClick={() => onTabChange(tab.value)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
