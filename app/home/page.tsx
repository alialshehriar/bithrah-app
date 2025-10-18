'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import OnboardingPopup from '@/components/OnboardingPopup';

interface UserStats {
  id: number;
  name: string;
  email: string;
  role: string;
  onboardingCompleted: boolean;
  stats: {
    projects: number;
    backings: number;
  };
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = async (data: { username: string; interests: string[] }) => {
    try {
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          if (!data.onboardingCompleted) {
            setShowOnboarding(true);
          }
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg animate-pulse"></div>
            <p className="text-text-muted">جاري التحميل...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: 'تقييم الأفكار بالذكاء الاصطناعي',
      description: 'احصل على تقييم شامل وتحليل متقدم لفكرتك',
      icon: '🧠',
      href: '/ai-evaluation',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'الأكثر تطوراً',
    },
    {
      title: 'استكشف المشاريع',
      description: 'اكتشف مشاريع مبتكرة تبحث عن دعمك',
      icon: '🔍',
      href: '/projects',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'أنشئ مشروعك',
      description: 'شارك فكرتك واحصل على التمويل',
      icon: '🚀',
      href: '/projects/create',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const mainSections = [
    {
      title: 'لوحة الصدارة',
      description: 'تنافس واربح الجوائز',
      icon: '🏆',
      href: '/leaderboard',
      color: 'teal',
    },
    {
      title: 'الفعاليات',
      description: 'شارك في الفعاليات',
      icon: '📅',
      href: '/events',
      color: 'purple',
    },
    {
      title: 'المجتمعات',
      description: 'انضم وتواصل مع الآخرين',
      icon: '👥',
      href: '/communities',
      color: 'teal',
    },
    {
      title: 'لوحة التحكم',
      description: 'إدارة حسابك ومشاريعك',
      icon: '📊',
      href: '/dashboard',
      color: 'purple',
    },
  ];

  return (
    <MainLayout>
      <OnboardingPopup 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 glass-strong">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-teal blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              مرحباً بعودتك، <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-text-secondary text-lg mb-6">
              استكشف الفرص الجديدة وابدأ رحلتك نحو النجاح
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card/50">
                <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text-muted">مشاريعك</p>
                  <p className="text-lg font-bold text-text-primary">{user.stats.projects}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card/50">
                <div className="w-8 h-8 rounded-lg bg-purple/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text-muted">دعمك</p>
                  <p className="text-lg font-bold text-text-primary">{user.stats.backings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl p-6 glass hover:glass-strong transition-all duration-300 hover:scale-105 hover:shadow-luxury"
              >
                {action.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-purple/20 text-purple border border-purple/30">
                    {action.badge}
                  </span>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                  {action.icon}
                </div>
                
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:gradient-text transition-all duration-300">
                  {action.title}
                </h3>
                <p className="text-text-muted text-sm">{action.description}</p>
                
                <div className="mt-4 flex items-center gap-2 text-teal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>ابدأ الآن</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">الأقسام الرئيسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainSections.map((section, index) => (
              <Link
                key={index}
                href={section.href}
                className="card-luxury text-center group"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-${section.color}/10 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {section.icon}
                </div>
                <h3 className="font-bold text-text-primary mb-1">{section.title}</h3>
                <p className="text-sm text-text-muted">{section.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">مشاريع مميزة</h2>
            <Link href="/projects" className="text-teal hover:text-teal-400 text-sm font-medium flex items-center gap-1">
              <span>عرض الكل</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-luxury">
                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 mb-4 flex items-center justify-center">
                  <span className="text-6xl">🚀</span>
                </div>
                <h3 className="font-bold text-text-primary mb-2">مشروع مبتكر {i}</h3>
                <p className="text-sm text-text-muted mb-4">وصف قصير للمشروع وأهدافه الرئيسية</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">التقدم</span>
                    <span className="text-teal font-medium">75%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-bg-secondary overflow-hidden">
                    <div className="h-full w-3/4 gradient-bg"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted">تم جمع</p>
                    <p className="font-bold text-text-primary">75,000 ريال</p>
                  </div>
                  <button className="btn-primary text-sm py-2 px-4">
                    دعم المشروع
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

