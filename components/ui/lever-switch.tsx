'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeverSwitchProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label?: string;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

// Sizes in px — compact
const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 20;
const KNOB_SIZE = 22; // knob slightly overflows track for a "jewel sitting on rail" look
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE + 2; // how far the knob moves

/**
 * Jewel-inset slide toggle. An obsidian track with a gold rail, and a round
 * knob tipped with a diamond. Off state: warm amber gem, dim rail. On state:
 * icy-white diamond catches light, gold rail fills in, knob glows.
 *
 * Designed for LUMORA's filter sidebar — reads clearly at ~30px tall, feels
 * like a setting dial on a jeweller's workbench.
 */
export function LeverSwitch({
  checked,
  onCheckedChange,
  label,
  id,
  className,
  ...rest
}: LeverSwitchProps) {
  const toggle = () => onCheckedChange(!checked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={rest['aria-label'] ?? label ?? 'Toggle'}
      id={id}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      }}
      className={cn(
        'relative inline-flex items-center shrink-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-full',
        className,
      )}
      style={{ width: TRACK_WIDTH, height: KNOB_SIZE + 4 }}
    >
      {/* ─── Track ─── deep obsidian with an inset gold rail */}
      <span
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full overflow-hidden"
        style={{
          height: TRACK_HEIGHT,
          background:
            'linear-gradient(180deg, #0a0705 0%, #1a120c 55%, #0a0705 100%)',
          boxShadow:
            'inset 0 2px 3px rgba(0,0,0,0.65), inset 0 -1px 1px rgba(246,233,208,0.06), 0 1px 2px rgba(0,0,0,0.18)',
          border: '1px solid rgba(0,0,0,0.5)',
        }}
        aria-hidden="true"
      >
        {/* Gold rail — brightens when "on" */}
        <motion.span
          className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-px rounded-full"
          animate={{
            background: checked
              ? 'linear-gradient(90deg, rgba(246,233,208,0.9) 0%, #e9c576 50%, rgba(246,233,208,0.9) 100%)'
              : 'linear-gradient(90deg, rgba(183,137,58,0.15) 0%, rgba(233,197,118,0.35) 50%, rgba(183,137,58,0.15) 100%)',
            boxShadow: checked
              ? '0 0 5px rgba(233,197,118,0.55)'
              : '0 0 2px rgba(233,197,118,0.12)',
          }}
          transition={{ duration: 0.4 }}
        />
      </span>

      {/* ─── Knob — gold dome with diamond, slides with spring ─── */}
      <motion.span
        className="absolute top-1/2 left-0 pointer-events-none flex items-center justify-center"
        animate={{ x: checked ? KNOB_TRAVEL : -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          marginTop: -KNOB_SIZE / 2,
        }}
      >
        {/* Outer glow ring — only visible when on */}
        <motion.span
          className="absolute inset-[-2px] rounded-full"
          animate={{
            opacity: checked ? 1 : 0,
            boxShadow: checked
              ? '0 0 9px 1.5px rgba(233, 197, 118, 0.55)'
              : '0 0 0 0 transparent',
          }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
        />

        {/* Gold dome */}
        <span
          className="relative w-full h-full rounded-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #fef6de 0%, #e9c576 35%, #b7893a 72%, #5c3a1a 100%)',
            boxShadow:
              '0 3px 5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.25)',
          }}
        >
          {/* Inset diamond — gem inside the dome */}
          <motion.span
            className="block w-[7px] h-[7px] rotate-45"
            animate={{
              background: checked
                ? 'linear-gradient(135deg, #ffffff 0%, #d0e8ff 35%, #6ab0f0 75%, #3f7fd4 100%)'
                : 'linear-gradient(135deg, #f6e9d0 0%, #d7bb5b 55%, #8a6628 100%)',
              boxShadow: checked
                ? '0 0 5px rgba(200, 228, 255, 0.95), inset 0 0 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(60,120,200,0.6)'
                : 'inset 0 0 1px rgba(0,0,0,0.3), inset 1px 1px 1px rgba(255,255,255,0.4)',
            }}
            transition={{ duration: 0.4 }}
          />
          {/* Tiny sparkle highlight (top-left of gem) that pops when on */}
          <motion.span
            className="absolute w-[2px] h-[2px] rounded-full bg-white pointer-events-none"
            style={{ top: '32%', left: '32%' }}
            animate={{ opacity: checked ? 0.95 : 0.5, scale: checked ? 1.1 : 0.8 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />
        </span>
      </motion.span>
    </button>
  );
}
