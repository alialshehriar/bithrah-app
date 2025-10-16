'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingPopup from '@/components/OnboardingPopup';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in by calling an API
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-purple-600 to-purple-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingPopup />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 via-purple-600 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">مرحباً بك في بذرة! 🎉</h1>
          <p className="text-xl mb-8">منصة التمويل الجماعي الرائدة في السعودية</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/projects')}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              استكشف المشاريع
            </button>
            <button
              onClick={() => router.push('/projects/create')}
              className="bg-purple-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-800 transition-all"
            >
              أنشئ مشروعك
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">استكشف المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => router.push('/dashboard')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">لوحة التحكم</h3>
            <p className="text-gray-600">إدارة حسابك ومشاريعك</p>
          </div>

          <div
            onClick={() => router.push('/communities')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">المجتمعات</h3>
            <p className="text-gray-600">انضم للمجتمعات وتواصل</p>
          </div>

          <div
            onClick={() => router.push('/events')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">الفعاليات</h3>
            <p className="text-gray-600">شارك في الفعاليات</p>
          </div>

          <div
            onClick={() => router.push('/leaderboard')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">لوحة الصدارة</h3>
            <p className="text-gray-600">تنافس واربح</p>
          </div>

          <div
            onClick={() => router.push('/messages')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">المحادثات</h3>
            <p className="text-gray-600">تواصل مع الآخرين</p>
          </div>

          <div
            onClick={() => router.push('/achievements')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">الإنجازات</h3>
            <p className="text-gray-600">اكسب الشارات والنقاط</p>
          </div>

          <div
            onClick={() => router.push('/wallet')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">المحفظة</h3>
            <p className="text-gray-600">إدارة أموالك</p>
          </div>

          <div
            onClick={() => router.push('/admin')}
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-xl font-bold mb-2 text-white">لوحة الإدارة</h3>
            <p className="text-purple-100">إدارة المنصة + Sandbox</p>
          </div>
        </div>
      </div>
    </div>
  );
}

