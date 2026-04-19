'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlowingSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  /** Static fallback placeholder. Ignored when `cyclePlaceholders` is provided. */
  placeholder?: string;
  /** Rotating list of suggested search prompts typed out letter-by-letter. */
  cyclePlaceholders?: string[];
  typeSpeed?: number;
  idleDelay?: number;
  id?: string;
  ariaLabel?: string;
  className?: string;
  /** Height in px — responsive handled by parent (use via `height` only when fixed needed). */
  height?: number;
}

// Typing-cycle placeholder hook
function useTypingPlaceholder(prompts: string[], typeSpeed: number, idleDelay: number) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState('');
  const [typing, setTyping] = React.useState(true);
  const intervalRef = React.useRef<number | null>(null);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    const current = prompts[index];
    if (!current || prompts.length === 0) {
      setText('');
      setTyping(false);
      return;
    }

    const chars = Array.from(current);
    setText('');
    setTyping(true);
    let charIndex = 0;

    intervalRef.current = window.setInterval(() => {
      if (charIndex < chars.length) {
        setText(chars.slice(0, charIndex + 1).join(''));
        charIndex += 1;
      } else {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTyping(false);
        timeoutRef.current = window.setTimeout(() => {
          setIndex((prev) => (prev + 1) % prompts.length);
        }, idleDelay);
      }
    }, typeSpeed);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, prompts, typeSpeed, idleDelay]);

  return { text, typing };
}

/**
 * Clean search input with a typing-cycle placeholder. The rotating conic
 * gradient halo was removed — kept just a subtle gold focus ring, a warm
 * pearl fill, and a gradient-stroked search icon.
 */
export function GlowingSearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  cyclePlaceholders,
  typeSpeed = 70,
  idleDelay = 2200,
  id,
  ariaLabel,
  className,
}: GlowingSearchBarProps) {
  const { text, typing } = useTypingPlaceholder(
    cyclePlaceholders ?? [],
    typeSpeed,
    idleDelay,
  );

  const effectivePlaceholder = React.useMemo(() => {
    if (!cyclePlaceholders?.length || value) return placeholder;
    return `${text}${typing ? '|' : ''}`;
  }, [cyclePlaceholders, value, placeholder, text, typing]);

  return (
    // On mobile the parent is flex-col, so `flex-1` would compete with `h-12`
    // and collapse the input. Use `w-full` on mobile, `flex-1` only on sm+ (row).
    <div className={cn('relative w-full sm:flex-1 h-12 group', className)}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={effectivePlaceholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className={cn(
          'w-full h-full rounded-sm',
          'bg-pearl border border-platinum-dark/50',
          'pl-11 pr-11 font-body text-sm text-obsidian placeholder-obsidian/40',
          'transition-colors duration-300',
          'focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20',
        )}
      />

      {/* Left search icon with gold gradient stroke */}
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        >
          <defs>
            <linearGradient id="glow-search-circle" gradientTransform="rotate(50)">
              <stop stopColor="#b7893a" offset="0%" />
              <stop stopColor="#d7bb5b" offset="60%" />
            </linearGradient>
            <linearGradient id="glow-search-handle">
              <stop stopColor="#b7893a" offset="0%" />
              <stop stopColor="#5c3a1a" offset="80%" />
            </linearGradient>
          </defs>
          <circle stroke="url(#glow-search-circle)" r="8" cy="11" cx="11" />
          <line stroke="url(#glow-search-handle)" x1="22" y1="22" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-sm flex items-center justify-center text-obsidian/50 hover:text-obsidian hover:bg-champagne/60 transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
