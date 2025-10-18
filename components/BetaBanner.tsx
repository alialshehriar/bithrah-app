'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <AlertCircle size={18} className="flex-shrink-0 animate-pulse" />
        <p className="text-sm font-medium text-center">
          النسخة التجريبية - تحت التطوير | بيئة وساطة ذكية
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute left-4 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

