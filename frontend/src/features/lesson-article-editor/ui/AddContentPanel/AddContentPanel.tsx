import type { ContentBlock } from '@/entities/article';
import { BlockTypePicker } from '../BlockTypePicker/BlockTypePicker';
import styles from './AddContentPanel.module.scss';

export interface AddContentPanelProps {
  onAdd: (type: ContentBlock['type']) => void;
  variant: 'empty' | 'bottom';
}

export function AddContentPanel({ onAdd, variant }: AddContentPanelProps) {
  if (variant === 'empty') {
    return (
      <div className={styles.emptyWrap}>
        <BlockTypePicker onSelect={onAdd} />
      </div>
    );
  }

  return (
    <div className={styles.bottomWrap}>
      <BlockTypePicker onSelect={onAdd} />
    </div>
  );
}
