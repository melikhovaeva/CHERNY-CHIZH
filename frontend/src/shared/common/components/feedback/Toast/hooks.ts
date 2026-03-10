import { useCallback, useContext } from 'react';
import { ToastContext, type ToastOptions, type ToastType } from './ToastContext';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

function useToastVariant(type: ToastType) {
  const { add } = useToast();
  return useCallback(
    (title: string, options?: ToastOptions) => add(type, title, options),
    [add, type],
  );
}

export function useError() {
  return useToastVariant('error');
}

export function useSuccess() {
  return useToastVariant('success');
}

export function useInfo() {
  return useToastVariant('info');
}

export function useWarning() {
  return useToastVariant('warning');
}
