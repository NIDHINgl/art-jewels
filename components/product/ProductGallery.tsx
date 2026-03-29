'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const primary = images[active] ?? null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) setActive((a) => Math.min(a + 1, images.length - 1));
      else setActive((a) => Math.max(a - 1, 0));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Primary Image */}
        <div
          className="relative aspect-square bg-pearl rounded-sm overflow-hidden group cursor-zoom-in"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          {primary ? (
            <Image
              src={primary}
              alt={`${productName} — image ${active + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-champagne/20">
              <div className="w-16 h-16 rotate-45 border-2 border-gold/30" aria-hidden="true" />
              <p className="font-accent text-sm italic text-obsidian/40">Image coming soon</p>
            </div>
          )}

          {/* Zoom hint */}
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
                onClick={() => setActive(i)}
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

      {/* Lightbox */}
      {lightboxOpen && primary && (
        <div
          className="fixed inset-0 z-[200] bg-obsidian/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div
            className="relative max-w-3xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={primary}
              alt={productName}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
