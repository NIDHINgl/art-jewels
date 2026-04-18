'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductImageStackProps {
  images: string[];
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Adapted from the aceternity vertical-image-stack.
 *
 * Differences from the original demo:
 *   - Scoped to this card; does NOT listen to window wheel (would hijack page scroll)
 *   - No drag (the card itself is a Link — drag would conflict with click-to-navigate)
 *   - Auto-cycles only while hovered; at rest shows the front image with a
 *     subtle hint of the next card peeking from below
 *   - Falls back to a plain <Image> for 1-image products
 */
export function ProductImageStack({
  images,
  alt,
  sizes,
  priority,
  className,
}: ProductImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const lastNav = useRef(0);
  const COOLDOWN = 400;

  const navigate = useCallback(
    (dir: number) => {
      if (images.length < 2) return;
      const now = Date.now();
      if (now - lastNav.current < COOLDOWN) return;
      lastNav.current = now;
      setCurrentIndex((p) => (p + dir + images.length) % images.length);
    },
    [images.length],
  );

  // Auto-cycle while hovered
  useEffect(() => {
    if (!isHovered || images.length < 2) return;
    const interval = window.setInterval(() => navigate(1), 1600);
    return () => window.clearInterval(interval);
  }, [isHovered, navigate, images.length]);

  const getCardStyle = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    // Wrap diff into the shortest signed direction
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Front card
    if (diff === 0) {
      return { y: '0%', scale: 1, opacity: 1, rotateX: 0, zIndex: 5 };
    }
    // Behind (next-up)
    if (diff === 1 || (total === 2 && diff === -1)) {
      return { y: isHovered ? '14%' : '8%', scale: 0.92, opacity: 0.6, rotateX: -8, zIndex: 4 };
    }
    // Two-behind
    if (diff === 2) {
      return { y: '22%', scale: 0.84, opacity: 0.3, rotateX: -14, zIndex: 3 };
    }
    // Previous (above)
    if (diff === -1) {
      return { y: '-14%', scale: 0.92, opacity: 0.6, rotateX: 8, zIndex: 4 };
    }
    if (diff === -2) {
      return { y: '-22%', scale: 0.84, opacity: 0.3, rotateX: 14, zIndex: 3 };
    }
    // Off-stack
    return {
      y: diff > 0 ? '40%' : '-40%',
      scale: 0.7,
      opacity: 0,
      rotateX: diff > 0 ? -20 : 20,
      zIndex: 0,
    };
  };

  const isVisible = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  // Single image — no stack needed
  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        sizes={sizes}
        className={cn('object-cover', className)}
        priority={priority}
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{ perspective: '900px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((src, index) => {
        if (!isVisible(index)) return null;
        const style = getCardStyle(index);
        const isCurrent = index === currentIndex;

        return (
          <motion.div
            key={index}
            className="absolute inset-0 overflow-hidden rounded-[inherit] will-change-transform"
            animate={style}
            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.9 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className={cn('object-cover', className)}
              draggable={false}
              priority={priority && isCurrent}
            />
            {/* Soft shadow on stacked cards behind the front — adds depth */}
            {!isCurrent && (
              <div
                className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
