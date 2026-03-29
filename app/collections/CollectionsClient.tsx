'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '@/data/products';
import type { FilterState, SortOption, Category, Material, Style } from '@/types';
import { getPriceRange, debounce } from '@/lib/utils';
import { PRODUCTS_PER_PAGE } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import FilterChips from '@/components/filters/FilterChips';
import SortDropdown from '@/components/filters/SortDropdown';
import Button from '@/components/ui/Button';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

const catalogPrices = products.map((p) => p.price);
const DEFAULT_PRICE_RANGE = getPriceRange(catalogPrices);

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  materials: [],
  styles: [],
  priceRange: DEFAULT_PRICE_RANGE,
  inStockOnly: false,
};

function sortProducts(list: typeof products, sort: SortOption) {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

function applyFilters(
  list: typeof products,
  filters: FilterState,
  query: string,
): typeof products {
  let result = list;

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.some((m) => m.toLowerCase().includes(q)) ||
        p.style.toLowerCase().includes(q),
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((p) =>
      filters.categories.includes(p.category as Category),
    );
  }

  if (filters.materials.length > 0) {
    result = result.filter((p) =>
      p.material.some((m) => filters.materials.includes(m as Material)),
    );
  }

  if (filters.styles.length > 0) {
    result = result.filter((p) =>
      filters.styles.includes(p.style as Style),
    );
  }

  result = result.filter(
    (p) =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
  );

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  return result;
}

export default function CollectionsPageClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;
  const initialQuery = searchParams.get('q') ?? '';

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortOption>('featured');
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      setSearchQuery(q);
      setVisibleCount(PRODUCTS_PER_PAGE);
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  const filtered = useMemo(
    () => applyFilters(products, filters, searchQuery),
    [filters, searchQuery],
  );

  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => c + PRODUCTS_PER_PAGE);
      setLoading(false);
    }, 400);
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setSearchQuery('');
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* Page header */}
      <div className="bg-pearl border-b border-platinum">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-2">
            The Atelier
          </p>
          <h1 className="font-display text-fluid-h1 text-obsidian">
            All Collections
          </h1>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="collection-search" className="sr-only">
              Search pieces
            </label>
            <input
              id="collection-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, material, style…"
              className="w-full pl-4 pr-10 py-3 border border-platinum-dark bg-ivory font-body text-sm text-obsidian placeholder-obsidian/40 outline-none focus:border-gold transition-colors rounded-sm"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian/40 hover:text-obsidian transition-colors"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Sort */}
          <SortDropdown value={sort} onChange={setSort} />

          {/* Mobile filter button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-platinum-dark text-sm font-body text-obsidian/70 hover:border-gold hover:text-gold transition-all rounded-sm"
            aria-label="Open filters"
            aria-expanded={sidebarOpen}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
          </button>
        </div>

        {/* Active filter chips */}
        <FilterChips
          filters={filters}
          defaultPriceRange={DEFAULT_PRICE_RANGE}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />

        <div className="flex gap-8 mt-6">
          {/* Sidebar — desktop sticky */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                priceRange={DEFAULT_PRICE_RANGE}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Count */}
            <p className="font-accent text-sm italic text-obsidian/50 mb-5">
              {sorted.length === 0
                ? 'No pieces match your filters'
                : `Showing ${visible.length} of ${sorted.length} piece${sorted.length !== 1 ? 's' : ''}`}
            </p>

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 rotate-45 border border-gold/30 flex items-center justify-center">
                  <div className="w-4 h-4 rotate-0 bg-gold/20" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-xl text-obsidian mb-2">
                    {searchQuery
                      ? `No pieces found for "${searchQuery}"`
                      : 'No pieces match your filters'}
                  </p>
                  <p className="font-accent text-sm italic text-obsidian/50">
                    Try adjusting your filters or browsing the full collection.
                  </p>
                </div>
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
                  {visible.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}

                  {/* Skeleton placeholders while loading */}
                  {loading &&
                    Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                      <ProductCardSkeleton key={`skel-${i}`} />
                    ))}
                </div>

                {/* Load more */}
                {hasMore && !loading && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                    >
                      Load More Pieces
                    </Button>
                    <p className="font-accent text-xs italic text-obsidian/40">
                      {sorted.length - visibleCount} more piece{sorted.length - visibleCount !== 1 ? 's' : ''} available
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden flex" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-ivory overflow-y-auto flex flex-col shadow-elevated animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-platinum sticky top-0 bg-ivory z-10">
              <h2 className="font-body text-sm font-semibold tracking-widest uppercase text-obsidian">
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
                className="text-obsidian/50 hover:text-obsidian transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="p-5 flex-1">
              <FilterSidebar
                filters={filters}
                onFilterChange={(f) => {
                  handleFilterChange(f);
                }}
                priceRange={DEFAULT_PRICE_RANGE}
              />
            </div>
            <div className="sticky bottom-0 p-4 bg-ivory border-t border-platinum">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setSidebarOpen(false)}
              >
                Show {sorted.length} Result{sorted.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
