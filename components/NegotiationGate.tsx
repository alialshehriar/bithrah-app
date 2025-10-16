'use client';

import { useState, useEffect } from 'react';
import { Lock, Users, DollarSign, CheckCircle, XCircle, Clock, Send } from 'lucide-react';

interface NegotiationGate {
  id: number;
  min_support_amount: number;
  deposit_amount: number;
  is_open: boolean;
  max_negotiators: number;
  current_negotiators: number;
  title: string;
  description: string;
}

interface Negotiation {
  id: number;
  status: string;
  amount: number;
  deposit_amount: number;
  investor_name: string;
  created_at: string;
}

interface Props {
  projectId: number;
}

export default function NegotiationGate({ projectId }: Props) {
  const [gate, setGate] = useState<NegotiationGate | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGateData();
  }, [projectId]);

  const fetchGateData = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/negotiations`);
      const data = await response.json();
      
      if (data.success) {
        setGate(data.gate);
        setNegotiations(data.negotiations || []);
      }
    } catch (error) {
      console.error('Error fetching gate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/negotiations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          message,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم إرسال طلب التفاوض بنجاح!');
        setShowForm(false);
        setAmount('');
        setMessage('');
        fetchGateData();
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error submitting negotiation:', error);
      alert('حدث خطأ في إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!gate) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'قيد المراجعة',
      active: 'نشط',
      rejected: 'مرفوض',
      completed: 'مكتمل',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{gate.title || 'بوابة التفاوض'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  gate.is_open 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {gate.is_open ? '🟢 مفتوحة' : '🔴 مغلقة'}
                </span>
              </div>
            </div>
          </div>
          {gate.description && (
            <p className="text-gray-600 mt-2">{gate.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">الحد الأدنى للدعم</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {gate.min_support_amount?.toLocaleString()} ر.س
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">مبلغ الإيداع</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {gate.deposit_amount?.toLocaleString() || 0} ر.س
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">المفاوضون</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {gate.current_negotiators || 0} / {gate.max_negotiators || '∞'}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {gate.is_open && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              إرسال طلب تفاوض
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border-2 border-purple-300">
              <h4 className="text-lg font-bold text-gray-900 mb-4">طلب تفاوض جديد</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المبلغ المقترح (ر.س)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={gate.min_support_amount}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder={`الحد الأدنى: ${gate.min_support_amount}`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رسالة (اختياري)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="أخبر صاحب المشروع عن اهتمامك..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Negotiations List */}
      {negotiations.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4">طلبات التفاوض الأخيرة</h4>
          <div className="space-y-3">
            {negotiations.slice(0, 5).map((negotiation) => (
              <div key={negotiation.id} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(negotiation.status)}
                  <div>
                    <div className="font-semibold text-gray-900">{negotiation.investor_name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(negotiation.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">
                    {negotiation.amount.toLocaleString()} ر.س
                  </div>
                  <div className="text-xs text-gray-500">
                    {getStatusText(negotiation.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

