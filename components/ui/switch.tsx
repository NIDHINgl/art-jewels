'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  'aria-label'?: string;
}

/**
 * Compact spring-driven switch. Off = obsidian track with a dark knob.
 * On = warm amber track with a gold knob that glows. Themed to LUMORA's
 * gold/obsidian palette (the reference used gray + yellow-300).
 */
export default function Switch({
  checked,
  onCheckedChange,
  id,
  ...rest
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState<boolean>(checked ?? false);
  const isChecked = isControlled ? checked : internal;

  const handleToggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={rest['aria-label']}
      id={id}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full shrink-0',
        'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        isChecked ? 'bg-obsidian' : 'bg-platinum',
      )}
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
    >
      <motion.span
        className={cn(
          'inline-block h-5 w-5 rounded-full',
          isChecked ? 'bg-gold' : 'bg-obsidian/80',
        )}
        animate={{ x: isChecked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 700, damping: 30, bounce: 0 }}
      >
        {isChecked && (
          <motion.span
            className="absolute inset-0 rounded-full bg-gold/70 blur-lg pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.35 }}
            aria-hidden="true"
          />
        )}
      </motion.span>
    </motion.button>
  );
}
