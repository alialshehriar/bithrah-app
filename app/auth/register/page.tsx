'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'حدث خطأ أثناء إنشاء الحساب');
      } else {
        setSuccess(true);
        // Show success message - user needs to verify email
        // No auto redirect - they need to check their email
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-purple-600 to-purple-800 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إنشاء الحساب بنجاح! 🎉</h2>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
            <p className="text-emerald-800 font-medium text-sm">
              🎁 حصلت على اشتراك مستثمر لمدة سنة كاملة مجاناً!
            </p>
          </div>
          <p className="text-gray-600 mb-4">
            تم إرسال رابط التحقق إلى بريدك الإلكتروني:
          </p>
          <p className="text-gray-900 font-medium mb-6">
            {formData.email}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            يرجى التحقق من بريدك الإلكتروني (وصندوق الرسائل غير المرغوب فيها) لتفعيل حسابك.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            العودة لتسجيل الدخول
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-purple-600 to-purple-800 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white text-2xl font-bold">ب</span>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
            <p className="text-gray-600">انضم إلى منصة بذرة الآن</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-right"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-right"
                  placeholder="اختر اسم مستخدم فريد"
                  pattern="[a-zA-Z0-9_]{3,20}"
                  title="يجب أن يكون اسم المستخدم من 3-20 حرف (حروف إنجليزية وأرقام و _ فقط)"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-right"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pr-10 pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">يجب أن تكون 8 أحرف على الأقل</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pr-10 pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Referral Code Field (Optional) */}
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                كود الإحالة (اختياري)
              </label>
              <div className="relative">
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-center uppercase"
                  placeholder="أدخل كود الإحالة إن وجد"
                  maxLength={10}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-center">
                احصل على سنة إضافية عند استخدام كود إحالة صديق
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 ml-2" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                'إنشاء حساب'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/auth/signin"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-white/80 text-sm"
        >
          بإنشاء حساب، أنت توافق على{' '}
          <Link href="/terms" className="underline hover:text-white">
            الشروط والأحكام
          </Link>
          {' '}و{' '}
          <Link href="/privacy" className="underline hover:text-white">
            سياسة الخصوصية
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

