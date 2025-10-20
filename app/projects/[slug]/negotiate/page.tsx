'use client';

import { getNegotiationData, sendNegotiationMessage } from '@/app/actions/negotiations';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Send, Paperclip, Info, Clock, CheckCircle2,
  XCircle, AlertCircle, Lock, Unlock, DollarSign, Calendar,
  MessageSquare, FileText, Shield
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
  const slug = params.slug as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNegotiationData();
  }, [slug]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchNegotiationData = async () => {
    try {
      setLoading(true);
      const data = await getNegotiationData(slug as string);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !negotiation) return;

    setSending(true);
    try {
      const response = await fetch(`/api/negotiations/${negotiation.uuid}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'accepted': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      case 'expired': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      case 'cancelled': return 'ملغي';
      case 'expired': return 'منتهي';
      default: return status;
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

  if (error || !project || !negotiation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على جلسة تفاوض'}</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمشاريع
          </Link>
        </div>
      </div>
    );
  }

  const timeRemaining = new Date(negotiation.endDate).getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/projects/${slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">العودة للمشروع</span>
            </Link>
            <div className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(negotiation.status)}`}>
              {getStatusText(negotiation.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Project Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات المشروع</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">اسم المشروع</p>
                  <p className="font-semibold text-gray-900">{project.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">صاحب المشروع</p>
                  <div className="flex items-center gap-2">
                    {project.owner.avatar ? (
                      <img
                        src={project.owner.avatar}
                        alt={project.owner.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-semibold text-sm">
                          {project.owner.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="font-semibold text-gray-900">{project.owner.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">الهدف التمويلي</p>
                  <p className="font-semibold text-gray-900">{project.fundingGoal.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">المبلغ الحالي</p>
                  <p className="font-semibold text-teal-600">{project.currentAmount.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>

            {/* Negotiation Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات التفاوض</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">الوقت المتبقي</p>
                    <p className="font-semibold text-gray-900">
                      {daysRemaining} يوم و {hoursRemaining} ساعة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">مبلغ التأمين</p>
                    <p className="font-semibold text-gray-900">{negotiation.depositAmount.toLocaleString()} ر.س</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  {negotiation.hasFullAccess ? (
                    <Unlock className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-purple-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">الوصول الكامل</p>
                    <p className="font-semibold text-gray-900">
                      {negotiation.hasFullAccess ? 'متاح' : 'غير متاح'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-200px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد رسائل بعد</p>
                    <p className="text-sm text-gray-400 mt-2">ابدأ المحادثة الآن</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      {message.senderAvatar ? (
                        <img
                          src={message.senderAvatar}
                          alt={message.senderName}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-600 font-semibold">
                            {message.senderName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4">
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    disabled={negotiation.status !== 'active'}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending || negotiation.status !== 'active'}
                    className="bg-[#14B8A6] hover:bg-[#0F9A8A] text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

