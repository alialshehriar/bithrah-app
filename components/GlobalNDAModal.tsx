'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Shield, CheckCircle } from 'lucide-react';

export default function GlobalNDAModal() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // Routes that don't require NDA
    const exemptRoutes = ['/nda-agreement', '/auth', '/api'];
    const isExempt = exemptRoutes.some(route => pathname.startsWith(route));

    if (isExempt) {
      return;
    }

    // Check for NDA cookie
    const cookies = document.cookie.split(';');
    const ndaCookie = cookies.find(c => c.trim().startsWith('nda-accepted='));
    const hasNDA = ndaCookie?.includes('true');

    if (!hasNDA) {
      setShowModal(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pathname]);

  const handleAccept = () => {
    if (!agreed) return;

    // Set cookie for 5 years
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);
    document.cookie = `nda-accepted=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    setShowModal(false);
    document.body.style.overflow = 'unset';
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Shield className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">اتفاقية عدم الإفشاء والسرية</h2>
          <p className="text-center text-purple-100">حماية حقوقك الفكرية والقانونية على أعلى مستوى</p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[50vh]">
          <div className="prose prose-sm max-w-none text-right" dir="rtl">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              بالدخول إلى منصة <strong>بذرة</strong>، أنت توافق على الالتزام التام بحماية سرية جميع المعلومات والأفكار والمشاريع المعروضة على المنصة.
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3">التزاماتك الأساسية:</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✓ <strong>الحفاظ على السرية التامة</strong> لجميع المعلومات التي تطلع عليها</li>
                <li>✓ <strong>عدم الإفشاء</strong> لأي معلومات سرية لأي طرف ثالث</li>
                <li>✓ <strong>عدم الاستخدام</strong> للمعلومات لأي غرض خارج نطاق المنصة</li>
                <li>✓ <strong>عدم النسخ أو التسجيل</strong> لأي معلومات دون إذن صريح</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-3">العقوبات في حالة الخرق:</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• إيقاف الحساب فورًا دون إشعار مسبق</li>
                <li>• المطالبة بتعويضات مالية عن الأضرار</li>
                <li>• اتخاذ الإجراءات القانونية وفقًا لأنظمة المملكة</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>مدة الاتفاقية:</strong> تظل سارية المفعول طوال فترة استخدام المنصة ولمدة 5 سنوات بعد انتهاء الاستخدام.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              أقر بأنني قرأت وفهمت جميع بنود اتفاقية عدم الإفشاء والسرية، وأوافق على الالتزام بها بشكل كامل. 
              أدرك أن هذه الاتفاقية ملزمة قانونًا وأن خرقها يترتب عليه عقوبات قانونية.
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!agreed}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              agreed
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {agreed ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                أوافق وأدخل المنصة
              </span>
            ) : (
              'يرجى قراءة الاتفاقية والموافقة عليها'
            )}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            🔒 محمي بتشفير من الدرجة العسكرية • جميع البيانات محمية وفقًا لأنظمة المملكة
          </p>
        </div>
      </div>
    </div>
  );
}

