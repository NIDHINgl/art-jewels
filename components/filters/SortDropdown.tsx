'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '@/types';

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
  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none bg-ivory border border-platinum-dark rounded-sm px-4 py-2.5 pr-9 font-accent text-sm text-obsidian cursor-pointer focus:outline-none focus:border-gold transition-colors"
      >
        {SORT_OPTIONS.map(({ value: v, label }) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian/40 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
