'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SupportPackage {
  id: number;
  name: string;
  description: string;
  amount: number;
  features: string[];
  max_backers: number | null;
  current_backers: number;
  is_active: boolean;
}

interface SupportPackagesProps {
  packages: SupportPackage[];
  projectId: number;
  onSupport: (packageId: number, amount: number) => void;
}

export default function SupportPackages({ packages, projectId, onSupport }: SupportPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const getPackageColor = (index: number) => {
    const colors = [
      { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700', button: 'bg-green-600 hover:bg-green-700' },
      { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-200', badge: 'bg-yellow-500', text: 'text-yellow-700', button: 'bg-yellow-600 hover:bg-yellow-700' },
      { bg: 'from-red-50 to-rose-50', border: 'border-red-200', badge: 'bg-red-500', text: 'text-red-700', button: 'bg-red-600 hover:bg-red-700' },
    ];
    return colors[index % colors.length];
  };

  const getPackageIcon = (index: number) => {
    const icons = ['🟢', '🟡', '🔴'];
    return icons[index % icons.length];
  };

  return (
    <div className="py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="text-4xl">💝</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            اختر كيف تدعم هذا المشروع
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            كل باقة مصممة لتمنحك قيمة فريدة ومكافآت حصرية
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg, index) => {
            const colors = getPackageColor(index);
            const icon = getPackageIcon(index);
            const isPopular = index === 1; // Middle package is popular
            const spotsLeft = pkg.max_backers ? pkg.max_backers - pkg.current_backers : null;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  isPopular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      الأكثر شعبية ⭐
                    </span>
                  </div>
                )}

                {/* Package Icon & Name */}
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">{pkg.amount.toLocaleString('ar-SA')}</span>
                    <span className="text-2xl text-gray-600">ريال</span>
                  </div>
                </div>

                {/* Spots Left */}
                {spotsLeft !== null && spotsLeft > 0 && (
                  <div className="text-center mb-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${colors.badge} text-white`}>
                      {spotsLeft} مقعد متبقي فقط
                    </span>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Support Button */}
                <button
                  onClick={() => onSupport(pkg.id, pkg.amount)}
                  disabled={!pkg.is_active || (spotsLeft !== null && spotsLeft <= 0)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${colors.button}`}
                >
                  {spotsLeft !== null && spotsLeft <= 0 ? 'نفذت المقاعد' : 'ادعم الآن'}
                </button>

                {/* Backers Count */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{pkg.current_backers}</span> داعم حتى الآن
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-2xl font-bold text-blue-900">ضمان استرداد كامل</h3>
          </div>
          <p className="text-blue-700 text-lg">
            إذا لم يصل المشروع لهدفه التمويلي، سيتم استرداد مبلغك بالكامل تلقائياً
          </p>
        </motion.div>
      </div>
    </div>
  );
}

