'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Mail,
  Phone,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  AlertTriangle,
} from 'lucide-react';
import {
  getAllNDAgreements,
  getNDAStatistics,
  getNDAgreementById,
  revokeNDAgreement,
  getNDAAnalytics,
} from '@/app/actions/admin-nda';

export default function AdminNDAPage() {
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agreementsRes, statsRes, analyticsRes] = await Promise.all([
        getAllNDAgreements(),
        getNDAStatistics(),
        getNDAAnalytics(),
      ]);

      if (agreementsRes.success) {
        setAgreements(agreementsRes.agreements || []);
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (agreementId: number) => {
    const result = await getNDAgreementById(agreementId);
    if (result.success) {
      setSelectedAgreement(result);
      setShowDetails(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            إدارة اتفاقيات عدم الإفشاء
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            مراقبة وإدارة جميع اتفاقيات NDA على المنصة
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي الاتفاقيات"
            value={stats.total}
            icon={FileText}
            color="blue"
            subtitle={`${stats.todayCount} اليوم`}
          />
          <StatCard
            title="الاتفاقيات النشطة"
            value={stats.active}
            icon={CheckCircle2}
            color="green"
            subtitle={`${stats.weekCount} هذا الأسبوع`}
          />
          <StatCard
            title="تم التحقق منها"
            value={stats.verified}
            icon={Shield}
            color="purple"
            subtitle={`${((stats.verified / stats.total) * 100).toFixed(1)}% من الإجمالي`}
          />
          <StatCard
            title="تم إرسال PDF"
            value={stats.emailSent}
            icon={Mail}
            color="indigo"
            subtitle={`${stats.pdfGenerated} تم توليده`}
          />
        </div>
      )}

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agreements by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              حسب الحالة
            </h3>
            <div className="space-y-3">
              {analytics.agreementsByStatus.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {item.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{
                          width: `${(item.count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agreements by Device */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              حسب نوع الجهاز
            </h3>
            <div className="space-y-3">
              {analytics.agreementsByDevice.map((item: any, index: number) => {
                const Icon =
                  item.deviceType === 'mobile'
                    ? Smartphone
                    : item.deviceType === 'tablet'
                    ? Tablet
                    : Monitor;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.deviceType || 'غير محدد'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Agreements Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            جميع الاتفاقيات
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  المستخدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  التحقق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {agreements.map((item: any) => (
                <tr
                  key={item.agreement.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {item.agreement.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.agreement.fullName || 'غير محدد'}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{item.agreement.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.agreement.email || 'غير محدد'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.agreement.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {item.agreement.status === 'active' ? 'نشط' : 'ملغي'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.agreement.otpVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.agreement.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(item.agreement.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {item.agreement.pdfUrl && (
                        <a
                          href={item.agreement.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="تحميل PDF"
                        >
                          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAgreement && (
        <AgreementDetailsModal
          agreement={selectedAgreement}
          onClose={() => {
            setShowDetails(false);
            setSelectedAgreement(null);
          }}
          onRevoke={async (reason) => {
            await revokeNDAgreement(selectedAgreement.agreement.id, 1, reason);
            loadData();
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

// Agreement Details Modal
function AgreementDetailsModal({ agreement, onClose, onRevoke }: any) {
  const [revokeReason, setRevokeReason] = useState('');
  const [showRevokeForm, setShowRevokeForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            تفاصيل الاتفاقية #{agreement.agreement.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              معلومات المستخدم
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="الاسم الكامل" value={agreement.agreement.fullName} />
              <InfoItem label="البريد الإلكتروني" value={agreement.agreement.email} />
              <InfoItem label="رقم الجوال" value={agreement.agreement.phone} />
              <InfoItem
                label="عنوان IP"
                value={agreement.agreement.ipAddress}
              />
              <InfoItem label="نوع الجهاز" value={agreement.agreement.deviceType} />
              <InfoItem label="المتصفح" value={agreement.agreement.browser} />
            </div>
          </div>

          {/* Agreement Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              معلومات الاتفاقية
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="الحالة"
                value={agreement.agreement.status === 'active' ? 'نشط' : 'ملغي'}
              />
              <InfoItem
                label="التحقق"
                value={agreement.agreement.otpVerified ? 'تم التحقق' : 'لم يتم'}
              />
              <InfoItem
                label="تاريخ التوقيع"
                value={new Date(agreement.agreement.createdAt).toLocaleString('ar-SA')}
              />
              <InfoItem
                label="PDF"
                value={agreement.agreement.pdfGenerated ? 'تم التوليد' : 'لم يتم'}
              />
            </div>
          </div>

          {/* Actions */}
          {!showRevokeForm && agreement.agreement.isValid && (
            <button
              onClick={() => setShowRevokeForm(true)}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              إلغاء الاتفاقية
            </button>
          )}

          {showRevokeForm && (
            <div className="space-y-4">
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="سبب الإلغاء..."
                rows={3}
                dir="rtl"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeForm(false)}
                  className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => onRevoke(revokeReason)}
                  disabled={!revokeReason}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  تأكيد الإلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900 dark:text-white">
        {value || 'غير محدد'}
      </p>
    </div>
  );
}

