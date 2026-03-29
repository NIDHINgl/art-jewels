'use client';

import React, { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { ToastMessage } from '@/types';

// ─── Toast Store ──────────────────────────────────────────────────────────────
interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: generateId() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function useToast() {
  const { addToast } = useToastStore();

  const toast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success', opts?: Partial<ToastMessage>) => {
      addToast({ message, type, ...opts });
    },
    [addToast],
  );

  return { toast };
}

// ─── Toast Item ───────────────────────────────────────────────────────────────
function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const iconMap = {
    success: <CheckCircle size={16} className="shrink-0 text-green-400" aria-hidden="true" />,
    error: <AlertCircle size={16} className="shrink-0 text-red-400" aria-hidden="true" />,
    info: <Info size={16} className="shrink-0 text-blue-400" aria-hidden="true" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]',
        'bg-obsidian border border-platinum/20 rounded-sm p-4',
        'shadow-elevated text-white',
        'animate-slide-in-right',
      ].join(' ')}
    >
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.productName && (
          <p className="font-accent text-champagne text-sm truncate">
            {toast.productName}
          </p>
        )}
        <p className="font-body text-sm text-white/90">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-white/50 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
