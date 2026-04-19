'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { BRAND_NAME } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav className="relative ml-auto w-[80vw] max-w-sm h-full bg-ivory flex flex-col animate-slide-in-right shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-platinum">
          <span className="font-wordmark font-bold text-xl tracking-[0.2em] text-obsidian">
            {BRAND_NAME}
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-sm text-obsidian/60 hover:text-obsidian hover:bg-platinum/60 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <ul className="flex flex-col py-8 px-6 gap-1" role="list">
          {links.map(({ href, label }, index) => (
            <li
              key={href}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-up"
            >
              <Link
                href={href}
                onClick={onClose}
                className="block py-3 font-display text-2xl text-obsidian hover:text-gold transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto px-6 pb-8 border-t border-platinum pt-6">
          <p className="font-accent text-sm text-obsidian/50 italic">
            Handcrafted elegance, worn with intent.
          </p>
        </div>
      </nav>
    </div>
  );
}
