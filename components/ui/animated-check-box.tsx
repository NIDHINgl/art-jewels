'use client';

import React, { type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface NeonCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Pixel size of the checkbox square. Default 20. */
  size?: number;
  /** Classes for the outer <label> wrapper. */
  wrapperClassName?: string;
  /** Classes for the label text span. */
  labelClassName?: string;
}

const PARTICLE_X = [
  '25px', '-25px', '25px', '-25px', '35px', '-35px',
  '0px', '0px', '20px', '-20px', '30px', '-30px',
];
const PARTICLE_Y = [
  '-25px', '-25px', '25px', '25px', '0px', '0px',
  '35px', '-35px', '-30px', '30px', '20px', '-20px',
];

/**
 * LUMORA-themed neon checkbox. On check: glowing gold border, traveling
 * edge pulses, a burst of gold particles, three expanding rings, and four
 * sparks shooting out in cardinal directions.
 *
 * Keyframes live in app/globals.css (see @keyframes neonCheckbox*).
 */
export const NeonCheckbox: React.FC<NeonCheckboxProps> = ({
  label,
  className,
  wrapperClassName,
  labelClassName,
  size = 20,
  checked: controlledChecked,
  defaultChecked,
  onChange,
  ...props
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  // Gold palette, not neon green
  const cssVars = {
    '--neon-primary': '#d7bb5b',      // gold-bright
    '--neon-primary-dark': '#b7893a', // gold
    '--neon-primary-light': '#f6e9d0', // champagne
    '--neon-size': `${size}px`,
  } as React.CSSProperties;

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none group',
        wrapperClassName,
      )}
      style={cssVars}
    >
      <span
        className={cn(
          'relative inline-block w-[var(--neon-size)] h-[var(--neon-size)] shrink-0',
          className,
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />

        {/* Box + border — DARK fill when checked so the glow, particles,
            traveling-border pulses, and spark flashes all read against an
            obsidian canvas (neon aesthetic) */}
        <span
          className={cn(
            'absolute inset-0 rounded-sm border-2 transition-all duration-300',
            isChecked
              ? 'border-[color:var(--neon-primary)] bg-obsidian'
              : 'border-[color:var(--neon-primary-dark)]/50 bg-ivory group-hover:border-[color:var(--neon-primary)]',
          )}
        >
          {/* Check mark — bright champagne, glows against the dark fill */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f6e9d0"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'absolute inset-0 w-full h-full p-[2px] origin-center',
              'drop-shadow-[0_0_4px_rgba(215,187,91,0.8)]',
              'transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
              isChecked ? 'scale-100' : 'scale-75',
            )}
            style={{
              strokeDasharray: 40,
              strokeDashoffset: isChecked ? 0 : 40,
              transition:
                'stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <path d="M3,12.5l7,7L21,5" />
          </svg>

          {/* Soft blur glow */}
          <span
            className={cn(
              'absolute -inset-0.5 rounded-md bg-[color:var(--neon-primary)] blur-md transition-opacity duration-400 pointer-events-none',
              isChecked ? 'opacity-30' : 'opacity-0',
            )}
            aria-hidden="true"
          />

          {/* Traveling border pulses */}
          <span
            className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  'absolute bg-[color:var(--neon-primary)] transition-opacity duration-400',
                  isChecked ? 'opacity-100' : 'opacity-0',
                  i === 0 && 'w-10 h-px top-0 left-[-100%] animate-[neonBorderFlow1_2s_linear_infinite]',
                  i === 1 && 'w-px h-10 top-[-100%] right-0 animate-[neonBorderFlow2_2s_linear_infinite]',
                  i === 2 && 'w-10 h-px bottom-0 right-[-100%] animate-[neonBorderFlow3_2s_linear_infinite]',
                  i === 3 && 'w-px h-10 bottom-[-100%] left-0 animate-[neonBorderFlow4_2s_linear_infinite]',
                )}
              />
            ))}
          </span>
        </span>

        {/* Particles, rings, sparks — fire on check */}
        <span className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {PARTICLE_X.map((x, i) => (
            <span
              key={`p${i}`}
              className={cn(
                'absolute w-1 h-1 bg-[color:var(--neon-primary)] rounded-full top-1/2 left-1/2 shadow-[0_0_6px_var(--neon-primary)]',
                isChecked
                  ? 'animate-[neonParticleExplosion_0.6s_ease-out_forwards]'
                  : 'opacity-0',
              )}
              style={{ '--nx': x, '--ny': PARTICLE_Y[i] } as React.CSSProperties}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <span
              key={`r${i}`}
              className={cn(
                'absolute -inset-5 rounded-full border border-[color:var(--neon-primary)]',
                isChecked
                  ? 'animate-[neonRingPulse_0.6s_ease-out_forwards]'
                  : 'opacity-0',
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <span
              key={`s${i}`}
              className={cn(
                'absolute w-5 h-px bg-gradient-to-r from-[color:var(--neon-primary)] to-transparent top-1/2 left-1/2',
                isChecked
                  ? 'animate-[neonSparkFlash_0.6s_ease-out_forwards]'
                  : 'opacity-0',
              )}
              style={{ '--nr': `${i * 90}deg` } as React.CSSProperties}
            />
          ))}
        </span>
      </span>

      {label !== undefined && (
        <span className={cn('text-sm text-obsidian/80', labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
};
