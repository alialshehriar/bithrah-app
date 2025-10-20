import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl font-bold text-[#14B8A6] mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          الصفحة غير موجودة
        </h1>
        
        <p className="text-gray-600 mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            الصفحة الرئيسية
          </Link>
          
          <Link
            href="/projects"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            تصفح المشاريع
          </Link>
        </div>
      </div>
    </div>
  );
}

