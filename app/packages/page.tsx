'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Sparkles, Crown, Shield, TrendingUp, Users,
  BarChart3, Headphones, FileText, Zap, Star, ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface PlatformPackage {
  id: string;
  name: string;
  type: 'basic' | 'bithrah_plus';
  commissionPercentage: string;
  equityPercentage: string | null;
  features: string[];
  marketingSupport: boolean;
  consultingServices: boolean;
  freeAiEvaluations: number;
  priorityListing: boolean;
  advancedSupport: boolean;
  detailedReports: boolean;
  dedicatedAccountManager: boolean;
  color: string;
  icon: string;
  badge: string;
}

export default function PlatformPackagesPage() {
  const [packages, setPackages] = useState<PlatformPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/platform-packages');
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.packages.map((pkg: any) => ({
          ...pkg,
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
        })));
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageIcon = (type: string) => {
    if (type === 'basic') return Shield;
    if (type === 'bithrah_plus') return Crown;
    return Sparkles;
  };

  const getPackageGradient = (type: string) => {
    if (type === 'basic') return 'from-teal-500 to-teal-600';
    if (type === 'bithrah_plus') return 'from-purple-500 via-pink-500 to-purple-600';
    return 'from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">باقات المنصة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              اختر الباقة المناسبة لمشروعك
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              نقدم لك باقات مرنة تناسب احتياجات مشروعك، مع دعم شامل وخدمات احترافية لضمان نجاحك
            </p>
          </motion.div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const Icon = getPackageIcon(pkg.type);
            const gradient = getPackageGradient(pkg.type);
            const isPlus = pkg.type === 'bithrah_plus';

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group ${isPlus ? 'md:scale-105' : ''}`}
              >
                {/* Popular Badge */}
                {isPlus && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      الأكثر شعبية
                    </div>
                  </div>
                )}

                <div className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${
                  isPlus ? 'ring-2 ring-purple-500/50' : ''
                } hover:shadow-2xl hover:-translate-y-1`}>
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${gradient} p-8 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-12 h-12" />
                      <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {pkg.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl font-bold">{pkg.commissionPercentage}%</span>
                      <span className="text-white/80">عمولة</span>
                    </div>

                    {pkg.equityPercentage && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">+ {pkg.equityPercentage}% شراكة في المشروع</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="p-8">
                    <div className="space-y-4 mb-8">
                      {pkg.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`mt-1 p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 flex-1">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Additional Services */}
                    <div className="grid grid-cols-2 gap-3 mb-8 pt-6 border-t border-gray-200">
                      {pkg.marketingSupport && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-teal-600" />
                          <span>دعم تسويقي</span>
                        </div>
                      )}
                      {pkg.consultingServices && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Headphones className="w-4 h-4 text-teal-600" />
                          <span>استشارات</span>
                        </div>
                      )}
                      {pkg.freeAiEvaluations > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>{pkg.freeAiEvaluations} تقييم AI</span>
                        </div>
                      )}
                      {pkg.priorityListing && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <span>أولوية العرض</span>
                        </div>
                      )}
                      {pkg.detailedReports && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span>تقارير مفصلة</span>
                        </div>
                      )}
                      {pkg.dedicatedAccountManager && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>مدير حساب</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} 
                        hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group`}
                    >
                      <span>اختر هذه الباقة</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            مقارنة شاملة بين الباقات
          </h2>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-50 to-purple-50">
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الميزة</th>
                    {packages.map(pkg => (
                      <th key={pkg.id} className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">نسبة العمولة</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-teal-600">{pkg.commissionPercentage}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-medium">نسبة الشراكة</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {pkg.equityPercentage ? (
                          <span className="text-2xl font-bold text-purple-600">{pkg.equityPercentage}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">تقييمات AI مجانية</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-900">{pkg.freeAiEvaluations}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-medium">دعم تسويقي</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {pkg.marketingSupport ? (
                          <Check className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">خدمات استشارية</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {pkg.consultingServices ? (
                          <Check className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-medium">مدير حساب مخصص</td>
                    {packages.map(pkg => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {pkg.dedicatedAccountManager ? (
                          <Check className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

