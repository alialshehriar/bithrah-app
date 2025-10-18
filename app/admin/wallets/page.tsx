'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Wallet, Search, DollarSign, TrendingUp, TrendingDown,
  Users, Eye, Edit, Plus, Minus, RefreshCw
} from 'lucide-react';

interface WalletData {
  id: number;
  userId: number;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  pendingAmount: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchWallets();
  }, [search]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/wallets?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setWallets(data.wallets);
        setTotalBalance(data.totalBalance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async (walletId: number, amount: number, type: 'add' | 'subtract') => {
    const adjustedAmount = type === 'subtract' ? -Math.abs(amount) : Math.abs(amount);
    const reason = prompt('سبب التعديل:');
    
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/wallets/${walletId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: adjustedAmount, reason }),
      });

      if (response.ok) {
        alert('تم تعديل الرصيد بنجاح');
        fetchWallets();
      }
    } catch (error) {
      console.error('Error adjusting balance:', error);
      alert('حدث خطأ أثناء تعديل الرصيد');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← العودة
              </Link>
              <div className="flex items-center gap-3">
                <Wallet className="w-10 h-10 text-green-500" />
                <div>
                  <h1 className="text-4xl font-black text-white">إدارة المحافظ</h1>
                  <p className="text-gray-400">عرض وتعديل أرصدة المستخدمين</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">{totalBalance.toLocaleString()} ر.س</div>
              <div className="text-gray-400 text-sm">إجمالي الأرصدة</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>
        </motion.div>

        {/* Wallets List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا يوجد محافظ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* User Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      {wallet.user?.avatar ? (
                        <img
                          src={wallet.user.avatar}
                          alt={wallet.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-white" />
                      )}
                    </div>

                    {/* User & Wallet Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {wallet.user?.name || 'مستخدم غير معروف'}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{wallet.user?.email}</p>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <Wallet className="w-4 h-4" />
                            <span>الرصيد الحالي</span>
                          </div>
                          <div className="text-white font-bold text-lg">{wallet.balance.toLocaleString()} ر.س</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>إجمالي الأرباح</span>
                          </div>
                          <div className="text-green-400 font-bold text-lg">{wallet.totalEarned.toLocaleString()} ر.س</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <TrendingDown className="w-4 h-4" />
                            <span>إجمالي المصروفات</span>
                          </div>
                          <div className="text-red-400 font-bold text-lg">{wallet.totalSpent.toLocaleString()} ر.س</div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <RefreshCw className="w-4 h-4" />
                            <span>قيد الانتظار</span>
                          </div>
                          <div className="text-yellow-400 font-bold text-lg">{wallet.pendingAmount.toLocaleString()} ر.س</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/wallets/${wallet.id}`}
                      className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </Link>
                    <button
                      onClick={() => {
                        const amount = parseFloat(prompt('المبلغ المراد إضافته:') || '0');
                        if (amount > 0) handleAdjustBalance(wallet.id, amount, 'add');
                      }}
                      className="p-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => {
                        const amount = parseFloat(prompt('المبلغ المراد خصمه:') || '0');
                        if (amount > 0) handleAdjustBalance(wallet.id, amount, 'subtract');
                      }}
                      className="p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                    >
                      <Minus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

