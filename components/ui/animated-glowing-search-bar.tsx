'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlowingSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  /** Static fallback placeholder. Ignored when `cyclePlaceholders` is provided. */
  placeholder?: string;
  /** Rotating list of suggested search prompts typed out letter-by-letter while the input is empty. */
  cyclePlaceholders?: string[];
  /** ms between characters while typing. Default 70. */
  typeSpeed?: number;
  /** ms to pause after a full placeholder is typed before moving to the next. Default 2200. */
  idleDelay?: number;
  id?: string;
  ariaLabel?: string;
  className?: string;
  /** Fixed height — matches LUMORA's h-12 filter controls. */
  height?: number;
}

// Adapted from the OrbInput typing-cycle pattern. Types placeholders char-by-char
// with a blinking cursor, pauses, then advances to the next prompt.
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
 * Dark obsidian search bar with LUMORA gold conic-gradient glow.
 * Optional `cyclePlaceholders` causes the placeholder to type through each prompt.
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
  height = 48,
}: GlowingSearchBarProps) {
  const { text, typing } = useTypingPlaceholder(
    cyclePlaceholders ?? [],
    typeSpeed,
    idleDelay,
  );

  // When cycling is on and the user hasn't typed anything, show the typed prompt.
  // The trailing pipe (|) acts as a blinking cursor while typing.
  const effectivePlaceholder = React.useMemo(() => {
    if (!cyclePlaceholders?.length || value) return placeholder;
    return `${text}${typing ? '|' : ''}`;
  }, [cyclePlaceholders, value, placeholder, text, typing]);

  return (
    <div className={cn('relative flex-1 group', className)} style={{ height }}>
      {/* Outer glow ring */}
      <span
        className={cn(
          'absolute -inset-[2px] z-0 rounded-sm overflow-hidden blur-[6px] opacity-80',
          'before:absolute before:content-[""] before:w-[900px] before:h-[900px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:rotate-[60deg]',
          'before:bg-[conic-gradient(transparent,#e9c576_8%,transparent_34%,transparent_50%,#b7893a_60%,transparent_88%)]',
          'before:transition-[transform] before:duration-[2000ms]',
          'group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]',
        )}
        aria-hidden="true"
      />

      {/* Champagne inner accent */}
      <span
        className={cn(
          'absolute -inset-[1px] z-0 rounded-sm overflow-hidden blur-[3px] opacity-70',
          'before:absolute before:content-[""] before:w-[600px] before:h-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:rotate-[82deg]',
          'before:bg-[conic-gradient(transparent,#f6e9d0_6%,transparent_20%,transparent_50%,#dcc48a_62%,transparent_78%)]',
          'before:transition-[transform] before:duration-[2000ms]',
          'group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]',
        )}
        aria-hidden="true"
      />

      {/* Input layer */}
      <div className="relative z-10 h-full">
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
            'focus:outline-none focus:border-gold/60',
          )}
        />

        {/* Left search icon — gold gradient stroke */}
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

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-sm flex items-center justify-center text-obsidian/50 hover:text-obsidian hover:bg-champagne/60 transition-colors"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
