import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Rating({ value, count, showStars = true, showCount = true, size = 'sm' }) {
  const roundedValue = Math.round(value);
  
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={twMerge('flex items-center gap-1.5', sizes[size])}>
      {showStars && (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={clsx(
                star <= roundedValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
                size === 'lg' && 'w-4 h-4'
              )}
            />
          ))}
        </div>
      )}
      {showCount && count !== undefined && (
        <span className="text-gray-500">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

export function RatingBreakdown({ ratings, onFilter }) {
  // ratings = [{ stars: 5, count: 100 }, { stars: 4, count: 50 }, ...]
  const total = ratings?.reduce((sum, r) => sum + r.count, 0) || 0;
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const rating = ratings?.find(r => r.stars === stars);
        const count = rating?.count || 0;
        const percentage = total ? (count / total) * 100 : 0;
        
        return (
          <button
            key={stars}
            onClick={() => onFilter?.(stars)}
            className="w-full flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors"
          >
            <span className="text-xs font-medium text-gray-600 w-8">{stars}★</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
