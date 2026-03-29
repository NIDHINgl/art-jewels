'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState, Category, Material, Style } from '@/types';
import { formatLabel, formatPrice } from '@/lib/utils';

interface FilterChipsProps {
  filters: FilterState;
  defaultPriceRange: [number, number];
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

export default function FilterChips({
  filters,
  defaultPriceRange,
  onFilterChange,
  onClearAll,
}: FilterChipsProps) {
  const chips: Array<{ label: string; onRemove: () => void }> = [];

  filters.categories.forEach((cat) =>
    chips.push({
      label: formatLabel(cat),
      onRemove: () =>
        onFilterChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    }),
  );

  filters.materials.forEach((mat) =>
    chips.push({
      label: formatLabel(mat),
      onRemove: () =>
        onFilterChange({
          ...filters,
          materials: filters.materials.filter((m) => m !== mat),
        }),
    }),
  );

  filters.styles.forEach((style) =>
    chips.push({
      label: formatLabel(style),
      onRemove: () =>
        onFilterChange({
          ...filters,
          styles: filters.styles.filter((s) => s !== style),
        }),
    }),
  );

  const priceChanged =
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];

  if (priceChanged) {
    chips.push({
      label: `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`,
      onRemove: () =>
        onFilterChange({ ...filters, priceRange: defaultPriceRange }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      label: 'In Stock',
      onRemove: () => onFilterChange({ ...filters, inStockOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Active filters">
      {chips.map(({ label, onRemove }) => (
        <div
          key={label}
          role="listitem"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-champagne/60 border border-gold/20 rounded-sm"
        >
          <span className="font-accent text-xs text-obsidian/80">{label}</span>
          <button
            onClick={onRemove}
            aria-label={`Remove filter: ${label}`}
            className="text-obsidian/40 hover:text-obsidian transition-colors"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      ))}

      <button
        onClick={onClearAll}
        className="font-accent text-xs text-rose-gold hover:text-rose-gold/70 transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}
