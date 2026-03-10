import { createContext } from 'react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left';

export interface ToastOptions {
  message?: string;
  duration?: number;
}

export interface ToastItem {
  id: number;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
  exiting?: boolean;
}

export interface ToastContextValue {
  add: (type: ToastType, title: string, options?: ToastOptions) => void;
  remove: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
