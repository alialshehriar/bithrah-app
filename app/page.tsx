'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket, TrendingUp, Users, Sparkles, Shield, Award,
  Target, Heart, Zap, Crown, Star, ArrowLeft, CheckCircle,
  DollarSign, MessageCircle, BarChart3, Gift
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 1,
    totalFunding: 45000,
    activeUsers: 2,
    successRate: 95
  });

  useEffect(() => {
    // Safe initialization with error handling
    const initializePage = async () => {
      try {
        // Check auth status with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const response = await fetch('/api/auth/session', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            if (data?.user) {
              setIsLoggedIn(true);
            }
          }
        } catch (fetchError) {
          console.warn('Auth check failed:', fetchError);
          // Continue with default logged-out state
        }

        // Try to fetch stats with fallback
        try {
          const statsController = new AbortController();
          const statsTimeoutId = setTimeout(() => statsController.abort(), 5000);
          
          const statsRes = await fetch('/api/stats/platform', {
            signal: statsController.signal
          });
          clearTimeout(statsTimeoutId);
          
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData?.success && statsData?.stats) {
              setStats({
                totalProjects: Number(statsData.stats.totalProjects ?? 1),
                totalFunding: Number(statsData.stats.totalFunding ?? 45000),
                activeUsers: Number(statsData.stats.activeUsers ?? 2),
                successRate: Number(statsData.stats.successRate ?? 95)
              });
            }
          }
        } catch (statsError) {
          console.warn('Stats fetch failed, using defaults:', statsError);
          // Keep default stats
        }
      } catch (error) {
        console.error('Page initialization error:', error);
        // Keep defaults
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Rocket,
      title: 'إطلاق مشاريعك',
      description: 'أطلق مشروعك بسهولة واحصل على التمويل من المجتمع',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Users,
      title: 'مجتمع داعم',
      description: 'انضم لمجتمع من رواد الأعمال والمستثمرين',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      icon: Shield,
      title: 'آمن وموثوق',
      description: 'منصة آمنة ومرخصة لحماية استثماراتك',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      icon: TrendingUp,
      title: 'نمو مستمر',
      description: 'تتبع نمو مشاريعك وعوائدك بسهولة',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                حوّل أفكارك إلى{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#0F9A8A]">
                  واقع
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                منصة التمويل الجماعي الرائدة في السعودية. نربط بين أصحاب الأفكار والمستثمرين لتحويل الأحلام إلى مشاريع ناجحة.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/projects/create"
                  className="bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ابدأ مشروعك الآن
                </Link>
                <Link
                  href="/projects"
                  className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-gray-200"
                >
                  استكشف المشاريع
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { label: 'مشاريع نشطة', value: stats.totalProjects, icon: Rocket },
              { label: 'مستخدمون نشطون', value: stats.activeUsers, icon: Users },
              { label: 'إجمالي التمويل', value: `${stats.totalFunding.toLocaleString()} ر.س`, icon: DollarSign },
              { label: 'معدل النجاح', value: `${stats.successRate}%`, icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <stat.icon className="w-8 h-8 text-[#14B8A6] mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا بذرة؟
            </h2>
            <p className="text-xl text-gray-600">
              نوفر لك كل ما تحتاجه لإطلاق مشروعك الناجح
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              المشاريع المميزة
            </h2>
            <p className="text-xl text-gray-600">
              اكتشف أحدث المشاريع الواعدة
            </p>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      <Footer />
    </div>
  );
}
