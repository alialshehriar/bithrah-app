'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle2, AlertCircle, Loader2, Mail, Phone, User } from 'lucide-react';
import { createNDAAgreement, sendNDAOTP, verifyNDAOTP, getActiveNDATemplate, checkNDAStatus } from '@/app/actions/nda';

export default function NDAgreementPage() {
  const router = useRouter();
  const [step, setStep] = useState<'agreement' | 'signature' | 'otp'>('agreement');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User data (should come from session)
  const [userId] = useState(1); // TODO: Get from session
  
  // Form data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  
  // OTP data
  const [otp, setOtp] = useState('');
  const [agreementId, setAgreementId] = useState<number | null>(null);
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms' | 'both'>('both');
  
  // NDA content
  const [ndaContent, setNdaContent] = useState('');
  const [ndaTitle, setNdaTitle] = useState('');

  useEffect(() => {
    loadNDAContent();
    checkExistingNDA();
  }, []);

  const loadNDAContent = async () => {
    const template = await getActiveNDATemplate();
    setNdaContent(template.contentArabic || '');
    setNdaTitle(template.title || 'اتفاقية عدم الإفشاء والسرية');
  };

  const checkExistingNDA = async () => {
    const { hasSigned } = await checkNDAStatus(userId);
    if (hasSigned) {
      router.push('/');
    }
  };

  const handleAgree = () => {
    if (!agreed) {
      setError('يجب الموافقة على الاتفاقية للمتابعة');
      return;
    }
    setError('');
    setStep('signature');
  };

  const handleSignature = async () => {
    if (!fullName || !email || !phone || !signature) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createNDAAgreement({
        userId,
        fullName,
        email,
        phone,
        signatureType: 'typed',
        signatureData: signature,
      });

      if (result.success && result.agreementId) {
        setAgreementId(result.agreementId);
        
        // Send OTP
        const otpResult = await sendNDAOTP({
          agreementId: result.agreementId,
          userId,
          email,
          phone,
          method: otpMethod,
        });

        if (otpResult.success) {
          setSuccess('تم إرسال رمز التحقق بنجاح');
          setStep('otp');
        } else {
          setError(otpResult.error || 'فشل إرسال رمز التحقق');
        }
      } else {
        setError(result.error || 'فشل إنشاء الاتفاقية');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    if (!agreementId) {
      setError('خطأ في معرف الاتفاقية');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyNDAOTP({
        agreementId,
        userId,
        otp,
      });

      if (result.success) {
        // Set NDA cookie for 5 years
        document.cookie = `nda-accepted=true; path=/; max-age=${60 * 60 * 24 * 365 * 5}; SameSite=Lax`;
        
        setSuccess('تم التحقق بنجاح! جاري التوجيه...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error || 'فشل التحقق من الرمز');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {ndaTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            حماية حقوقك الفكرية والقانونية على أعلى مستوى
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <StepIndicator active={step === 'agreement'} completed={step !== 'agreement'} number={1} label="الاتفاقية" />
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700" />
            <StepIndicator active={step === 'signature'} completed={step === 'otp'} number={2} label="التوقيع" />
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700" />
            <StepIndicator active={step === 'otp'} completed={false} number={3} label="التحقق" />
          </div>
        </div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {step === 'agreement' && (
              <AgreementStep
                key="agreement"
                content={ndaContent}
                agreed={agreed}
                setAgreed={setAgreed}
                onNext={handleAgree}
              />
            )}
            {step === 'signature' && (
              <SignatureStep
                key="signature"
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                signature={signature}
                setSignature={setSignature}
                otpMethod={otpMethod}
                setOtpMethod={setOtpMethod}
                loading={loading}
                onNext={handleSignature}
                onBack={() => setStep('agreement')}
              />
            )}
            {step === 'otp' && (
              <OTPStep
                key="otp"
                otp={otp}
                setOtp={setOtp}
                loading={loading}
                onVerify={handleVerifyOTP}
                onBack={() => setStep('signature')}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span>محمي بتشفير من الدرجة العسكرية</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            جميع البيانات محمية وفقًا لأنظمة المملكة العربية السعودية
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ active, completed, number, label }: { active: boolean; completed: boolean; number: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
          completed
            ? 'bg-green-500 text-white'
            : active
            ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
        }`}
      >
        {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span className={`mt-2 text-xs font-medium ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}

// Agreement Step Component
function AgreementStep({ content, agreed, setAgreed, onNext }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6 text-right" dir="rtl">
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
      </div>

      <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-6">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
        />
        <label htmlFor="agree" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          أقر بأنني قرأت وفهمت جميع بنود اتفاقية عدم الإفشاء والسرية، وأوافق على الالتزام بها بشكل كامل. أدرك أن هذه الاتفاقية ملزمة قانونًا وأن خرقها يترتب عليه عقوبات قانونية.
        </label>
      </div>

      <button
        onClick={onNext}
        disabled={!agreed}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        المتابعة للتوقيع
      </button>
    </motion.div>
  );
}

// Signature Step Component
function SignatureStep({ fullName, setFullName, email, setEmail, phone, setPhone, signature, setSignature, otpMethod, setOtpMethod, loading, onNext, onBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-right">معلومات التوقيع</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">الاسم الكامل</label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-right"
              placeholder="أدخل اسمك الكامل"
              dir="rtl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-right"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">رقم الجوال</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-right"
              placeholder="+966 5XXXXXXXX"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">التوقيع الإلكتروني</label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-center font-signature text-2xl"
            placeholder="اكتب اسمك هنا"
            dir="rtl"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">سيتم استخدام هذا كتوقيعك الإلكتروني الرسمي</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">طريقة التحقق</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setOtpMethod('email')}
              className={`py-3 px-4 rounded-xl border-2 transition-all ${
                otpMethod === 'email'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <Mail className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">إيميل</span>
            </button>
            <button
              onClick={() => setOtpMethod('sms')}
              className={`py-3 px-4 rounded-xl border-2 transition-all ${
                otpMethod === 'sms'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <Phone className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">SMS</span>
            </button>
            <button
              onClick={() => setOtpMethod('both')}
              className={`py-3 px-4 rounded-xl border-2 transition-all ${
                otpMethod === 'both'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className="flex justify-center gap-1 mb-1">
                <Mail className="w-4 h-4" />
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs">كلاهما</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          رجوع
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            'إرسال رمز التحقق'
          )}
        </button>
      </div>
    </motion.div>
  );
}

// OTP Step Component
function OTPStep({ otp, setOtp, loading, onVerify, onBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تحقق من هويتك</h2>
        <p className="text-gray-600 dark:text-gray-400">
          أدخل رمز التحقق المكون من 6 أرقام المرسل إليك
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-4 text-center text-3xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white tracking-widest"
          placeholder="000000"
          maxLength={6}
          dir="ltr"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          رجوع
        </button>
        <button
          onClick={onVerify}
          disabled={loading || otp.length !== 6}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التحقق...
            </>
          ) : (
            'تحقق'
          )}
        </button>
      </div>

      <button className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline">
        إعادة إرسال الرمز
      </button>
    </motion.div>
  );
}

