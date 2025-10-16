'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface NDAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  projectId?: number;
}

export default function NDAModal({ isOpen, onClose, onSign, projectId }: NDAModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSign = async () => {
    if (!agreed) {
      setError('يجب الموافقة على الشروط أولاً');
      return;
    }

    setIsSigning(true);
    setError('');

    try {
      const response = await fetch('/api/nda/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementType: projectId ? 'project' : 'platform',
          projectId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSign();
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'حدث خطأ أثناء التوقيع');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">اتفاقية عدم الإفشاء</h2>
                      <p className="text-white/90 text-sm mt-1">
                        حماية الملكية الفكرية والمعلومات السرية
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      تم التوقيع بنجاح
                    </h3>
                    <p className="text-gray-600">
                      يمكنك الآن الوصول إلى التفاصيل الكاملة للمشروع
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="prose prose-sm max-w-none" dir="rtl">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        1. المقدمة
                      </h3>
                      <p className="text-gray-700 mb-4">
                        بموافقتك على هذه الاتفاقية، فإنك تقر وتوافق على الالتزام بشروط السرية التالية عند استخدام منصة بذرة.
                      </p>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        2. التعريفات
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li>
                          <strong>المعلومات السرية:</strong> تشمل جميع الأفكار والمشاريع والخطط والبيانات المالية والمعلومات التجارية المعروضة على المنصة.
                        </li>
                        <li>
                          <strong>المستخدم:</strong> أي شخص يقوم بالتسجيل واستخدام منصة بذرة.
                        </li>
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        3. الالتزامات
                      </h3>
                      <p className="text-gray-700 mb-2">أنت توافق على:</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li>
                          <strong>عدم الإفشاء:</strong> عدم الكشف عن أي معلومات سرية لأي طرف ثالث دون إذن كتابي مسبق من صاحب المشروع.
                        </li>
                        <li>
                          <strong>عدم الاستخدام:</strong> عدم استخدام المعلومات السرية لأي غرض خارج نطاق المنصة.
                        </li>
                        <li>
                          <strong>الحماية:</strong> اتخاذ جميع الإجراءات المعقولة لحماية سرية المعلومات.
                        </li>
                        <li>
                          <strong>عدم النسخ:</strong> عدم نسخ أو استنساخ أو تقليد أي فكرة أو مشروع معروض على المنصة.
                        </li>
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        4. الاستثناءات
                      </h3>
                      <p className="text-gray-700 mb-2">
                        لا تنطبق التزامات السرية على المعلومات التي:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li>كانت معروفة للعامة قبل الإفشاء</li>
                        <li>أصبحت معروفة للعامة دون خرق هذه الاتفاقية</li>
                        <li>تم الحصول عليها بشكل قانوني من طرف ثالث</li>
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        5. مدة الاتفاقية
                      </h3>
                      <p className="text-gray-700 mb-4">
                        تظل هذه الاتفاقية سارية المفعول طالما أنك مستخدم نشط على المنصة، ولمدة <strong>5 سنوات</strong> بعد إنهاء استخدامك للمنصة.
                      </p>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        6. العواقب القانونية
                      </h3>
                      <p className="text-gray-700 mb-2">
                        أي خرق لهذه الاتفاقية قد يؤدي إلى:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li>إيقاف حسابك على المنصة</li>
                        <li>اتخاذ إجراءات قانونية</li>
                        <li>المطالبة بالتعويضات</li>
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">
                        7. القانون الساري
                      </h3>
                      <p className="text-gray-700 mb-4">
                        تخضع هذه الاتفاقية للقوانين السارية في المملكة العربية السعودية.
                      </p>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => {
                            setAgreed(e.target.checked);
                            setError('');
                          }}
                          className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          أقر بأنني قرأت وفهمت وأوافق على الالتزام بجميع الشروط المذكورة في اتفاقية عدم الإفشاء، وأتعهد بحماية سرية جميع المعلومات التي سأطلع عليها.
                        </span>
                      </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!success && (
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSign}
                    disabled={!agreed || isSigning}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSigning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>جاري التوقيع...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>توقيع الاتفاقية</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

