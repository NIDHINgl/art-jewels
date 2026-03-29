import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = '',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={['shimmer rounded-sm', className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4] rounded-sm" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-1" />
      </div>
    </div>
  );
}
