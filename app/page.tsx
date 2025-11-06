'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, Users, Shield, Zap, ArrowLeft,
  Rocket, Target, Heart, Award, CheckCircle, Star
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  const [stats, setStats] = useState({
    projects: 0,
    funding: 0,
    users: 0,
    communities: 0
  });

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/platform');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats({
              projects: data.stats.totalProjects || 0,
              funding: data.stats.totalFunding || 0,
              users: data.stats.activeUsers || 0,
              communities: data.stats.totalCommunities || 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-full border border-teal-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                مدعوم بالذكاء الاصطناعي GPT-4
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              حوّل{' '}
              <span className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                أفكارك
              </span>
              {' '}إلى{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                واقع
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              بذره تربط أصحاب الأفكار والمستثمرين في بيئة وساطة سعودية ذكية تعتمد على الذكاء الاصطناعي لتقييم الأفكار وتحفيز التمويل الآمن
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/evaluate"
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>قيّم فكرتك بالذكاء الاصطناعي</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-teal-500 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                <span>استكشف المشاريع</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-teal-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.projects}
                </div>
                <div className="text-sm text-gray-600 font-medium">مشاريع نشطة</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-teal-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {(stats.funding / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600 font-medium">ريال تمويل</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-teal-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.users}
                </div>
                <div className="text-sm text-gray-600 font-medium">مستخدمون نشطون</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-teal-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.communities}
                </div>
                <div className="text-sm text-gray-600 font-medium">مجتمعات فعالة</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Evaluation Feature Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-teal-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">الميزة الرئيسية</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              تقييم الأفكار بالذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              احصل على تقييم شامل ودقيق لفكرتك الاستثمارية من 6 منظورات مختلفة باستخدام GPT-4
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'تحليل استراتيجي',
                description: 'تقييم الرؤية الاستراتيجية والتموضع في السوق',
                color: 'from-teal-500 to-cyan-500'
              },
              {
                icon: TrendingUp,
                title: 'جدوى مالية',
                description: 'تحليل نموذج الإيرادات والجدوى المالية',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Shield,
                title: 'تحليل المخاطر',
                description: 'تحديد وتقييم المخاطر المحتملة',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Users,
                title: 'السوق السعودي',
                description: 'تحليل الملاءمة للسوق المحلي',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Zap,
                title: 'قابلية التنفيذ',
                description: 'تقييم الموارد والجدول الزمني',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Rocket,
                title: 'استراتيجية النمو',
                description: 'تحليل خطة التسويق والنمو',
                color: 'from-yellow-500 to-amber-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-teal-500 transition-all duration-300 hover:shadow-xl group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/evaluate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>ابدأ التقييم الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Bithrah Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              لماذا بذرة؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              منصة متكاملة تجمع بين التقنية والذكاء الاصطناعي لتحويل الأفكار إلى مشاريع ناجحة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'ذكاء اصطناعي متقدم',
                description: 'تقييم دقيق للأفكار باستخدام GPT-4 من OpenAI'
              },
              {
                icon: Shield,
                title: 'تفاوض آمن',
                description: 'نظام تفاوض محمي باتفاقية سرية (NDA)'
              },
              {
                icon: Heart,
                title: 'باقات دعم مرنة',
                description: 'خيارات دعم متنوعة تناسب جميع المستثمرين'
              },
              {
                icon: Award,
                title: 'مجتمعات نشطة',
                description: 'تواصل مع رواد الأعمال والمستثمرين'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Star className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              جاهز لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              انضم إلى مجتمع بذرة اليوم واحصل على تقييم مجاني لفكرتك بالذكاء الاصطناعي
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/evaluate"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>ابدأ الآن مجاناً</span>
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                <span>استكشف المشاريع</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

