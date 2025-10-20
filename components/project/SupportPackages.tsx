'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Check, Users, Clock, Gift, Star,
  Crown, Zap, Heart, Loader2, Shield
} from 'lucide-react';

interface SupportPackage {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  backers: number;
  maxBackers: number;
  level: 'basic' | 'premium' | 'vip';
}

interface SupportPackagesProps {
  projectId: number;
  packages: SupportPackage[];
}

export default function SupportPackages({ projectId, packages }: SupportPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const levelConfig = {
    basic: {
      gradient: 'from-teal-500 to-cyan-500',
      icon: Package,
      badge: 'أساسية'
    },
    premium: {
      gradient: 'from-purple-500 to-pink-500',
      icon: Star,
      badge: 'متوسطة'
    },
    vip: {
      gradient: 'from-orange-500 to-red-500',
      icon: Crown,
      badge: 'مميزة'
    }
  };

  const handleSupport = async (pkg: SupportPackage) => {
    setSelectedPackage(pkg.id);
    setProcessing(true);

    // محاكاة الدفع
    setTimeout(() => {
      alert('🎉 قريباً! سيتم إطلاق نظام الدفع في النسخة التجريبية القادمة');
      setProcessing(false);
      setSelectedPackage(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-teal-500 to-purple-500 rounded-xl">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">باقات الدعم</h2>
          <p className="text-gray-600">اختر الباقة المناسبة لك وادعم المشروع</p>
        </div>
      </div>

      <div className="grid gap-6">
        {packages.map((pkg, index) => {
          const config = levelConfig[pkg.level];
          const Icon = config.icon;
          const progress = (pkg.backers / pkg.maxBackers) * 100;
          const remaining = pkg.maxBackers - pkg.backers;
          const isProcessing = selectedPackage === pkg.id && processing;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative bg-white rounded-2xl shadow-lg overflow-hidden
                border-2 transition-all duration-300
                ${selectedPackage === pkg.id ? 'border-teal-500 shadow-2xl' : 'border-gray-100 hover:border-gray-200'}
              `}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">
                        {config.badge}
                      </div>
                      <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold">{pkg.price.toLocaleString('ar-SA')}</div>
                    <div className="text-sm opacity-90">ريال سعودي</div>
                  </div>
                </div>
                <p className="text-white/90">{pkg.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1 bg-gradient-to-br ${config.gradient} rounded-full`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{pkg.backers} داعم</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{remaining} مقعد متبقي</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.gradient} rounded-full`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {progress.toFixed(0)}% محجوز
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSupport(pkg)}
                  disabled={isProcessing || remaining === 0}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg
                    transition-all duration-300 transform
                    ${remaining === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isProcessing
                        ? 'bg-gray-400 text-white cursor-wait'
                        : `bg-gradient-to-r ${config.gradient} text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                    }
                  `}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري المعالجة...
                    </span>
                  ) : remaining === 0 ? (
                    'نفذت المقاعد'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      ادعم الآن
                    </span>
                  )}
                </button>
              </div>

              {/* Badge */}
              {remaining <= 5 && remaining > 0 && (
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                    <Zap className="w-3 h-3" />
                    {remaining} مقاعد فقط!
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-6 border border-teal-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Shield className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">ضمان استرداد المبلغ</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              إذا لم يصل المشروع لهدفه التمويلي، سيتم استرداد مبلغك بالكامل تلقائياً.
              جميع المعاملات آمنة ومحمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

