'use client';

import { useState, useEffect } from 'react';
import { Rocket, Gift, Users, Sparkles, Copy, Check, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function EarlySignupPage() {
  const searchParams = useSearchParams();
  const refCode = searchParams?.get('ref');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    referralCode: refCode || '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/early-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'early-signup-page',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, ...data });
        setFormData({ email: '', name: '', phone: '', referralCode: '' });
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      setResult({ success: false, error: 'فشل الاتصال بالخادم' });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (result?.signup?.ownReferralCode) {
      const link = `${window.location.origin}/early-signup?ref=${result.signup.ownReferralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14B8A6] via-[#0F9D8F] to-[#0D8B7F]" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6">
            <p className="text-white font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              التسجيل المبكر - الإطلاق التجريبي
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            كن من أوائل المستخدمين! 🚀
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            سجّل الآن واحصل على <span className="font-bold text-yellow-300">اشتراك مستثمر لمدة سنة كاملة مجاناً</span> بقيمة 2,388 ر.س
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">مميزات التسجيل المبكر:</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">اشتراك سنة مجاناً</h3>
                    <p className="text-white/80">احصل على جميع مميزات اشتراك المستثمر لمدة سنة كاملة</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-900" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">نظام الإحالة</h3>
                    <p className="text-white/80">احصل على سنة إضافية مجانية عن كل صديق تدعوه</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">أولوية الوصول</h3>
                    <p className="text-white/80">كن أول من يجرب الميزات الجديدة</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">دعم مباشر</h3>
                    <p className="text-white/80">دعم فني مباشر من فريق بذرة</p>
                  </div>
                </div>
              </div>
            </div>

            {refCode && (
              <div className="bg-yellow-400/20 backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-400">
                <p className="text-white font-bold text-center">
                  🎉 تم استخدام كود الإحالة: <span className="font-mono">{refCode}</span>
                </p>
                <p className="text-white/90 text-center text-sm mt-2">
                  أنت وصديقك ستحصلان على سنة إضافية مجانية!
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {!result?.success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Mail className="w-5 h-5 inline ml-2" />
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <User className="w-5 h-5 inline ml-2" />
                    الاسم (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="أحمد محمد"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Phone className="w-5 h-5 inline ml-2" />
                    رقم الجوال (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="+966 5X XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Gift className="w-5 h-5 inline ml-2" />
                    كود الإحالة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors font-mono"
                    placeholder="ABC123XYZ"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    إذا كان لديك كود إحالة من صديق، أدخله هنا
                  </p>
                </div>

                {result?.error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-bold">{result.error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] hover:from-[#0F9D8F] hover:to-[#0D8B7F] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    'جاري التسجيل...'
                  ) : (
                    <>
                      سجّل الآن
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">تم التسجيل بنجاح! 🎉</h2>
                  <p className="text-gray-600">
                    مرحباً بك في بذرة! سنرسل لك دعوة عند الإطلاق الرسمي.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] rounded-2xl p-6 text-white">
                  <p className="font-bold mb-4">كود الإحالة الخاص بك:</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <p className="text-3xl font-mono font-bold">{result.signup.ownReferralCode}</p>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className="w-full bg-white text-[#14B8A6] font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        تم النسخ!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        انسخ رابط الإحالة
                      </>
                    )}
                  </button>
                  <p className="text-sm text-white/80 mt-4">
                    شارك هذا الرابط مع أصدقائك واحصل على سنة إضافية مجانية عن كل إحالة!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({ email: '', name: '', phone: '', referralCode: '' });
                  }}
                  className="text-[#14B8A6] hover:text-[#0F9D8F] font-bold"
                >
                  تسجيل بريد آخر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
