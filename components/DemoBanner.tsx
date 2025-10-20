'use client';

import { AlertCircle, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-amber-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-900 text-sm sm:text-base">
                🎯 نسخة تجريبية كاملة - جرّب بذرة قبل الإطلاق الرسمي
              </p>
              <p className="text-amber-700 text-xs sm:text-sm mt-0.5">
                جميع المعاملات افتراضية ولا تُخصم فعليًا • رصيدك التجريبي: 100,000 ريال
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/help/demo"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors text-sm font-medium"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">المساعدة</span>
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="إخفاء الإشعار"
            >
              <X size={18} className="text-amber-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

