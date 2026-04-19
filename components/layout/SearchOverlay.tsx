'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, X, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatPrice, debounce } from '@/lib/utils';
import type { Product } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function searchProducts(products: Product[], query: string): Product[] {
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

// Quick-action suggestions shown when the bar is focused but empty
const QUICK_SUGGESTIONS = [
  { label: 'Gold earrings', href: '/collections?category=earrings&q=gold' },
  { label: 'Silver rings',  href: '/collections?category=rings&q=silver' },
  { label: 'Temple necklaces', href: '/collections?category=necklaces&q=temple' },
  { label: 'Custom bespoke', href: '/collections?category=custom' },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && catalog.length === 0) {
      import('@/lib/api').then(({ getProducts }) =>
        getProducts().then(setCatalog),
      );
    }
  }, [isOpen, catalog.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => setResults(searchProducts(catalog, q)), 250),
    [catalog],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
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

  const listContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: { height: { duration: 0.4 }, staggerChildren: 0.06 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search panel */}
          <motion.div
            className="relative z-10 bg-ivory w-full"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
              {/* Eyebrow label */}
              <label
                htmlFor="global-search"
                className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-gold/80 mb-2 block"
              >
                Search the atelier
              </label>

              {/* Input with animated right-side icon */}
              <div className="relative">
                <Input
                  id="global-search"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rings, materials, styles…"
                  className="h-12 pl-4 pr-12 text-base"
                  aria-label="Search products"
                />

                {/* Right side: Search ↔ Send ↔ Clear icon swap */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {query.length > 0 ? (
                      <motion.button
                        key="clear"
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        initial={{ y: -18, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 18, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-champagne/60 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.div
                        key="search"
                        initial={{ y: -18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 18, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 flex items-center justify-center text-gold"
                      >
                        <Search className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Results / suggestions dropdown */}
              <div className="mt-3 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {!query ? (
                    <motion.div
                      key="suggestions"
                      className="overflow-hidden"
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <p className="font-body font-semibold text-xs tracking-[0.25em] uppercase text-obsidian/60 mb-3 px-2">
                        Popular
                      </p>
                      <ul className="flex flex-col gap-1" role="list">
                        {QUICK_SUGGESTIONS.map((s) => (
                          <motion.li
                            key={s.label}
                            variants={itemVariants}
                            layout
                          >
                            <Link
                              href={s.href}
                              onClick={onClose}
                              className="flex items-center justify-between px-3 py-2.5 rounded-sm hover:bg-champagne/50 transition-colors group"
                            >
                              <span className="flex items-center gap-3">
                                <Sparkles
                                  size={14}
                                  className="text-gold shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="font-accent text-sm text-obsidian/80 group-hover:text-obsidian">
                                  {s.label}
                                </span>
                              </span>
                              <ArrowRight
                                size={14}
                                className="text-obsidian/30 group-hover:text-gold group-hover:translate-x-1 transition-all"
                                aria-hidden="true"
                              />
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : results.length === 0 ? (
                    <motion.p
                      key="empty"
                      className="py-8 text-center font-accent text-base italic text-obsidian/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      No pieces found for &ldquo;{query}&rdquo;
                    </motion.p>
                  ) : (
                    <motion.div
                      key="results"
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <p className="font-body font-semibold text-xs tracking-[0.25em] uppercase text-obsidian/60 mb-3 px-2">
                        {results.length} piece{results.length !== 1 ? 's' : ''} found
                      </p>
                      <ul className="flex flex-col gap-1" role="list">
                        {results.slice(0, 8).map((product) => (
                          <motion.li
                            key={product.id}
                            variants={itemVariants}
                            layout
                          >
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-3 py-2.5 px-2 rounded-sm hover:bg-champagne/50 transition-colors group"
                            >
                              <div className="w-11 h-11 bg-platinum rounded-sm shrink-0 flex items-center justify-center overflow-hidden relative">
                                {product.images[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="44px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-champagne/60 rounded-sm shimmer" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm font-medium text-obsidian group-hover:text-gold transition-colors truncate">
                                  {product.name}
                                </p>
                                <p className="font-accent text-xs text-obsidian/50 capitalize truncate">
                                  {product.category} · {product.material.join(', ')}
                                </p>
                              </div>
                              <p className="font-body font-semibold text-sm text-gold shrink-0">
                                {formatPrice(product.price)}
                              </p>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>

                      {results.length > 8 && (
                        <Link
                          href={`/collections?q=${encodeURIComponent(query)}`}
                          onClick={onClose}
                          className="block mt-3 py-3 text-center font-accent text-sm text-gold hover:underline underline-offset-2 transition-all"
                        >
                          View all {results.length} results in Collections →
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard hint footer */}
              <div className="mt-4 pt-3 border-t border-platinum/80 flex items-center justify-between font-body font-semibold text-[11px] tracking-wider uppercase text-obsidian/60">
                <span className="flex items-center gap-1.5">
                  {query.length > 0 ? (
                    <>
                      <Send size={12} aria-hidden="true" />
                      Enter to search collections
                    </>
                  ) : (
                    'Type to search'
                  )}
                </span>
                {/* Keyboard hint — hidden on mobile (no physical Esc key) */}
                <span className="hidden sm:inline">
                  <kbd className="font-body px-1.5 py-0.5 border border-platinum rounded-sm bg-pearl text-obsidian/60">
                    Esc
                  </kbd>{' '}
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
