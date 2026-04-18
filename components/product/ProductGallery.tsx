'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const primary = images[active] ?? null;

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const openLightbox = useCallback(() => setLightboxOpen(true), []);

  const goTo = useCallback(
    (i: number) => {
      setSlideDirection(i > active ? 1 : -1);
      setActive(Math.max(0, Math.min(images.length - 1, i)));
    },
    [active, images.length],
  );
  const next = useCallback(() => {
    if (!images.length) return;
    setSlideDirection(1);
    setActive((a) => (a + 1) % images.length);
  }, [images.length]);
  const prev = useCallback(() => {
    if (!images.length) return;
    setSlideDirection(-1);
    setActive((a) => (a - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next();
      else prev();
    }
  };

  // Keyboard + scroll lock — attach only while open
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, next, prev, closeLightbox]);

  // Body class + scroll lock — keep them on through the exit animation so
  // the navbar doesn't pop back in mid-close.
  useEffect(() => {
    if (lightboxOpen) {
      document.body.classList.add('lightbox-open');
      document.body.style.overflow = 'hidden';
      return;
    }
    // Match this to the longest exit animation (see `transition` below: 350ms)
    const timer = window.setTimeout(() => {
      document.body.classList.remove('lightbox-open');
      document.body.style.overflow = '';
    }, 400);
    return () => window.clearTimeout(timer);
  }, [lightboxOpen]);

  // Slide variants for image swap inside the lightbox
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 60, scale: 0.98 }),
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Primary Image */}
        <div
          className="relative aspect-square bg-pearl rounded-sm overflow-hidden group cursor-zoom-in smooth-paint"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={openLightbox}
        >
          {primary ? (
            <Image
              src={primary}
              alt={`${productName} — image ${active + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjZlOWQwIi8+PC9zdmc+"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-champagne/20">
              <div className="w-16 h-16 rotate-45 border-2 border-gold/30" aria-hidden="true" />
              <p className="font-accent text-sm italic text-obsidian/40">Image coming soon</p>
            </div>
          )}

          <div className="absolute bottom-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <ZoomIn size={16} className="text-obsidian/60" aria-hidden="true" />
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
            {images.map((img, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`View image ${i + 1}`}
                onClick={() => goTo(i)}
                className={[
                  'shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-all',
                  i === active ? 'border-gold' : 'border-transparent hover:border-platinum-dark',
                ].join(' ')}
              >
                <Image
                  src={img}
                  alt={`${productName} — thumbnail ${i + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox with enter + exit animations ─── */}
      <AnimatePresence>
        {lightboxOpen && primary && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[9999] bg-obsidian flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {/* Top bar */}
            <motion.div
              className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-white/10 shrink-0 relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
            >
              <span className="font-accent text-xs sm:text-sm tracking-[0.3em] uppercase text-white/60 truncate">
                {productName}
              </span>
              <div className="flex items-center gap-3">
                {images.length > 1 && (
                  <span className="font-accent text-xs tracking-[0.3em] uppercase text-white/50 tabular-nums">
                    {active + 1} / {images.length}
                  </span>
                )}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  aria-label="Close lightbox"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <X size={20} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.div>

            {/* Image area */}
            <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
              <div
                className="relative w-full h-full max-w-5xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
                  <motion.div
                    key={active}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={primary}
                      alt={productName}
                      fill
                      sizes="90vw"
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    aria-label="Previous image"
                    whileHover={{ scale: 1.08, x: -3 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft size={22} aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    aria-label="Next image"
                    whileHover={{ scale: 1.08, x: 3 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight size={22} aria-hidden="true" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            {images.length > 1 && (
              <motion.div
                className="border-t border-white/10 px-4 sm:px-6 py-3 shrink-0 flex gap-2 overflow-x-auto justify-center"
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
              >
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to image ${i + 1}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={[
                      'shrink-0 w-14 h-14 rounded-sm overflow-hidden border-2 transition-colors',
                      i === active
                        ? 'border-gold'
                        : 'border-transparent hover:border-white/40 opacity-60 hover:opacity-100',
                    ].join(' ')}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
