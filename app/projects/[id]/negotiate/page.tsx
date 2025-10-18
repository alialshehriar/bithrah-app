'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Clock, AlertTriangle, Shield, MessageCircle, Send } from 'lucide-react';

interface NegotiationSession {
  id: number;
  projectId: number;
  projectTitle: string;
  creatorName: string;
  backerName: string;
  status: 'active' | 'expired' | 'completed';
  startDate: string;
  endDate: string;
  fee: number;
  refundable: boolean;
  messages: Message[];
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  flagged: boolean;
}

export default function NegotiatePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [session, setSession] = useState<NegotiationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/negotiations/project/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else {
          // No active session, redirect to start negotiation
          router.push(`/negotiations/start?projectId=${projectId}`);
        }
      } catch (error) {
        console.error('Error fetching negotiation session:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [projectId, router]);

  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(session.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining('انتهت المدة');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining(`${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;

    setSending(true);
    try {
      const response = await fetch(`/api/negotiations/${session.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setSession({
          ...session,
          messages: [...session.messages, newMessage],
        });
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg animate-pulse"></div>
            <p className="text-text-muted">جاري التحميل...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            محادثة تفاوضية مع {session.creatorName}
          </h1>
          <p className="text-text-secondary">
            حول مشروع: {session.projectTitle}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">تحذير مهم</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• جميع المحادثات مراقبة بواسطة النظام الآلي</li>
                <li>• ممنوع منعاً باتاً طلب أو مشاركة معلومات اتصال خارجية (أرقام، إيميلات، حسابات)</li>
                <li>• أي محاولة للتواصل خارج المنصة ستؤدي لإيقاف الحساب وخسارة الرسوم</li>
                <li>• المحادثة ستُغلق تلقائياً بعد 3 أيام</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Time Remaining */}
          <div className="p-4 rounded-xl bg-bg-card border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-sm text-text-muted">الوقت المتبقي</p>
                <p className="text-sm font-semibold text-text-primary">{timeRemaining}</p>
              </div>
            </div>
          </div>

          {/* Fee Status */}
          <div className="p-4 rounded-xl bg-bg-card border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple" />
              </div>
              <div>
                <p className="text-sm text-text-muted">الرسوم</p>
                <p className="text-sm font-semibold text-text-primary">
                  {session.fee} ر.س {session.refundable && '(قابلة للاسترداد)'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Count */}
          <div className="p-4 rounded-xl bg-bg-card border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-sm text-text-muted">عدد الرسائل</p>
                <p className="text-sm font-semibold text-text-primary">{session.messages.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-bg-card rounded-xl border border-gray-200 overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {session.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted">لا توجد رسائل بعد</p>
                  <p className="text-sm text-text-muted mt-1">ابدأ المحادثة بإرسال رسالة</p>
                </div>
              </div>
            ) : (
              session.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderName === session.backerName ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      msg.senderName === session.backerName
                        ? 'bg-gradient-to-r from-teal to-cyan-500 text-white'
                        : 'bg-gray-100 text-text-primary'
                    } ${msg.flagged ? 'border-2 border-error' : ''}`}
                  >
                    <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.senderName === session.backerName ? 'text-white/70' : 'text-text-muted'}`}>
                      {new Date(msg.timestamp).toLocaleString('ar-SA')}
                    </p>
                    {msg.flagged && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-error">
                        <AlertTriangle className="w-3 h-3" />
                        <span>تم الإبلاغ عن هذه الرسالة</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          {session.status === 'active' ? (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white text-text-primary"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal to-cyan-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 bg-gray-100 text-center">
              <p className="text-text-muted">
                {session.status === 'expired' ? 'انتهت مدة المحادثة' : 'تم إغلاق المحادثة'}
              </p>
            </div>
          )}
        </div>

        {/* Monitoring Notice */}
        <div className="mt-6 p-4 rounded-xl bg-info/10 border border-info/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-text-primary mb-1">نظام المراقبة الآلي</h3>
              <p className="text-sm text-text-secondary">
                يتم مراقبة جميع المحادثات بواسطة نظام ذكاء اصطناعي متقدم للكشف عن أي محاولات للتواصل الخارجي أو مشاركة معلومات اتصال. 
                أي رسالة مخالفة سيتم الإبلاغ عنها تلقائياً وقد تؤدي لإيقاف الحساب.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

