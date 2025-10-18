'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles, Check, X, Crown, Rocket, TrendingUp, Users, 
  Gift, Zap, Shield, Star, Award, Target, BarChart, MessageCircle,
  ArrowRight, Info
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface PackageFeature {
  name: string;
  basic: boolean | string;
  plus: boolean | string;
}

export default function SelectPackagePage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'bithrah_plus' | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const packages = [
    {
      id: 'basic',
      name: 'باقة Basic',
      nameEn: 'Basic Package',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      price: 'عمولة 6.5%',
      commission: 6.5,
      partnership: 0,
      description: 'للمشاريع التي تريد النشر والتمويل فقط',
      features: [
        'نشر المشروع على المنصة',
        'عرض في قائمة المشاريع',
        'استقبال التمويل من الداعمين',
        'لوحة تحكم أساسية',
        'تقارير مالية بسيطة',
        'دعم فني أساسي',
      ],
      notIncluded: [
        'الدعم والتوجيه',
        'الرفع في الصفحة الرئيسية',
        'أكواد الإحالة',
        'نظام المكافآت',
        'الدعم التسويقي',
        'الاستشارات المتخصصة',
      ]
    },
    {
      id: 'bithrah_plus',
      name: 'باقة بذرة Plus',
      nameEn: 'Bithrah Plus',
      icon: Crown,
      color: 'from-purple-500 via-pink-500 to-rose-500',
      price: 'عمولة 3% + شراكة 2%',
      commission: 3,
      partnership: 2,
      description: 'للمشاريع التي تريد النجاح المضمون مع الدعم الكامل',
      badge: 'الأكثر شعبية',
      features: [
        'كل مزايا الباقة الأساسية',
        'رفع المشروع في الصفحة الرئيسية',
        'نظام أكواد الإحالة الذكي',
        'نظام المكافآت والحوافز',
        'دعم تسويقي متكامل',
        'استشارات متخصصة',
        'دعم فني مميز 24/7',
        'تقارير تحليلية متقدمة',
        'أولوية في الظهور',
        'شارة "بذرة Plus" المميزة',
      ],
      extraBenefits: [
        'شراكة 2% مع المنصة',
        'دعم في التخطيط والتنفيذ',
        'مساعدة في التسويق والترويج',
        'نصائح لتحسين فرص النجاح',
      ]
    }
  ];

  const comparisonFeatures: PackageFeature[] = [
    { name: 'نشر المشروع', basic: true, plus: true },
    { name: 'استقبال التمويل', basic: true, plus: true },
    { name: 'لوحة التحكم', basic: 'أساسية', plus: 'متقدمة' },
    { name: 'التقارير المالية', basic: 'بسيطة', plus: 'تحليلية متقدمة' },
    { name: 'الدعم الفني', basic: 'أساسي', plus: 'مميز 24/7' },
    { name: 'الرفع في الصفحة الرئيسية', basic: false, plus: true },
    { name: 'أكواد الإحالة', basic: false, plus: true },
    { name: 'نظام المكافآت', basic: false, plus: true },
    { name: 'الدعم التسويقي', basic: false, plus: true },
    { name: 'الاستشارات المتخصصة', basic: false, plus: true },
    { name: 'أولوية الظهور', basic: false, plus: true },
    { name: 'شارة مميزة', basic: false, plus: true },
    { name: 'العمولة', basic: '6.5%', plus: '3%' },
    { name: 'الشراكة', basic: '0%', plus: '2%' },
  ];

  const handleSelectPackage = (packageId: 'basic' | 'bithrah_plus') => {
    setSelectedPackage(packageId);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      alert('يرجى اختيار باقة أولاً');
      return;
    }
    
    // Navigate to create project with selected package
    router.push(`/projects/create?package=${selectedPackage}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">اختر الباقة المناسبة لمشروعك</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ابدأ مشروعك بالطريقة الصحيحة
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك وأهدافك. يمكنك الترقية في أي وقت
            </p>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="mt-6 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <Info className="w-5 h-5" />
              {showComparison ? 'إخفاء' : 'عرض'} جدول المقارنة التفصيلي
            </button>
          </motion.div>

          {/* Comparison Table */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        المزايا
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-blue-600">
                        Basic
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-purple-600">
                        بذرة Plus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-right text-gray-900 font-medium">
                          {feature.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-700">{feature.basic}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof feature.plus === 'boolean' ? (
                            feature.plus ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-purple-700 font-semibold">{feature.plus}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              const isSelected = selectedPackage === pkg.id;
              const isPremium = pkg.id === 'bithrah_plus';
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 inline mr-1" />
                        {pkg.badge}
                      </div>
                    </div>
                  )}
                  
                  <div
                    onClick={() => handleSelectPackage(pkg.id as 'basic' | 'bithrah_plus')}
                    className={`
                      relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-300
                      ${isSelected 
                        ? 'ring-4 ring-purple-500 shadow-2xl scale-105' 
                        : 'hover:shadow-xl hover:scale-102 shadow-lg'
                      }
                      ${isPremium ? 'border-2 border-purple-200' : 'border-2 border-gray-100'}
                    `}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 left-4 bg-purple-500 text-white rounded-full p-2">
                        <Check className="w-5 h-5" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`
                      w-20 h-20 rounded-2xl bg-gradient-to-br ${pkg.color} 
                      flex items-center justify-center mb-6 mx-auto
                    `}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Package Name */}
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">
                      {pkg.name}
                    </h3>
                    
                    {/* Price */}
                    <div className={`
                      text-center mb-4 text-2xl font-bold
                      bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent
                    `}>
                      {pkg.price}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-center mb-6">
                      {pkg.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Extra Benefits for Plus */}
                    {pkg.extraBenefits && (
                      <div className="border-t-2 border-purple-100 pt-6 mt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-purple-500" />
                          <span className="font-bold text-purple-900">مزايا إضافية:</span>
                        </div>
                        <div className="space-y-3">
                          {pkg.extraBenefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Not Included (for Basic) */}
                    {pkg.notIncluded && (
                      <div className="border-t-2 border-gray-100 pt-6 mt-6">
                        <div className="text-sm text-gray-500 mb-3">غير متضمن:</div>
                        <div className="space-y-2">
                          {pkg.notIncluded.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 opacity-60">
                              <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-500">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Select Button */}
                    <button
                      className={`
                        w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all
                        ${isSelected
                          ? `bg-gradient-to-r ${pkg.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {isSelected ? 'تم الاختيار' : 'اختر هذه الباقة'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Continue Button */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <span>متابعة إنشاء المشروع</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

