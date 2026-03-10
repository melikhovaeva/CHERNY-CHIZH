import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ToastContext,
  type ToastType,
  type ToastItem,
  type ToastPosition,
} from "./ToastContext";
import { ToastStack } from "./ToastStack";

const DEFAULT_DURATION = 5000;
const EXIT_ANIMATION_MS = 300;

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({
  children,
  position = "bottom-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const exitingIds = useRef(new Set<number>());

  const remove = useCallback((id: number) => {
    if (exitingIds.current.has(id)) return;
    exitingIds.current.add(id);

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );

    setTimeout(() => {
      exitingIds.current.delete(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const add = useCallback(
    (type: ToastType, title: string, options?: { message?: string; duration?: number }) => {
      const id = nextId.current++;
      const dur = options?.duration ?? DEFAULT_DURATION;
      setToasts((prev) => [
        ...prev,
        { id, title, message: options?.message, type, duration: dur },
      ]);
      setTimeout(() => remove(id), dur);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      {createPortal(
        <ToastStack toasts={toasts} position={position} onDismiss={remove} />,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
