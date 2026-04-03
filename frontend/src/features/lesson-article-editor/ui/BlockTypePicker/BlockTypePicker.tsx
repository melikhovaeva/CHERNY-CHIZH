import type { ContentBlock } from '@/entities/article';
import type { ComponentType, SVGProps } from 'react';
import FileIcon from '../../assets/file.svg?react';
import ImageIcon from '../../assets/image.svg?react';
import TextIcon from '../../assets/text.svg?react';
import VideoIcon from '../../assets/video.svg?react';
import { BLOCK_TYPE, type BlockTypeValue } from '../../config';
import { cn } from '@/shared/lib/utils';
import styles from './BlockTypePicker.module.scss';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ITEMS: {
  type: BlockTypeValue;
  Icon: IconComponent;
  label: string;
}[] = [
  { type: BLOCK_TYPE.TEXT, Icon: TextIcon, label: 'Текст' },
  { type: BLOCK_TYPE.IMAGE, Icon: ImageIcon, label: 'Картинка' },
  { type: BLOCK_TYPE.VIDEO, Icon: VideoIcon, label: 'Видео' },
  { type: BLOCK_TYPE.FILE, Icon: FileIcon, label: 'Файл' },
];

export interface BlockTypePickerProps {
  onSelect: (type: ContentBlock['type']) => void;
  /** default — пустое состояние и нижняя панель; compact — попап между блоками. */
  density?: 'default' | 'compact';
}

export function BlockTypePicker({
  onSelect,
  density = 'default',
}: BlockTypePickerProps) {
  return (
    <div
      className={cn([styles.root], {
        [styles.root_compact]: density === 'compact',
      })}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Добавить контент</h3>
      </div>
      <div className={styles.row}>
        {ITEMS.map(({ type, Icon, label }) => (
          <button
            key={type}
            type="button"
            className={styles.option}
            onClick={() => onSelect(type)}
          >
            <Icon className={styles.optionIcon} aria-hidden />
            <span className={styles.optionLabel}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
