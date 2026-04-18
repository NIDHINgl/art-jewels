'use client';

import React from 'react';
import type { FilterState, Category, Material, Style } from '@/types';
import { formatPrice, formatLabel } from '@/lib/utils';
import { NeonCheckbox } from '@/components/ui/animated-check-box';
import { Slider } from '@/components/ui/slider';
import { LeverSwitch } from '@/components/ui/lever-switch';

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
      <ul className="flex flex-col gap-3" role="list">
        {options.map((option) => {
          const id = `filter-${title.toLowerCase()}-${option}`;
          return (
            <li key={option}>
              <NeonCheckbox
                id={id}
                size={20}
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                label={formatLabel(option)}
                labelClassName="font-accent text-sm text-obsidian/80 group-hover:text-obsidian transition-colors capitalize"
              />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">
            Price Range
          </h3>
          <span className="font-body text-xs tabular-nums text-obsidian/70">
            <span className="font-medium text-obsidian">{formatPrice(filters.priceRange[0])}</span>
            <span className="mx-1 text-obsidian/40">—</span>
            <span className="font-medium text-obsidian">{formatPrice(filters.priceRange[1])}</span>
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onChange={(v) => updateFilter('priceRange', v as [number, number])}
          min={catalogMin}
          max={catalogMax}
          step={500}
          showValue={false}
          valuePosition="tooltip"
          formatValue={formatPrice}
          label="Price"
        />
      </div>

      {/* In Stock Toggle — jewel-lever switch */}
      <div className="border-b border-platinum pb-5 mb-5">
        <div className="flex items-center justify-between">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">
            In Stock Only
          </span>
          <LeverSwitch
            checked={filters.inStockOnly}
            onCheckedChange={(v) => updateFilter('inStockOnly', v)}
            aria-label="Show in-stock pieces only"
          />
        </div>
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
