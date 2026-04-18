'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const current = SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Sort';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Sort products"
          className={cn(
            'h-12 inline-flex items-center justify-between gap-2 rounded-sm',
            'bg-ivory border border-platinum-dark px-4 pr-3 min-w-[12rem]',
            'font-accent text-sm text-obsidian',
            'hover:border-gold transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
            'data-[state=open]:border-gold data-[state=open]:ring-2 data-[state=open]:ring-gold/30',
          )}
        >
          <span className="truncate">{current}</span>
          <ChevronDown
            size={14}
            className="text-obsidian/50 transition-transform data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as SortOption)}
        >
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
