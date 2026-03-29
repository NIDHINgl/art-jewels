'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          'relative w-full bg-ivory rounded-sm shadow-elevated',
          'animate-fade-up outline-none',
          maxWidth,
        ].join(' ')}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-platinum">
            <h2
              id="modal-title"
              className="font-display text-xl text-obsidian"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-obsidian/50 hover:text-obsidian transition-colors p-1 rounded-sm focus-visible:outline-gold"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Close button if no title */}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-obsidian/50 hover:text-obsidian transition-colors p-1 rounded-sm z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
