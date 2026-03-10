import { cn } from '@/shared/lib/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogoIcon } from '../../assets';
import { Backdrop } from '../Backdrop';
import ArrowLeftIcon from './assets/arrow-left.svg?react';
import largeModalImage from './assets/large-modal-image.png';
import styles from './Modal.module.scss';
import type { ModalTitleContextValue } from './model';
export type { ModalTitleContextValue } from './model';

const ModalTitleContext = createContext<ModalTitleContextValue | null>(null);

export function useModalTitle(): ModalTitleContextValue | null {
  return useContext(ModalTitleContext);
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'small' | 'large';
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function Modal({
  mode = 'small',
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [currentTitle, setCurrentTitle] = useState<React.ReactNode>(title);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const prevStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = prevStyles.overflow;
      document.body.style.position = prevStyles.position;
      document.body.style.width = prevStyles.width;
      document.body.style.top = prevStyles.top;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  // Сохраняем фокус при открытии и восстанавливаем только при закрытии.
  // Обработчик Escape через ref, чтобы эффект не зависел от onClose (иначе при каждом
  // вводе в форме родитель перерисовывается, onClose новый → эффект перезапускается и
  // забирает фокус с инпута).
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current =
        document.activeElement as HTMLElement | null;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCloseRef.current();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      previousActiveElement.current?.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const titleContextValue: ModalTitleContextValue = {
    title: currentTitle,
    setTitle: setCurrentTitle,
  };

  const content = (
    <ModalTitleContext.Provider value={titleContextValue}>
      <div className={styles.root} role="dialog" aria-modal="true">
        <Backdrop
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden={true}
        />
        {mode === 'small' ? (
          <div className={styles.panel} ref={panelRef}>
            <div className={styles.content}>
              <div className={styles.header}>
                {currentTitle != null && currentTitle}
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <ArrowLeftIcon width={24} height={24} aria-hidden />
                </button>
              </div>
              <div className={styles.body}>{children}</div>
            </div>
          </div>
        ) : (
          <div className={cn([styles.panel, styles.large])} ref={panelRef}>
            <div className={styles.content}>
              <div className={styles.leftSide}>
                <LogoIcon className={styles.logo} aria-label="Logo" />
                <p className={styles.slug}>Присоединяйся к сообществу</p>
                <div className={styles.imgGradientOverlay} />
                <img src={largeModalImage} alt="Modal image" />
              </div>
              <div className={styles.rightSide}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <ArrowLeftIcon width={24} height={24} aria-hidden />
                </button>
                {currentTitle && currentTitle.toString()}
                <div className={styles.body}>{children}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalTitleContext.Provider>
  );

  return createPortal(content, document.body);
}
