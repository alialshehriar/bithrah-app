'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('رمز التحقق غير موجود');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus('already_verified');
            setMessage(data.message);
          } else {
            setStatus('success');
            setMessage(data.message);
          }
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'حدث خطأ أثناء التحقق');
        }
      } catch (error) {
        setStatus('error');
        setMessage('حدث خطأ أثناء التحقق من البريد الإلكتروني');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">جاري التحقق...</h2>
            <p className="text-gray-600">يرجى الانتظار بينما نتحقق من بريدك الإلكتروني</p>
          </>
        )}

        {(status === 'success' || status === 'already_verified') && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'already_verified' ? 'تم التحقق مسبقاً!' : 'تم التحقق بنجاح! 🎉'}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {status === 'success' && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 font-medium text-sm">
                  🎁 تم تفعيل اشتراكك المجاني لمدة سنة كاملة!
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-6">سيتم توجيهك إلى صفحة تسجيل الدخول...</p>
            <Link
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              تسجيل الدخول الآن
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">فشل التحقق</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="block bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/signup"
                className="block bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
