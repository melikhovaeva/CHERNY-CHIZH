import type { ContentBlock } from '@/entities/article';
import { useEffect, useRef, useState } from 'react';
import { BlockTypePicker } from '../BlockTypePicker/BlockTypePicker';
import styles from './BlockInsertBar.module.scss';

export interface BlockInsertBarProps {
  onInsert: (type: ContentBlock['type']) => void;
  /** aria-label для кнопки «+» */
  ariaLabel?: string;
}

export function BlockInsertBar({
  onInsert,
  ariaLabel = 'Вставить блок',
}: BlockInsertBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const plusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || plusRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div className={styles.root}>
      <span className={styles.line} aria-hidden />
      <div className={styles.plusWrap}>
        <button
          type="button"
          ref={plusRef}
          className={styles.plus}
          aria-label={ariaLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          +
        </button>
        {menuOpen && (
          <div ref={menuRef} className={styles.menu}>
            <BlockTypePicker
              density="compact"
              onSelect={(type) => {
                onInsert(type);
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </div>
      <span className={styles.line} aria-hidden />
    </div>
  );
}
