'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/home');
        router.refresh();
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setEmail('test@bithrah.com');
    setPassword('password123');
    
    setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/simple-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@bithrah.com', password: 'password123' }),
        });

        const data = await res.json();

        if (data.success) {
          router.push('/home');
          router.refresh();
        } else {
          setError(data.error || 'فشل تسجيل الدخول');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تسجيل الدخول');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">ب</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">تسجيل دخول تجريبي</h1>
            <p className="text-gray-400">للاختبار فقط</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">أو</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold hover:bg-blue-500/30 transition-all"
            >
              تسجيل دخول سريع (حساب تجريبي)
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-xl">
            <p className="text-gray-400 text-xs mb-2">بيانات الحساب التجريبي:</p>
            <p className="text-white text-sm font-mono">test@bithrah.com</p>
            <p className="text-white text-sm font-mono">password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

