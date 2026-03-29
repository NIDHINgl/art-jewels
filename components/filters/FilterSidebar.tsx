'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState, Category, Material, Style } from '@/types';
import { formatPrice, formatLabel } from '@/lib/utils';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  priceRange: [number, number];
}

const CATEGORIES: Category[] = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'custom'];
const MATERIALS: Material[] = ['gold', 'silver', 'rose-gold', 'platinum', 'pearl', 'gemstone', 'mixed'];
const STYLES: Style[] = ['minimalist', 'statement', 'vintage', 'bohemian', 'classic'];

interface CheckboxGroupProps<T extends string> {
  title: string;
  options: T[];
  selected: T[];
  onChange: (values: T[]) => void;
}

function CheckboxGroup<T extends string>({
  title,
  options,
  selected,
  onChange,
}: CheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="border-b border-platinum pb-5 mb-5">
      <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60 mb-3">
        {title}
      </h3>
      <ul className="flex flex-col gap-2" role="list">
        {options.map((option) => {
          const id = `filter-${title.toLowerCase()}-${option}`;
          return (
            <li key={option}>
              <label
                htmlFor={id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    id={id}
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggle(option)}
                    className="sr-only"
                  />
                  <div
                    className={[
                      'w-4 h-4 border rounded-sm flex items-center justify-center transition-all',
                      selected.includes(option)
                        ? 'bg-gold border-gold'
                        : 'border-platinum-dark group-hover:border-gold',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {selected.includes(option) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="font-accent text-sm text-obsidian/80 group-hover:text-obsidian transition-colors capitalize">
                  {formatLabel(option)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  priceRange,
}: FilterSidebarProps) {
  const [catalogMin, catalogMax] = priceRange;

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <aside aria-label="Product filters" className="w-full">
      {/* Price Range */}
      <div className="border-b border-platinum pb-5 mb-5">
        <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60 mb-4">
          Price Range
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="font-body text-sm font-medium text-obsidian">
              {formatPrice(filters.priceRange[0])}
            </span>
            <span className="font-body text-sm font-medium text-obsidian">
              {formatPrice(filters.priceRange[1])}
            </span>
          </div>
          <input
            type="range"
            min={catalogMin}
            max={catalogMax}
            value={filters.priceRange[0]}
            onChange={(e) =>
              updateFilter('priceRange', [
                Math.min(Number(e.target.value), filters.priceRange[1] - 500),
                filters.priceRange[1],
              ])
            }
            className="range-slider"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={catalogMin}
            max={catalogMax}
            value={filters.priceRange[1]}
            onChange={(e) =>
              updateFilter('priceRange', [
                filters.priceRange[0],
                Math.max(Number(e.target.value), filters.priceRange[0] + 500),
              ])
            }
            className="range-slider"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="border-b border-platinum pb-5 mb-5">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">
            In Stock Only
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
              aria-label="Show in stock only"
            />
            <div
              className={[
                'w-10 h-5 rounded-full transition-colors duration-200',
                filters.inStockOnly ? 'bg-gold' : 'bg-platinum-dark',
              ].join(' ')}
              aria-hidden="true"
            >
              <div
                className={[
                  'w-4 h-4 bg-white rounded-full absolute top-0.5',
                  'transition-transform duration-200 shadow-sm',
                  filters.inStockOnly ? 'translate-x-5' : 'translate-x-0.5',
                ].join(' ')}
              />
            </div>
          </div>
        </label>
      </div>

      {/* Category */}
      <CheckboxGroup<Category>
        title="Category"
        options={CATEGORIES}
        selected={filters.categories}
        onChange={(values) => updateFilter('categories', values)}
      />

      {/* Material */}
      <CheckboxGroup<Material>
        title="Material"
        options={MATERIALS}
        selected={filters.materials}
        onChange={(values) => updateFilter('materials', values)}
      />

      {/* Style */}
      <CheckboxGroup<Style>
        title="Style"
        options={STYLES}
        selected={filters.styles}
        onChange={(values) => updateFilter('styles', values)}
      />
    </aside>
  );
}
