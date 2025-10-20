'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, Lock, Shield, CheckCircle, AlertCircle, Clock, DollarSign, FileText, Sparkles } from 'lucide-react';

interface NegotiationSectionProps {
  projectId: number;
  projectTitle: string;
  negotiationEnabled: boolean;
  negotiationDeposit: number;
  currency: string;
  onStartNegotiation: (amount: number) => void;
}

export default function NegotiationSection({
  projectId,
  projectTitle,
  negotiationEnabled,
  negotiationDeposit,
  currency,
  onStartNegotiation,
}: NegotiationSectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [proposedAmount, setProposedAmount] = useState('');
  const [agreed, setAgreed] = useState(false);

  if (!negotiationEnabled) {
    return null;
  }

  const handleStartNegotiation = () => {
    const amount = parseFloat(proposedAmount);
    if (amount && amount >= negotiationDeposit) {
      onStartNegotiation(amount);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl shadow-xl overflow-hidden border-2 border-purple-200"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Handshake className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-bold">نظام التفاوض الاحترافي</h3>
            <p className="text-white/90 text-lg">تفاوض مباشرة مع صاحب المشروع</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">مبلغ التأمين</span>
            </div>
            <p className="text-2xl font-bold">{negotiationDeposit.toLocaleString()} {currency}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">حماية كاملة</span>
            </div>
            <p className="text-lg font-semibold">NDA + عقد رسمي</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">مدة التفاوض</span>
            </div>
            <p className="text-lg font-semibold">5 أيام</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Benefits */}
        <div className="mb-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            ماذا تحصل عند بدء التفاوض؟
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: FileText, title: 'الوصول الكامل للمشروع', desc: 'جميع التفاصيل والوثائق السرية' },
              { icon: Lock, title: 'اتفاقية سرية (NDA)', desc: 'حماية قانونية كاملة للطرفين' },
              { icon: Handshake, title: 'تفاوض مباشر', desc: 'تواصل مباشر مع صاحب المشروع' },
              { icon: Shield, title: 'ضمان استرداد التأمين', desc: 'يُسترد بالكامل عند إتمام الصفقة' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">{benefit.title}</h5>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-6">كيف يعمل النظام؟</h4>
          
          <div className="space-y-4">
            {[
              { step: 1, title: 'دفع مبلغ التأمين', desc: 'يُحجز المبلغ في محفظتك كضمان للجدية' },
              { step: 2, title: 'توقيع اتفاقية السرية', desc: 'حماية قانونية لجميع المعلومات المتبادلة' },
              { step: 3, title: 'الوصول الكامل', desc: 'تصفح جميع تفاصيل المشروع السرية' },
              { step: 4, title: 'التفاوض المباشر', desc: 'تواصل مع صاحب المشروع لمدة 5 أيام' },
              { step: 5, title: 'إتمام الصفقة', desc: 'عند الاتفاق، يُسترد مبلغ التأمين تلقائياً' },
            ].map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 mb-1">{step.title}</h5>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Negotiation Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-6">ابدأ التفاوض الآن</h4>
          
          <div className="space-y-6">
            {/* Proposed Amount */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                المبلغ المقترح للاستثمار
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  placeholder={`الحد الأدنى: ${negotiationDeposit.toLocaleString()}`}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-purple-500 focus:outline-none"
                  min={negotiationDeposit}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  {currency}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                * سيتم حجز {negotiationDeposit.toLocaleString()} {currency} كمبلغ تأمين قابل للاسترداد
              </p>
            </div>

            {/* Agreement Checkbox */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-6 h-6 mt-1 accent-purple-600"
                />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold mb-2">
                    أوافق على الشروط والأحكام
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• الالتزام باتفاقية السرية (NDA)</li>
                    <li>• عدم مشاركة أي معلومات سرية مع أطراف خارجية</li>
                    <li>• الجدية في التفاوض واحترام وقت صاحب المشروع</li>
                    <li>• مبلغ التأمين غير قابل للاسترداد في حالة خرق الاتفاقية</li>
                  </ul>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleStartNegotiation}
              disabled={!agreed || !proposedAmount || parseFloat(proposedAmount) < negotiationDeposit}
              className="w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Handshake className="w-6 h-6" />
              ابدأ التفاوض الآن
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-bold text-yellow-900 mb-2">تنبيه مهم</h5>
              <p className="text-yellow-800 text-sm leading-relaxed">
                نظام التفاوض مخصص للمستثمرين الجادين فقط. أي محاولة لسوء استخدام النظام أو خرق اتفاقية السرية
                سيؤدي إلى فقدان مبلغ التأمين بالكامل وإيقاف الحساب نهائياً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

