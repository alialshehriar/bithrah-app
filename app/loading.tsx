import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-semibold">جاري التحميل...</p>
      </div>
    </div>
  );
}

