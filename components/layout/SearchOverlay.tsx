'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { products } from '@/data/products';
import { formatPrice, debounce } from '@/lib/utils';
import type { Product } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.some((m) => m.toLowerCase().includes(q)) ||
      p.style.toLowerCase().includes(q),
  );
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((q: string) => setResults(searchProducts(q)), 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div className="relative z-10 bg-ivory w-full animate-fade-up">
        {/* Search Input */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4 border-b-2 border-gold pb-4">
            <Search size={22} className="text-gold shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, material, style…"
              className="flex-1 bg-transparent font-body text-lg text-obsidian placeholder-obsidian/40 outline-none"
              aria-label="Search products"
              aria-controls="search-results"
              aria-expanded={results.length > 0}
            />
            <button
              onClick={() => (query ? setQuery('') : onClose())}
              aria-label={query ? 'Clear search' : 'Close search'}
              className="shrink-0 text-obsidian/50 hover:text-obsidian transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Results */}
          <div id="search-results" className="mt-4 max-h-[60vh] overflow-y-auto">
            {query && results.length === 0 && (
              <p className="py-8 text-center font-accent text-lg italic text-obsidian/50">
                No pieces found for &ldquo;{query}&rdquo;
              </p>
            )}

            {results.length > 0 && (
              <>
                <p className="text-xs font-body text-obsidian/40 mb-3 tracking-widest uppercase">
                  {results.length} piece{results.length !== 1 ? 's' : ''} found
                </p>
                <ul className="flex flex-col gap-1" role="list">
                  {results.slice(0, 8).map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 py-3 px-2 rounded-sm hover:bg-platinum/40 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-platinum rounded-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <div className="w-10 h-10 bg-champagne/60 rounded-sm shimmer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-obsidian group-hover:text-gold transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="font-accent text-xs text-obsidian/50 capitalize">
                            {product.category} · {product.material.join(', ')}
                          </p>
                        </div>
                        <p className="font-body font-semibold text-sm text-gold shrink-0">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>

                {results.length > 8 && (
                  <Link
                    href={`/collections?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="block mt-4 py-3 text-center font-accent text-sm text-gold hover:underline underline-offset-2 transition-all"
                  >
                    View all {results.length} results in Collections →
                  </Link>
                )}
              </>
            )}

            {!query && (
              <p className="py-6 text-center font-accent text-base italic text-obsidian/40">
                Search for rings, necklaces, materials, styles…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
