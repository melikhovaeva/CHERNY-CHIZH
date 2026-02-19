import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Backdrop } from '../Backdrop';
import ArrowLeftIcon from './assets/arrow-left.svg?react';
import styles from './Modal.module.scss';
import type { ModalTitleContextValue } from './model';

const ModalTitleContext = createContext<ModalTitleContextValue | null>(null);

export function useModalTitle(): ModalTitleContextValue | null {
  return useContext(ModalTitleContext);
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [currentTitle, setCurrentTitle] = useState<React.ReactNode>(title);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

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

  useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current =
      document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

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
      </div>
    </ModalTitleContext.Provider>
  );

  return createPortal(content, document.body);
}
