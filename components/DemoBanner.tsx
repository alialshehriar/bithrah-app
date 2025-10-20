'use client';

import { Sparkles, X, Rocket } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-teal-500 via-purple-600 to-pink-500 sticky top-0 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <p className="font-bold text-base flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  النسخة التجريبية - اكتشف كامل ميزات المنصة
                </p>
                <p className="text-xs text-white/90 mt-0.5">
                  رصيد تجريبي 100,000 ريال • جميع الميزات متاحة • تجربة كاملة بدون قيود
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 group"
              aria-label="إخفاء البانر"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

