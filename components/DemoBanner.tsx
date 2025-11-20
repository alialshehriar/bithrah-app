'use client';

import { Sparkles, X, Wallet, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { demoConfig } from '@/lib/demo-config';
import { isDemoMode } from '@/lib/demo-mode';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Don't show banner if not in demo mode
  if (!isDemoMode() || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-b border-purple-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>تجربة بذرة التفاعلية الكاملة</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  <Wallet size={12} />
                  100,000 ر.س
                </span>
              </p>
              <p className="text-white/90 text-xs sm:text-sm mt-0.5">
                {demoConfig.messages.demoNotice}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm text-sm font-medium"
            >
              <Info size={16} />
              <span className="hidden sm:inline">المحفظة</span>
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 backdrop-blur-sm"
              aria-label="إخفاء الإشعار"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

