'use client';

import React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// Warm champagne-toned 10x10 SVG — shows while the real image decodes
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjZlOWQwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTVkOGM0Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

type SmoothImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  wrapperClassName?: string;
};

/**
 * Drop-in next/image with warm blur-up placeholder.
 * Never hides the image — the blur sits *behind* the rendered <img>, and the
 * <img> itself stays fully opaque so SSR paint and no-JS paths still show content.
 */
export function SmoothImage({
  wrapperClassName,
  className,
  alt,
  ...props
}: SmoothImageProps) {
  return (
    <div className={cn('relative overflow-hidden smooth-paint', wrapperClassName)}>
      <Image
        {...props}
        alt={alt}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={className}
      />
    </div>
  );
}
