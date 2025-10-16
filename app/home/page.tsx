'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OnboardingPopup from '@/components/OnboardingPopup';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      <OnboardingPopup />
      
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

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/projects"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-purple-200"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-all">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">استكشف المشاريع</h3>
                <p className="text-slate-600">اكتشف مشاريع مبتكرة تبحث عن دعمك</p>
              </div>
            </div>
          </Link>

          <Link
            href="/projects/create"
            className="group bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">أنشئ مشروعك</h3>
                <p className="text-white/80">شارك فكرتك واحصل على التمويل</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">الأقسام الرئيسية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-blue-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">لوحة التحكم</h3>
            <p className="text-sm text-slate-600">إدارة حسابك ومشاريعك</p>
          </Link>

          {/* Communities */}
          <Link
            href="/communities"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-green-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">المجتمعات</h3>
            <p className="text-sm text-slate-600">انضم وتواصل مع الآخرين</p>
          </Link>

          {/* Events */}
          <Link
            href="/events"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-orange-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">الفعاليات</h3>
            <p className="text-sm text-slate-600">شارك في الفعاليات</p>
          </Link>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-yellow-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">لوحة الصدارة</h3>
            <p className="text-sm text-slate-600">تنافس واربح الجوائز</p>
          </Link>

          {/* Messages */}
          <Link
            href="/messages"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-pink-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">المحادثات</h3>
            <p className="text-sm text-slate-600">تواصل مع الآخرين</p>
          </Link>

          {/* Achievements */}
          <Link
            href="/achievements"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-indigo-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">الإنجازات</h3>
            <p className="text-sm text-slate-600">اكسب الشارات والنقاط</p>
          </Link>

          {/* Wallet */}
          <Link
            href="/wallet"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-emerald-500/30 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">المحفظة</h3>
            <p className="text-sm text-slate-600">إدارة أموالك</p>
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            className="group bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">لوحة الإدارة</h3>
            <p className="text-sm text-white/80">إدارة المنصة</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

