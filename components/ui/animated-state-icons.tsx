'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StateIconProps {
  size?: number;
  color?: string;
  className?: string;
}

// ─── Heart — fills with spring bounce ────────────────────────────────────────
interface HeartIconProps extends StateIconProps {
  filled: boolean;
  fillColor?: string;
}
export function AnimatedHeart({
  size = 40,
  color = 'currentColor',
  fillColor = '#c67a95', // rose-gold
  className,
  filled,
}: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      style={{ width: size, height: size }}
    >
      <motion.path
        d="M20 34s-12-7.5-12-16a7.5 7.5 0 0112-6 7.5 7.5 0 0112 6c0 8.5-12 16-12 16z"
        stroke={filled ? fillColor : color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? fillColor : 'none'}
        animate={filled ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        style={{ transformOrigin: '20px 22px' }}
      />
    </svg>
  );
}

// ─── Success — spinner morphs into checkmark ─────────────────────────────────
interface SuccessIconProps extends StateIconProps {
  done: boolean;
}
export function AnimatedSuccess({
  size = 40,
  color = 'currentColor',
  className,
  done,
}: SuccessIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      style={{ width: size, height: size }}
    >
      <motion.circle
        cx="20"
        cy="20"
        r="16"
        stroke={color}
        strokeWidth={2}
        animate={done ? { pathLength: 1, opacity: 1 } : { pathLength: 0.7, opacity: 0.4 }}
        transition={{ duration: 0.5 }}
      />
      {!done && (
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="25 75"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '20px 20px' }}
        />
      )}
      <motion.path
        d="M12 20l6 6 10-12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={done ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: done ? 0.2 : 0 }}
      />
    </svg>
  );
}

// ─── Toggle — switch flips with spring ───────────────────────────────────────
interface ToggleIconProps extends StateIconProps {
  on: boolean;
}
export function AnimatedToggle({
  size = 40,
  color = 'currentColor',
  className,
  on,
}: ToggleIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      style={{ width: size, height: size }}
    >
      <motion.rect
        x="5"
        y="13"
        width="30"
        height="14"
        rx="7"
        animate={on ? { fill: color, opacity: 0.25 } : { fill: color, opacity: 0.08 }}
        transition={{ duration: 0.3 }}
      />
      <rect
        x="5"
        y="13"
        width="30"
        height="14"
        rx="7"
        stroke={color}
        strokeWidth={2}
        opacity={on ? 1 : 0.4}
      />
      <motion.circle
        cy="20"
        r="5"
        fill={color}
        animate={on ? { cx: 28 } : { cx: 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />
    </svg>
  );
}

// ─── Bell — rings with red dot when new notification ─────────────────────────
interface NotificationIconProps extends StateIconProps {
  active: boolean;
  dotColor?: string;
}
export function AnimatedNotification({
  size = 40,
  color = 'currentColor',
  dotColor = '#ef4444',
  className,
  active,
}: NotificationIconProps) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      animate={active ? { rotate: [0, 8, -8, 6, -6, 3, 0] } : { rotate: 0 }}
      transition={{ duration: 0.6 }}
      style={{ width: size, height: size, transformOrigin: '20px 6px' }}
    >
      <path
        d="M28 16a8 8 0 00-16 0c0 8-4 10-4 10h24s-4-2-4-10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 30a3 3 0 005 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <motion.circle
        cx="28"
        cy="10"
        r="4"
        fill={dotColor}
        animate={active ? { scale: [0, 1.3, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      />
    </motion.svg>
  );
}

// ─── Send — paper plane flies off ────────────────────────────────────────────
interface SendIconProps extends StateIconProps {
  sent: boolean;
}
export function AnimatedSend({
  size = 40,
  color = 'currentColor',
  className,
  sent,
}: SendIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      style={{ width: size, height: size }}
    >
      <motion.g
        animate={
          sent ? { x: 30, y: -30, opacity: 0, scale: 0.5 } : { x: 0, y: 0, opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <path d="M34 6L16 20l-6-2L34 6z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        <path d="M34 6L22 34l-6-14" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        <line x1="16" y1="20" x2="22" y2="34" stroke={color} strokeWidth={2} />
      </motion.g>
    </svg>
  );
}

// ─── Copied — clipboard with check flash ─────────────────────────────────────
interface CopiedIconProps extends StateIconProps {
  copied: boolean;
}
export function AnimatedCopied({
  size = 40,
  color = 'currentColor',
  className,
  copied,
}: CopiedIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('', className)}
      style={{ width: size, height: size }}
    >
      <rect x="12" y="10" width="18" height="22" rx="2" stroke={color} strokeWidth={2} />
      <path
        d="M10 14h-0a2 2 0 00-2 2v18a2 2 0 002 2h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.3}
      />
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.path
            key="check"
            d="M16 21l4 4 6-8"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.g
            key="lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="17" y1="18" x2="25" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="23" x2="25" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="28" x2="22" y2="28" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
