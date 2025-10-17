'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import QuickEntryForm from '@/components/QuickEntryForm';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'normal' | 'quick'>('quick'); // Default to quick entry
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        return;
      }

      if (data.success) {
        window.location.href = '/home';
      } else {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quick entry submitted:', { name, email });
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/quick-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'حدث خطأ أثناء الدخول');
        return;
      }

      if (data.success) {
        window.location.href = '/home';
      } else {
        setError(data.error || 'حدث خطأ أثناء الدخول');
      }
    } catch (err) {
      console.error('Quick entry error:', err);
      setError('حدث خطأ أثناء الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-purple-600 to-purple-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <span className="text-4xl font-bold text-white">ب</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'quick' ? 'مرحباً بك في بذرة' : 'مرحباً بعودتك'}
          </h1>
          <p className="text-teal-100">
            {mode === 'quick' ? 'أدخل معلوماتك للدخول مباشرة' : 'سجّل دخولك للوصول إلى حسابك'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('quick')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                mode === 'quick'
                  ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              دخول سريع
            </button>
            <button
              type="button"
              onClick={() => setMode('normal')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                mode === 'normal'
                  ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              دخول عادي
            </button>
          </div>

          <form onSubmit={mode === 'quick' ? handleQuickEntry : handleNormalLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Quick Entry Mode */}
            {mode === 'quick' && (
              <QuickEntryForm />
            )}

            {/* Normal Login Mode */}
            {mode === 'normal' && (
              <>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="example@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-left">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-teal-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'quick' ? 'جاري الدخول...' : 'جاري تسجيل الدخول...'}
                </>
              ) : (
                mode === 'quick' ? 'دخول' : 'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Divider */}
          {mode === 'normal' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600">
                ليس لديك حساب؟{' '}
                <Link
                  href="/auth/register"
                  className="text-purple-600 hover:text-purple-700 font-bold"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-teal-100 text-sm mt-6">
          بالمتابعة، أنت توافق على{' '}
          <Link href="/terms" className="underline hover:text-white">
            الشروط والأحكام
          </Link>{' '}
          و{' '}
          <Link href="/privacy" className="underline hover:text-white">
            سياسة الخصوصية
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

