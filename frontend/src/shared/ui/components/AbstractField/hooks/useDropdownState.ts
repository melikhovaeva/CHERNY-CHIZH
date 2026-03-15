import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface UseDropdownStateReturn {
  isOpen: boolean;
  isClosing: boolean;
  isListVisible: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  handleListTransitionEnd: (e: React.TransitionEvent) => void;
}

export function useDropdownState(
  disabled?: boolean,
): UseDropdownStateReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
  }, [isOpen, isClosing]);

  const open = useCallback(() => {
    if (disabled || isOpen) return;
    setIsOpen(true);
    setIsClosing(false);
  }, [disabled, isOpen]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, close, open]);

  const handleListTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== listRef.current || e.propertyName !== 'transform')
        return;
      if (isClosing) {
        setIsOpen(false);
        setIsClosing(false);
      }
    },
    [isClosing],
  );

  useLayoutEffect(() => {
    if (isOpen && !isClosing) {
      const id = requestAnimationFrame(() => setIsListVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (!isOpen) setIsListVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsClosing(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isClosing]);

  return {
    isOpen,
    isClosing,
    isListVisible,
    containerRef,
    listRef,
    open,
    close,
    toggle,
    handleListTransitionEnd,
  };
}
