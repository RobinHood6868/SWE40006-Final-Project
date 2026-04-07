import React from 'react';
import { clsx } from 'clsx';

export function Badge({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-600 text-white',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    sale: 'bg-red-600 text-white',
    new: 'bg-green-600 text-white',
  };

  return (
    <span 
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function DiscountBadge({ originalPrice, currentPrice }) {
  if (!originalPrice || originalPrice <= currentPrice) return null;
  
  const discount = Math.round((1 - currentPrice / originalPrice) * 100);
  
  return (
    <Badge variant="sale" className="absolute top-2 left-2">
      -{discount}%
    </Badge>
  );
}

export function StockBadge({ stock, threshold = 5 }) {
  if (stock === undefined) return null;
  
  if (stock === 0) {
    return <Badge variant="default" className="absolute top-2 left-2">Hết hàng</Badge>;
  }
  
  if (stock <= threshold) {
    return (
      <Badge variant="warning" className="absolute top-2 left-2">
        Còn {stock} sản phẩm
      </Badge>
    );
  }
  
  return null;
}
