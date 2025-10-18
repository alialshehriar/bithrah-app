'use client';

import { useState } from 'react';
import { Sparkles, Database, ArrowRight } from 'lucide-react';

interface ModeSelectionProps {
  onSelect: (mode: 'production' | 'sandbox') => void;
}

export default function ModeSelection({ onSelect }: ModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<'production' | 'sandbox' | null>(null);

  const modes = [
    {
      id: 'production' as const,
      title: 'الوضع الحقيقي',
      subtitle: 'تجربة حقيقية بدون بيانات وهمية',
      description: 'ابدأ رحلتك الحقيقية في بذرة. أنشئ مشاريع حقيقية، تواصل مع مستثمرين حقيقيين، وابنِ شبكتك الخاصة.',
      icon: Sparkles,
      gradient: 'from-teal-500 to-emerald-500',
      features: [
        'إنشاء مشاريع حقيقية',
        'التواصل مع مستثمرين حقيقيين',
        'بناء شبكة علاقات حقيقية',
        'تمويل جماعي حقيقي'
      ]
    },
    {
      id: 'sandbox' as const,
      title: 'وضع التجربة (Sandbox)',
      subtitle: 'استكشف جميع الميزات ببيانات تجريبية',
      description: 'جرّب جميع ميزات المنصة بحرية مع بيانات تجريبية كاملة. مثالي للتعرف على المنصة قبل البدء الحقيقي.',
      icon: Database,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'مشاريع تجريبية متنوعة',
        'محادثات ومجتمعات تجريبية',
        'نظام دعم وتفاوض تجريبي',
        'جميع الميزات متاحة للتجربة'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 z-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              بذرة
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            مرحباً بك في منصة بذرة
          </h2>
          <p className="text-lg text-gray-600">
            اختر الوضع المناسب لك للبدء
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  relative p-8 rounded-3xl text-right transition-all duration-300
                  ${isSelected 
                    ? 'bg-white shadow-2xl scale-105 ring-4 ring-teal-500 ring-opacity-50' 
                    : 'bg-white shadow-lg hover:shadow-xl hover:scale-102'
                  }
                `}
              >
                {/* Gradient Border */}
                <div className={`
                  absolute inset-0 rounded-3xl bg-gradient-to-r ${mode.gradient} opacity-0
                  ${isSelected ? 'opacity-10' : ''}
                  transition-opacity duration-300
                `} />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className={`
                    inline-flex p-4 rounded-2xl mb-4
                    bg-gradient-to-r ${mode.gradient}
                  `}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {mode.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    {mode.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`
                          w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mode.gradient}
                        `} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-teal-600">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      <span className="text-sm font-medium">تم الاختيار</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedMode && (
          <div className="flex justify-center">
            <button
              onClick={() => onSelect(selectedMode)}
              className="
                group px-8 py-4 rounded-2xl
                bg-gradient-to-r from-teal-500 to-purple-500
                text-white font-bold text-lg
                shadow-lg hover:shadow-xl
                transform hover:scale-105
                transition-all duration-300
                flex items-center gap-3
              "
            >
              <span>ابدأ الآن</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          يمكنك التبديل بين الوضعين في أي وقت من إعدادات الحساب
        </p>
      </div>
    </div>
  );
}

