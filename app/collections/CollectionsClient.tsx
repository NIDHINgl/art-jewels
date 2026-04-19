'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import type { FilterState, SortOption, Category, Material, Style, Product } from '@/types';
import { getPriceRange, debounce } from '@/lib/utils';
import { PRODUCTS_PER_PAGE } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import FilterChips from '@/components/filters/FilterChips';
import SortDropdown from '@/components/filters/SortDropdown';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { GlowingSearchBar } from '@/components/ui/animated-glowing-search-bar';
import { cn } from '@/lib/utils';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import { PrestigeButton } from '@/components/ui/prestige-button';
import { Search as SearchIcon } from 'lucide-react';

const CATEGORY_CHIPS: Array<{ value: Category | 'all'; label: string }> = [
  { value: 'all',       label: 'All' },
  { value: 'rings',     label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings',  label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'anklets',   label: 'Anklets' },
  { value: 'custom',    label: 'Custom' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'newest':     return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':   return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:           return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

function applyFilters(list: Product[], filters: FilterState, query: string): Product[] {
  let r = list;
  if (query.trim()) {
    const q = query.toLowerCase();
    r = r.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.some(m => m.toLowerCase().includes(q)) ||
      p.style.toLowerCase().includes(q),
    );
  }
  if (filters.categories.length) r = r.filter(p => filters.categories.includes(p.category as Category));
  if (filters.materials.length)  r = r.filter(p => p.material.some(m => filters.materials.includes(m as Material)));
  if (filters.styles.length)     r = r.filter(p => filters.styles.includes(p.style as Style));
  r = r.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
  if (filters.inStockOnly) r = r.filter(p => p.inStock);
  return r;
}

export default function CollectionsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get('category') as Category | null;
  const initialQuery    = searchParams.get('q') ?? '';

  // ─── Live product data ───────────────────────────────────────────────────
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Dynamic import so this module is never bundled into the server build
    import('@/lib/api').then(({ getProducts }) =>
      getProducts().then(products => {
        setAllProducts(products);
        setDataLoading(false);
      }),
    );
  }, []);

  const defaultPriceRange = useMemo(
    () => getPriceRange(allProducts.map(p => p.price)),
    [allProducts],
  );

  const DEFAULT_FILTERS: FilterState = {
    categories: initialCategory ? [initialCategory] : [],
    materials: [], styles: [],
    priceRange: defaultPriceRange,
    inStockOnly: false,
  };

  const [filters, setFilters]       = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort]             = useState<SortOption>('featured');
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [loadingMore, setLoadingMore]   = useState(false);

  // Update filter price range when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      setFilters(f => ({ ...f, priceRange: defaultPriceRange }));
    }
  }, [defaultPriceRange, allProducts.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => { setSearchQuery(q); setVisibleCount(PRODUCTS_PER_PAGE); }, 300), [],
  );
  useEffect(() => { debouncedSearch(searchInput); }, [searchInput, debouncedSearch]);

  const filtered = useMemo(() => applyFilters(allProducts, filters, searchQuery), [allProducts, filters, searchQuery]);
  const sorted   = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const visible  = sorted.slice(0, visibleCount);
  const hasMore  = visibleCount < sorted.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount(c => c + PRODUCTS_PER_PAGE); setLoadingMore(false); }, 300);
  };

  const handleClearAll = () => {
    // Truly empty — do NOT spread DEFAULT_FILTERS because that carries the
    // URL-derived initial category (e.g. came in via ?category=earrings).
    setFilters({
      categories: [],
      materials: [],
      styles: [],
      priceRange: defaultPriceRange,
      inStockOnly: false,
    });
    setSearchInput('');
    setSearchQuery('');
    setVisibleCount(PRODUCTS_PER_PAGE);
    // Strip query params from the URL so a refresh doesn't reapply them
    if (searchParams.toString()) {
      router.replace(pathname, { scroll: false });
    }
  };

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const activeCategory: Category | 'all' =
    filters.categories.length === 1 ? filters.categories[0] : 'all';
  const setActiveCategory = (cat: Category | 'all') => {
    handleFilterChange({
      ...filters,
      categories: cat === 'all' ? [] : [cat],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.styles.length > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1] ||
    searchQuery.length > 0;

  // Display name for the category-bound hero title (e.g., "Rings" when only rings are active)
  const heroCategoryLabel =
    CATEGORY_CHIPS.find((c) => c.value === activeCategory)?.label ?? 'All';

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* ─── Editorial header ─── ivory, minimal, gold-hairline accents ─── */}
      <header className="relative">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-6 sm:pb-8">
          {/* Mobile back link */}
          <Link
            href="/"
            aria-label="Back to home"
            className="sm:hidden inline-flex items-center gap-1.5 font-body font-medium text-xs tracking-wider text-obsidian/60 hover:text-gold transition-colors mb-5 -ml-1"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left: breadcrumb → title */}
            <div className="min-w-0">
              {/* Tiny breadcrumb-style eyebrow */}
              <p className="font-body font-semibold text-[10px] sm:text-xs tracking-[0.45em] uppercase text-obsidian/60 mb-2">
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-obsidian/25">/</span>
                <span className="text-gold">{heroCategoryLabel}</span>
              </p>

              {/* Title — changes to the active category label */}
              <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl text-obsidian leading-[0.98] tracking-tight">
                <span className="italic font-normal text-obsidian/50">the</span>{' '}
                {heroCategoryLabel === 'All' ? 'Collection' : heroCategoryLabel}
                <span className="text-gold">.</span>
              </h1>
            </div>

            {/* Right: inline meta */}
            <div className="flex items-baseline gap-3 md:gap-4 shrink-0">
              <span className="font-display text-4xl sm:text-5xl font-semibold text-obsidian tabular-nums">
                {sorted.length.toString().padStart(2, '0')}
              </span>
              <span className="font-accent italic text-sm text-obsidian/50">
                pieces,
                <br className="hidden sm:block" /> handcrafted.
              </span>
            </div>
          </div>

          {/* Gold hairline divider */}
          <div
            className="mt-6 sm:mt-10 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ─── Category tabs ─── underline-active style, magazine index feel ─── */}
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide border-b border-platinum"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORY_CHIPS.map(({ value, label }) => {
              const isActive = activeCategory === value;
              return (
                <button
                  key={value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(value)}
                  className={cn(
                    'group relative shrink-0 px-4 sm:px-5 py-4',
                    'font-body font-semibold text-[11px] sm:text-xs tracking-[0.35em] uppercase',
                    'transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                    isActive
                      ? 'text-obsidian'
                      : 'text-obsidian/65 hover:text-obsidian',
                  )}
                >
                  {label}
                  {/* Animated bottom underline — always rendered, width/opacity morphs */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gold',
                      'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isActive
                        ? 'w-[60%] opacity-100'
                        : 'w-0 opacity-0 group-hover:w-[40%] group-hover:opacity-70',
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── Toolbar + grid ─── */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <label htmlFor="collection-search" className="sr-only">Search pieces</label>
          <GlowingSearchBar
            id="collection-search"
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (v === '') setSearchQuery('');
            }}
            cyclePlaceholders={[
              'Try "temple necklace"',
              'Try "emerald rings"',
              'Try "rose-gold bracelets"',
              'Try "minimalist earrings"',
              'Try "bespoke custom"',
            ]}
            ariaLabel="Search pieces"
          />
          <SortDropdown value={sort} onChange={setSort} />
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden h-12 flex items-center justify-center gap-2 px-4 border border-platinum-dark text-sm font-body text-obsidian/80 hover:border-gold hover:text-gold transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <FilterChips
          filters={filters}
          defaultPriceRange={defaultPriceRange}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />

        <div className="flex gap-8 mt-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <p className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-gold">
                  Refine
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="font-accent text-[11px] italic text-rose-gold hover:text-rose-gold/70 transition-colors underline underline-offset-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                priceRange={defaultPriceRange}
              />
            </div>
          </aside>

          {/* Grid — lg:min-h reserves vertical space so filter toggles don't
               collapse the page height (which otherwise causes the viewport
               to jump when the user has scrolled past the top). */}
          <div className="flex-1 min-w-0 lg:min-h-[calc(100vh-220px)]">
            {dataLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
                {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                {/* Result meta bar */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-platinum">
                  <p className="font-accent italic text-sm text-obsidian/60">
                    {sorted.length === 0 ? (
                      'No pieces match your filters'
                    ) : (
                      <>
                        <span className="tabular-nums font-body font-medium not-italic text-obsidian">
                          {visible.length}
                        </span>{' '}
                        of{' '}
                        <span className="tabular-nums font-body font-medium not-italic text-obsidian">
                          {sorted.length}
                        </span>{' '}
                        {sorted.length === 1 ? 'piece' : 'pieces'}
                      </>
                    )}
                  </p>
                </div>

                {sorted.length === 0 ? (
                  <Empty className="bg-pearl/60 border-platinum-dark/50 my-4">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchIcon className="text-gold" />
                      </EmptyMedia>
                      <EmptyTitle>
                        {searchQuery
                          ? `No pieces found for "${searchQuery}"`
                          : 'No pieces match your filters'}
                      </EmptyTitle>
                      <EmptyDescription>
                        Try adjusting your filters or browsing the full collection.
                        Every piece we make is one-of-a-kind, so nothing stays on the
                        site for long.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <PrestigeButton
                        type="button"
                        onClick={handleClearAll}
                        title="Clear All Filters"
                        variant="obsidian"
                        size="md"
                        className="w-full sm:w-auto"
                      />
                    </EmptyContent>
                  </Empty>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
                      {visible.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                      {loadingMore && Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                        <ProductCardSkeleton key={`sk-${i}`} />
                      ))}
                    </div>
                    {hasMore && !loadingMore && (
                      <div className="mt-14 flex flex-col items-center gap-3">
                        <PrestigeButton
                          type="button"
                          onClick={handleLoadMore}
                          title="Load More Pieces"
                          variant="outline"
                          size="md"
                          className="w-full sm:w-auto"
                        />
                        <p className="font-accent text-[11px] italic text-obsidian/60">
                          {sorted.length - visibleCount} more piece
                          {sorted.length - visibleCount !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden flex" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm animate-fade-in" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="relative w-80 max-w-[85vw] h-full bg-ivory overflow-y-auto flex flex-col shadow-elevated animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-platinum sticky top-0 bg-ivory z-10">
              <h2 className="font-body text-sm font-semibold tracking-widest uppercase text-obsidian">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="text-obsidian/50 hover:text-obsidian transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex-1">
              <FilterSidebar filters={filters} onFilterChange={f => { handleFilterChange(f); }} priceRange={defaultPriceRange} />
            </div>
            <div className="sticky bottom-0 p-4 bg-ivory border-t border-platinum">
              <PrestigeButton
                type="button"
                onClick={() => setSidebarOpen(false)}
                icon={<Check />}
                title={`Show ${sorted.length} Result${sorted.length !== 1 ? 's' : ''}`}
                variant="obsidian"
                size="md"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
