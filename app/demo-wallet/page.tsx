'use client';

import { useState, useEffect } from 'react';
import { demoConfig, formatCurrency } from '@/lib/demo-config';
import type { DemoWallet, DemoTransaction } from '@/types/demo-wallet';

export default function DemoWalletPage() {
  const [wallet, setWallet] = useState<DemoWallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/demo-wallet?userId=demo-user-1');
      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'initial_credit':
        return '🎁';
      case 'support_package':
        return '📦';
      case 'subscription':
        return '⭐';
      case 'negotiation_fee':
        return '🤝';
      case 'refund':
        return '↩️';
      case 'bonus':
        return '🎉';
      default:
        return '💰';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'initial_credit':
      case 'refund':
      case 'bonus':
        return 'text-green-600';
      case 'support_package':
      case 'subscription':
      case 'negotiation_fee':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحفظة...</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">فشل في تحميل المحفظة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Demo Notice */}
        <div className="mb-6 bg-purple-100 border border-purple-300 rounded-xl p-4 text-center">
          <p className="text-purple-800 font-semibold">
            ✨ {demoConfig.messages.demoNotice}
          </p>
          <p className="text-purple-600 text-sm mt-1">
            {demoConfig.messages.walletNotice}
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-purple-200 text-sm mb-2">الرصيد التجريبي</p>
              <h1 className="text-5xl font-bold">{formatCurrency(wallet.balance)}</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold">{formatCurrency(wallet.totalEarned)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm mb-1">إجمالي المصروفات</p>
              <p className="text-2xl font-bold">{formatCurrency(wallet.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            سجل المعاملات
          </h2>

          <div className="space-y-4">
            {wallet.transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getTransactionIcon(txn.type)}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{txn.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {txn.status === 'refunded' && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        تم الاسترداد
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-xl font-bold ${getTransactionColor(txn.type)}`}>
                    {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    الرصيد: {formatCurrency(txn.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {wallet.transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>لا توجد معاملات بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

