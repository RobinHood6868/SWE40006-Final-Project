import React, { useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    info: <Info size={18} className="text-blue-500" />,
    warning: <AlertTriangle size={18} className="text-yellow-500" />,
    error: <AlertTriangle size={18} className="text-red-500" />,
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  return (
    <div className={twMerge(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]',
      'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg border',
      'animate-slideUp backdrop-blur-sm',
      backgrounds[type]
    )}>
      {icons[type]}
      <span className="text-sm font-medium text-gray-900">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
}
