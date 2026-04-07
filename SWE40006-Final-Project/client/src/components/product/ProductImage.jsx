import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export default function ProductImage({ src, alt, className, zoomOnHover = true }) {
  const [err, setErr] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const placeholder = 'https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=400&q=80';

  const handleMouseMove = (e) => {
    if (!zoomOnHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className={clsx('relative overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={err ? placeholder : src}
        alt={alt}
        className={clsx(
          'w-full h-full object-cover transition-transform duration-500',
          zoomOnHover && isHovered ? 'scale-150' : 'scale-100'
        )}
        style={zoomOnHover && isHovered ? {
          transformOrigin: `${position.x}% ${position.y}%`
        } : {}}
        onError={() => !err && setErr(true)}
        loading="lazy"
      />
    </div>
  );
}

export function ProductGallery({ images, currentImage, onChangeImage }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const allImages = images?.length > 0 ? images : [currentImage].filter(Boolean);
  
  if (allImages.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        <ProductImage 
          src={allImages[selectedImage]}
          alt="Product"
          className="w-full h-full"
          zoomOnHover={true}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={clsx(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImage === idx ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
