'use client';

import { AlertCircle } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>
          <strong>نسخة تجريبية</strong> - النسخة النهائية قريباً
        </span>
      </div>
    </div>
  );
}

