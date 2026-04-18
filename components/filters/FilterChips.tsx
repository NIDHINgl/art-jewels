'use client';

import React from 'react';
import type { FilterState } from '@/types';
import { formatLabel, formatPrice } from '@/lib/utils';
import { FilterBadge } from '@/components/ui/filter-badge';

interface FilterChipsProps {
  filters: FilterState;
  defaultPriceRange: [number, number];
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

interface Chip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export default function FilterChips({
  filters,
  defaultPriceRange,
  onFilterChange,
  onClearAll,
}: FilterChipsProps) {
  const chips: Chip[] = [];

  filters.categories.forEach((cat) =>
    chips.push({
      key: `cat-${cat}`,
      label: 'Category',
      value: formatLabel(cat),
      onRemove: () =>
        onFilterChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    }),
  );

  filters.materials.forEach((mat) =>
    chips.push({
      key: `mat-${mat}`,
      label: 'Material',
      value: formatLabel(mat),
      onRemove: () =>
        onFilterChange({
          ...filters,
          materials: filters.materials.filter((m) => m !== mat),
        }),
    }),
  );

  filters.styles.forEach((style) =>
    chips.push({
      key: `style-${style}`,
      label: 'Style',
      value: formatLabel(style),
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
      key: 'price',
      label: 'Price',
      value: `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`,
      onRemove: () =>
        onFilterChange({ ...filters, priceRange: defaultPriceRange }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      key: 'stock',
      label: 'Availability',
      value: 'In Stock Only',
      onRemove: () => onFilterChange({ ...filters, inStockOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="list"
      aria-label="Active filters"
    >
      {chips.map(({ key, label, value, onRemove }) => (
        <div key={key} role="listitem">
          <FilterBadge
            variant="pill"
            label={label}
            value={value}
            onRemove={onRemove}
          />
        </div>
      ))}

      <button
        onClick={onClearAll}
        className="font-accent text-xs text-rose-gold hover:text-rose-gold/70 transition-colors underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
