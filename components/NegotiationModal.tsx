'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, CheckCircle, AlertCircle, Clock, Shield, DollarSign, Calendar } from 'lucide-react';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: number;
  projectTitle: string;
  depositAmount: number;
}

export default function NegotiationModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectTitle,
  depositAmount,
}: NegotiationModalProps) {
  const [step, setStep] = useState<'info' | 'confirm' | 'payment' | 'success'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [negotiationId, setNegotiationId] = useState<number | null>(null);

  const handleOpenNegotiation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/negotiations/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (data.success) {
        setNegotiationId(data.negotiation.id);
        setStep('payment');
      } else {
        setError(data.error || 'حدث خطأ أثناء فتح التفاوض');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!negotiationId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/negotiations/open', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          negotiationId,
          paymentConfirmed: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'حدث خطأ أثناء تأكيد الدفع');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
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
              <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">فتح بوابة التفاوض</h2>
                      <p className="text-white/90 text-sm mt-1">
                        {projectTitle}
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
              <div className="p-6">
                {step === 'info' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        كيف يعمل نظام التفاوض؟
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              1. دفع مبلغ الجدية
                            </h4>
                            <p className="text-sm text-gray-600">
                              مبلغ قابل للاسترداد بالكامل عند إلغاء التفاوض أو رفضه من قبل صاحب المشروع
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              2. الوصول الكامل للتفاصيل
                            </h4>
                            <p className="text-sm text-gray-600">
                              بعد الدفع، ستحصل على وصول فوري لجميع التفاصيل السرية والمستندات الكاملة
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              3. فترة التفاوض (3 أيام)
                            </h4>
                            <p className="text-sm text-gray-600">
                              لديك 3 أيام للتفاوض مع صاحب المشروع والوصول إلى اتفاق
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              4. النتيجة
                            </h4>
                            <p className="text-sm text-gray-600">
                              عند الاتفاق: يتم الاستثمار وفق الشروط المتفق عليها<br />
                              عند الرفض/الإلغاء: يُسترد مبلغ الجدية بالكامل
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deposit Amount */}
                    <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">مبلغ الجدية المطلوب</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {depositAmount.toLocaleString('ar-SA')} <span className="text-xl">ريال</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            قابل للاسترداد بالكامل
                          </p>
                        </div>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">
                            تنبيه مهم
                          </p>
                          <p className="text-sm text-amber-800">
                            سيتم كشف أي محاولة للتواصل خارج المنصة تلقائياً بواسطة الذكاء الاصطناعي، وسيؤدي ذلك إلى إلغاء التفاوض وعدم استرداد مبلغ الجدية.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => setStep('confirm')}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Handshake className="w-5 h-5" />
                        <span>متابعة</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Handshake className="w-10 h-10 text-purple-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        تأكيد فتح التفاوض
                      </h3>
                      <p className="text-gray-600 mb-8">
                        هل أنت متأكد من رغبتك في فتح بوابة التفاوض لهذا المشروع؟
                      </p>

                      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-right">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">المشروع</span>
                          <span className="font-semibold text-gray-900">{projectTitle}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">مبلغ الجدية</span>
                          <span className="font-semibold text-gray-900">
                            {depositAmount.toLocaleString('ar-SA')} ريال
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">مدة التفاوض</span>
                          <span className="font-semibold text-gray-900">3 أيام</span>
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <p className="text-sm text-red-700">{error}</p>
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep('info')}
                          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          رجوع
                        </button>
                        <button
                          onClick={handleOpenNegotiation}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>جاري الفتح...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>تأكيد وفتح التفاوض</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <DollarSign className="w-10 h-10 text-teal-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        دفع مبلغ الجدية
                      </h3>
                      <p className="text-gray-600 mb-8">
                        يرجى دفع مبلغ الجدية لتفعيل التفاوض والوصول إلى التفاصيل الكاملة
                      </p>

                      <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-8 mb-8">
                        <p className="text-4xl font-bold text-gray-900 mb-2">
                          {depositAmount.toLocaleString('ar-SA')} <span className="text-2xl">ريال</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          قابل للاسترداد بالكامل
                        </p>
                      </div>

                      {/* Payment Gateway Integration - Coming Soon */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                        <p className="text-sm text-amber-900 font-semibold mb-2">
                          بوابة الدفع قريباً
                        </p>
                        <p className="text-sm text-amber-800">
                          سيتم إطلاق النسخة التجريبية قريباً مع بوابة دفع آمنة ومتكاملة
                        </p>
                      </div>

                      {/* Demo: Simulate Payment Success */}
                      <div className="flex gap-3">
                        <button
                          onClick={onClose}
                          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={handlePaymentSuccess}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>جاري التأكيد...</span>
                            </>
                          ) : (
                            <>
                              <span>محاكاة الدفع (تجريبي)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      تم فتح التفاوض بنجاح
                    </h3>
                    <p className="text-gray-600 mb-4">
                      يمكنك الآن الوصول إلى جميع التفاصيل السرية والبدء في التفاوض
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>مدة التفاوض: 3 أيام</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

