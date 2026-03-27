import React from 'react';
import { clsx } from 'clsx';

export default function Skeleton({ className, ...props }) {
  return (
    <div 
      className={clsx(
        'animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded',
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
