'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!isDemoMode || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-amber-800">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="font-semibold text-sm">
              نسخة تجريبية - جميع البيانات المعروضة هي بيانات وهمية للاختبار
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
            aria-label="إخفاء الإشعار"
          >
            <X size={18} className="text-amber-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

