'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Bell, Check, CheckCheck, Trash2, Filter, RefreshCw,
  Rocket, Users, Heart, MessageSquare, Gift, Crown,
  TrendingUp, AlertCircle, Info, CheckCircle, XCircle,
  Calendar, Clock, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  readAt: string | null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchNotifications();
  }, [page, filterType, filterRead]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (filterType) params.append('type', filterType);
      if (filterRead) params.append('read', filterRead);

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, markAsRead: true })
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التنبيه؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications?notificationId=${notificationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllRead = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع التنبيهات المقروءة؟')) {
      return;
    }

    try {
      const response = await fetch('/api/notifications?deleteAll=true', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting all read notifications:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_approved':
      case 'project_rejected':
      case 'project_backed':
        return Rocket;
      case 'referral_reward':
        return Gift;
      case 'community_post':
      case 'community_joined':
        return Users;
      case 'backing_received':
        return Heart;
      case 'message_received':
        return MessageSquare;
      case 'subscription_upgrade':
        return Crown;
      case 'achievement_unlocked':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'project_approved':
        return 'from-green-500 to-green-600';
      case 'project_rejected':
        return 'from-red-500 to-red-600';
      case 'project_backed':
      case 'backing_received':
        return 'from-pink-500 to-pink-600';
      case 'referral_reward':
        return 'from-purple-500 to-purple-600';
      case 'community_post':
      case 'community_joined':
        return 'from-blue-500 to-blue-600';
      case 'message_received':
        return 'from-cyan-500 to-cyan-600';
      case 'subscription_upgrade':
        return 'from-yellow-500 to-yellow-600';
      case 'achievement_unlocked':
        return 'from-teal-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">التنبيهات</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `لديك ${unreadCount} تنبيه غير مقروء` : 'جميع التنبيهات مقروءة'}
                </p>
              </div>
              <button
                onClick={fetchNotifications}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <CheckCheck className="w-4 h-4" />
                  تحديد الكل كمقروء
                </button>
              )}
              <button
                onClick={deleteAllRead}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                حذف المقروءة
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterRead}
                  onChange={(e) => {
                    setFilterRead(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="">جميع التنبيهات</option>
                  <option value="false">غير مقروءة</option>
                  <option value="true">مقروءة</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="project_approved">مشاريع معتمدة</option>
                  <option value="project_rejected">مشاريع مرفوضة</option>
                  <option value="project_backed">دعم مشاريع</option>
                  <option value="backing_received">دعم مستلم</option>
                  <option value="referral_reward">مكافآت إحالة</option>
                  <option value="community_post">منشورات مجتمع</option>
                  <option value="message_received">رسائل</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد تنبيهات</h3>
              <p className="text-gray-600">ستظهر هنا جميع التنبيهات والتحديثات</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const color = getNotificationColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
                        notification.read ? 'border-gray-100' : 'border-teal-200 bg-teal-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2"></div>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3">{notification.message}</p>

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>

                            <div className="flex items-center gap-2">
                              {notification.link && (
                                <Link
                                  href={notification.link}
                                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                  عرض
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}

                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  تحديد كمقروء
                                </button>
                              )}

                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      عرض {((page - 1) * 20) + 1}-{Math.min(page * 20, pagination.total)} من {pagination.total}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        السابق
                      </button>
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

