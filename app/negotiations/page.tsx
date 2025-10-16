'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Handshake, Clock, CheckCircle, XCircle, AlertCircle,
  MessageSquare, FileText, DollarSign, Calendar, Eye,
  ArrowLeft, Download, Send, User, Shield
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Negotiation {
  id: number;
  project: {
    id: number;
    title: string;
    image: string;
  };
  status: 'active' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
  depositAmount: string;
  depositStatus: 'held' | 'refunded' | 'forfeited';
  createdAt: string;
  expiresAt: string;
  hasFullAccess: boolean;
  unreadMessages: number;
}

export default function NegotiationsDashboard() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/negotiations');
      // const data = await response.json();
      
      // Demo data
      const now = new Date();
      const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      setNegotiations([
        {
          id: 1,
          project: {
            id: 1,
            title: 'تطبيق توصيل طعام صحي',
            image: '/placeholder-project.jpg',
          },
          status: 'active',
          depositAmount: '5000.00',
          depositStatus: 'held',
          createdAt: now.toISOString(),
          expiresAt: threeDaysLater.toISOString(),
          hasFullAccess: true,
          unreadMessages: 3,
        },
        {
          id: 2,
          project: {
            id: 2,
            title: 'منصة تعليم إلكتروني',
            image: '/placeholder-project.jpg',
          },
          status: 'accepted',
          depositAmount: '10000.00',
          depositStatus: 'forfeited',
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          hasFullAccess: true,
          unreadMessages: 0,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'نشط', icon: Clock },
      accepted: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'مقبول', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'مرفوض', icon: XCircle },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'ملغي', icon: XCircle },
      expired: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'منتهي', icon: AlertCircle },
    };
    
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${badge.bg} ${badge.text} rounded-lg text-sm font-medium`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const getDepositStatusBadge = (status: string) => {
    const badges = {
      held: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'محتفظ به' },
      refunded: { bg: 'bg-green-100', text: 'text-green-700', label: 'مسترد' },
      forfeited: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'مستخدم' },
    };
    
    const badge = badges[status as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 ${badge.bg} ${badge.text} rounded text-xs font-medium`}>
        {badge.label}
      </span>
    );
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'منتهي';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  const filteredNegotiations = negotiations.filter(neg => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return neg.status === 'active';
    if (activeTab === 'completed') return ['accepted', 'rejected', 'cancelled', 'expired'].includes(neg.status);
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التفاوض</h1>
          <p className="text-gray-600">
            إدارة جميع تفاوضاتك مع أصحاب المشاريع
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            الكل ({negotiations.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            النشطة ({negotiations.filter(n => n.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            المكتملة ({negotiations.filter(n => ['accepted', 'rejected', 'cancelled', 'expired'].includes(n.status)).length})
          </button>
        </div>

        {/* Negotiations List */}
        {filteredNegotiations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد تفاوضات</h3>
            <p className="text-gray-600 mb-6">
              ابدأ بفتح بوابة التفاوض مع أحد المشاريع
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Eye className="w-5 h-5" />
              <span>تصفح المشاريع</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNegotiations.map((negotiation) => (
              <motion.div
                key={negotiation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/projects/${negotiation.project.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors"
                      >
                        {negotiation.project.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        رقم التفاوض: #{negotiation.id}
                      </p>
                    </div>
                    {getStatusBadge(negotiation.status)}
                  </div>

                  {/* Time Remaining (for active) */}
                  {negotiation.status === 'active' && (
                    <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-4 border border-teal-200">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">الوقت المتبقي</p>
                          <p className="text-lg font-bold text-teal-600">
                            {getTimeRemaining(negotiation.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Deposit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm">مبلغ الجدية</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">
                        {Number(negotiation.depositAmount).toLocaleString('ar-SA')} ريال
                      </p>
                      {getDepositStatusBadge(negotiation.depositStatus)}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">تاريخ الإنشاء</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {new Date(negotiation.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  {/* Access */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm">الوصول</span>
                    </div>
                    <p className="text-sm font-semibold text-teal-600">
                      {negotiation.hasFullAccess ? 'وصول كامل' : 'محدود'}
                    </p>
                  </div>

                  {/* Messages */}
                  {negotiation.unreadMessages > 0 && (
                    <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-900">
                        {negotiation.unreadMessages} رسالة جديدة
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                  <Link
                    href={`/negotiations/${negotiation.id}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>فتح التفاوض</span>
                  </Link>
                  <Link
                    href={`/projects/${negotiation.project.id}`}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>المشروع</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl shadow-sm p-6 border border-teal-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Handshake className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">نظام التفاوض</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• مدة التفاوض: 3 أيام من تاريخ الفتح</p>
                <p>• مبلغ الجدية يُسترد بالكامل عند الرفض أو الإلغاء</p>
                <p>• وصول كامل لجميع التفاصيل السرية والمستندات</p>
                <p>• كشف تلقائي لأي محاولة تواصل خارج المنصة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

