'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { SCROLL_THRESHOLD } from '@/lib/constants';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={[
        'fixed bottom-8 right-6 z-50',
        'w-11 h-11 rounded-full',
        'bg-gold text-white',
        'flex items-center justify-center',
        'shadow-gold hover:bg-gold-light',
        'transition-all duration-200',
        'hover:scale-110 active:scale-95',
        'animate-fade-in',
      ].join(' ')}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
