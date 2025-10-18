'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OnboardingPopup from '@/components/OnboardingPopup';
import { 
  Loader2, Sparkles, Search, Plus, TrendingUp, Users, 
  MessageSquare, Award, Wallet, BarChart3, Zap, Target,
  Brain, Rocket, Shield, Star
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
    fetch('/api/user/stats')
      .then(res => {
        if (!res.ok) {
          router.push('/auth/signin');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setUser(data);
          // Show onboarding for new users who haven't completed it
          if (data.onboardingCompleted === false) {
            setShowOnboarding(true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/auth/signin');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <OnboardingPopup 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">ب</span>
            </div>
            <span className="text-slate-900 text-2xl font-bold">بذرة</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-slate-600 hover:text-slate-900 transition-colors">
              الملف الشخصي
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">مرحباً بعودتك، {user?.name || 'مستخدم'}</h1>
          <p className="text-xl text-white/80">استكشف الفرص الجديدة وابدأ رحلتك نحو النجاح</p>
        </div>
      </div>

      {/* AI Evaluation - Featured Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-12">
        <Link
          href="/ai-evaluation"
          className="group block bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">تقييم الأفكار بالذكاء الاصطناعي</h2>
                  <p className="text-white/90 text-sm">الميزة الأكثر تطوراً في المنصة</p>
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6">
                احصل على تقييم شامل ودقيق لفكرة مشروعك باستخدام الذكاء الاصطناعي المتقدم. تحليل متعمق، توصيات احترافية، ونقاط قوة وضعف مفصلة.
              </p>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>تقييم فوري</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>دقة عالية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>سري وآمن</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/projects"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-purple-200"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">استكشف المشاريع</h3>
                <p className="text-slate-600">اكتشف مشاريع مبتكرة تبحث عن دعمك</p>
              </div>
            </div>
          </Link>

          <Link
            href="/projects/create"
            className="group bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">أنشئ مشروعك</h3>
                <p className="text-white/90">شارك فكرتك واحصل على التمويل</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* الأقسام الرئيسية */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">الأقسام الرئيسية</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { href: '/dashboard', icon: BarChart3, title: 'لوحة التحكم', desc: 'إدارة حسابك ومشاريعك', color: 'from-yellow-500 to-orange-500' },
            { href: '/communities', icon: Users, title: 'المجتمعات', desc: 'انضم وتواصل مع الآخرين', color: 'from-green-500 to-teal-500' },
            { href: '/events', icon: Star, title: 'الفعاليات', desc: 'شارك في الفعاليات', color: 'from-red-500 to-pink-500' },
            { href: '/leaderboard', icon: TrendingUp, title: 'لوحة الصدارة', desc: 'تنافس واربح الجوائز', color: 'from-blue-500 to-indigo-500' },
            { href: '/messages', icon: MessageSquare, title: 'المحادثات', desc: 'تواصل مع الآخرين', color: 'from-pink-500 to-rose-500' },
            { href: '/achievements', icon: Award, title: 'الإنجازات', desc: 'اكسب الشارات والنقاط', color: 'from-purple-500 to-violet-500' },
            { href: '/wallet', icon: Wallet, title: 'المحفظة', desc: 'إدارة أموالك', color: 'from-emerald-500 to-green-500' },
            { href: '/admin', icon: Shield, title: 'لوحة الإدارة', desc: 'إدارة المنصة', color: 'from-slate-700 to-slate-900' },
          ].map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-purple-200"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <section.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{section.title}</h3>
              <p className="text-sm text-slate-600">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

