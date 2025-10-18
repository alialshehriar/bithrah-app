'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../brand/Logo';
import { Sparkles, TrendingUp, Shield, Users, ArrowLeft, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'تقييم الأفكار بالذكاء الاصطناعي',
      description: 'احصل على تقييم شامل ودقيق لفكرتك في دقائق معدودة باستخدام أحدث تقنيات الذكاء الاصطناعي',
      stats: [
        { label: 'دقة عالية', value: 'تقييم دقيق بنسبة 98% باستخدام نماذج ذكاء اصطناعي متقدمة' },
        { label: 'تحليل شامل', value: '15+ معيار تقييم تشمل السوق والجدوى المالية والتنفيذ' },
        { label: 'سريع وفوري', value: 'احصل على نتائج التقييم في أقل من 5 دقائق' },
      ],
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'مشاريع مبتكرة',
      description: 'اكتشف مشاريع ريادية واعدة من رواد أعمال طموحين في السوق السعودي',
    },
    {
      icon: Shield,
      title: 'حماية متقدمة',
      description: 'نظام حماية ثلاثي المستويات مع اتفاقيات عدم إفشاء لضمان أمان أفكارك',
    },
    {
      icon: Users,
      title: 'مجتمع نشط',
      description: 'انضم لمجتمع من رواد الأعمال والمستثمرين والداعمين المتحمسين',
    },
  ];

  const stats = [
    { value: '1000+', label: 'مشروع ممول' },
    { value: '50M+', label: 'ريال تمويل' },
    { value: '5000+', label: 'مستثمر نشط' },
    { value: '98%', label: 'رضا المستخدمين' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo variant="white" size="xl" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              منصة <span className="text-yellow-300">بذرة</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-teal-50">
              بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي
            </p>
            
            <p className="text-lg md:text-xl mb-12 text-teal-100 max-w-3xl mx-auto">
              نربط أصحاب الأفكار المبتكرة بالداعمين والمستثمرين مع تقييم ذكي متقدم
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ai-evaluation"
                className="group px-8 py-4 bg-white text-teal-600 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                قيّم فكرتك بالذكاء الاصطناعي
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/projects"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                استكشف المشاريع
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-full mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">الميزة الأساسية</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              تقييم الأفكار بالذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              احصل على تقييم شامل ودقيق لفكرتك في دقائق معدودة باستخدام أحدث تقنيات الذكاء الاصطناعي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features[0].stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">{stat.label}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/ai-evaluation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ التقييم الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا بذرة؟</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2 text-yellow-300">{stat.value}</div>
                <div className="text-lg text-teal-50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            هل أنت مستعد لتحويل فكرتك إلى واقع؟
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            انضم إلى آلاف رواد الأعمال الذين حققوا أحلامهم مع بذرة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              ابدأ الآن
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-200"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

