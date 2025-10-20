'use client';

import { getNegotiationData, sendNegotiationMessage } from '@/app/actions/negotiations';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Shield, Clock, DollarSign, CheckCircle,
  AlertCircle, Lock, FileText, MessageCircle, User, Calendar,
  Target, TrendingUp, Sparkles
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  slug: string;
  fundingGoal: number;
  currentAmount: number;
  owner: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface Negotiation {
  id: number;
  uuid: string;
  status: string;
  startDate: string;
  endDate: string;
  depositAmount: number;
  depositStatus: string;
  hasFullAccess: boolean;
  agreedAmount: number | null;
  agreementTerms: string | null;
  agreementReached: boolean;
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderAvatar: string | null;
  createdAt: string;
  status: string;
}

export default function NegotiatePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [startingNegotiation, setStartingNegotiation] = useState(false);

  // حساب مبلغ التأمين تلقائياً (1% من هدف التمويل، بحد أدنى 1000 ريال)
  const depositAmount = project ? Math.max(Math.round(project.fundingGoal * 0.01), 1000) : 5000;

  useEffect(() => {
    fetchNegotiationData();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchNegotiationData = async () => {
    try {
      setLoading(true);
      const data = await getNegotiationData(projectId as string);

      if (data.success) {
        setProject(data.project);
        setNegotiation(data.negotiation);
        setMessages(data.messages || []);
      } else {
        setError(data.error || 'فشل في تحميل بيانات التفاوض');
      }
    } catch (error) {
      console.error('Error fetching negotiation:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNegotiation = async () => {
    if (!agreedToTerms) {
      alert('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setStartingNegotiation(true);
    try {
      // TODO: إنشاء جلسة تفاوض جديدة
      // سيتم تنفيذ هذا عبر Server Action
      alert(`سيتم خصم ${depositAmount.toLocaleString()} ر.س كمبلغ تأمين قابل للاسترداد`);
      
      // بعد النجاح، إعادة تحميل البيانات
      await fetchNegotiationData();
    } catch (error) {
      console.error('Error starting negotiation:', error);
      alert('حدث خطأ أثناء بدء التفاوض');
    } finally {
      setStartingNegotiation(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !negotiation) return;

    setSending(true);
    try {
      const result = await sendNegotiationMessage(
        negotiation.uuid,
        newMessage,
        1 // TODO: استخدام معرف المستخدم الحقيقي من الجلسة
      );

      if (result.success) {
        setNewMessage('');
        await fetchNegotiationData();
      } else {
        alert(result.error || 'فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error || 'المشروع غير موجود'}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك تفاوض نشط، عرض صفحة بدء التفاوض
  if (!negotiation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للمشروع</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start gap-6 mb-6">
                {project.owner.avatar ? (
                  <img
                    src={project.owner.avatar}
                    alt={project.owner.name}
                    className="w-20 h-20 rounded-full border-4 border-teal-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center border-4 border-teal-200">
                    <span className="text-2xl font-bold text-teal-600">
                      {project.owner.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                  <p className="text-gray-600">صاحب المشروع: {project.owner.name}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>الهدف: {project.fundingGoal.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>المجموع: {project.currentAmount.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Negotiation Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-2xl p-8 text-white mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">نظام التفاوض الاحترافي</h2>
            </div>
            <p className="text-white/90 text-lg mb-6">
              تفاوض مباشرة مع صاحب المشروع في بيئة آمنة ومحمية قانونياً
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <DollarSign className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/70 mb-1">مبلغ التأمين</p>
                <p className="text-2xl font-bold">{depositAmount.toLocaleString()} ر.س</p>
                <p className="text-xs text-white/60 mt-1">قابل للاسترداد بالكامل</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Lock className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/70 mb-1">حماية كاملة</p>
                <p className="text-lg font-bold">NDA + عقد رسمي</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Clock className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/70 mb-1">مدة التفاوض</p>
                <p className="text-2xl font-bold">5 أيام</p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-600" />
              ماذا تحصل عند بدء التفاوض؟
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">الوصول الكامل للمشروع</h4>
                  <p className="text-gray-600 text-sm">جميع التفاصيل والوثائق السرية</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">اتفاقية سرية (NDA)</h4>
                  <p className="text-gray-600 text-sm">حماية قانونية كاملة للطرفين</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">تفاوض مباشر</h4>
                  <p className="text-gray-600 text-sm">تواصل مباشر مع صاحب المشروع</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">ضمان استرداد التأمين</h4>
                  <p className="text-gray-600 text-sm">يُسترد بالكامل عند إتمام الصفقة</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">كيف يعمل النظام؟</h3>

            <div className="space-y-4">
              {[
                { step: 1, title: 'دفع مبلغ التأمين', desc: 'يُحجز المبلغ في محفظتك كضمان للجدية' },
                { step: 2, title: 'توقيع اتفاقية السرية', desc: 'حماية قانونية لجميع المعلومات المتبادلة' },
                { step: 3, title: 'الوصول الكامل', desc: 'تصفح جميع تفاصيل المشروع السرية' },
                { step: 4, title: 'التفاوض المباشر', desc: 'تواصل مع صاحب المشروع لمدة 5 أيام' },
                { step: 5, title: 'إتمام الصفقة', desc: 'عند الاتفاق، يُسترد مبلغ التأمين تلقائياً' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Start Negotiation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">ابدأ التفاوض الآن</h3>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">مبلغ التأمين المطلوب</h4>
                  <p className="text-yellow-800 mb-3">
                    سيتم حجز <strong>{depositAmount.toLocaleString()} ر.س</strong> من محفظتك كمبلغ تأمين قابل للاسترداد.
                    يتم حساب المبلغ تلقائياً بنسبة 1% من هدف تمويل المشروع.
                  </p>
                  <p className="text-sm text-yellow-700">
                    💡 هذا المبلغ يُسترد بالكامل عند إتمام التفاوض أو انتهاء المدة
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                أوافق على الشروط والأحكام
              </h4>
              <ul className="space-y-2 text-sm text-orange-800 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>الالتزام باتفاقية السرية (NDA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>عدم مشاركة أي معلومات سرية مع أطراف خارجية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>الجدية في التفاوض واحترام وقت صاحب المشروع</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>مبلغ التأمين غير قابل للاسترداد في حالة خرق الاتفاقية</span>
                </li>
              </ul>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="font-semibold text-gray-900">أوافق على جميع الشروط والأحكام</span>
              </label>
            </div>

            <button
              onClick={handleStartNegotiation}
              disabled={!agreedToTerms || startingNegotiation}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all transform ${
                agreedToTerms && !startingNegotiation
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {startingNegotiation ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري بدء التفاوض...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  ابدأ التفاوض الآن
                </span>
              )}
            </button>

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
                <strong>تنبيه مهم:</strong> نظام التفاوض مخصص للمستثمرين الجادين فقط. 
                أي محاولة لسوء استخدام النظام أو خرق اتفاقية السرية سيؤدي إلى فقدان مبلغ التأمين بالكامل وإيقاف الحساب نهائياً.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // إذا كان هناك تفاوض نشط، عرض صفحة المحادثة
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">التفاوض مع</p>
                <p className="font-bold text-gray-900">{project.owner.name}</p>
              </div>
              {project.owner.avatar ? (
                <img
                  src={project.owner.avatar}
                  alt={project.owner.name}
                  className="w-12 h-12 rounded-full border-2 border-teal-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center border-2 border-teal-200">
                  <span className="text-lg font-bold text-teal-600">
                    {project.owner.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Messages */}
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ابدأ المحادثة الآن</p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.senderId === 1 ? 'flex-row-reverse' : ''}`}
                >
                  {message.senderAvatar ? (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-gray-600">
                        {message.senderName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className={`flex-1 ${message.senderId === 1 ? 'text-right' : ''}`}>
                    <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.senderId === 1
                          ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  newMessage.trim() && !sending
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

