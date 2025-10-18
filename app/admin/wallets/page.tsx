'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet, Search, ArrowLeft, DollarSign, TrendingUp, TrendingDown,
  RefreshCw, Users, BarChart3, Package
} from 'lucide-react';

interface WalletData {
  id: string;
  userName: string;
  userEmail: string;
  balance: string;
  totalDeposits: string;
  totalWithdrawals: string;
  status: string;
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    totalBalance: '0',
    totalDeposits: '0',
    totalWithdrawals: '0'
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  useEffect(() => {
    filterWallets();
  }, [wallets, searchQuery]);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/admin/wallets');
      const data = await res.json();
      if (data.success) {
        setWallets(data.wallets || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterWallets = () => {
    let filtered = [...wallets];

    if (searchQuery) {
      filtered = filtered.filter(wallet =>
        wallet.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWallets(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المحافظ...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي المحافظ', value: stats.total, icon: Wallet, color: 'from-blue-500 to-blue-600' },
    { label: 'إجمالي الأرصدة', value: `${stats.totalBalance} ر.س`, icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'إجمالي الإيداعات', value: `${stats.totalDeposits} ر.س`, icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
    { label: 'إجمالي السحوبات', value: `${stats.totalWithdrawals} ر.س`, icon: TrendingDown, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="text-gray-400" size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Wallet className="text-green-400" size={32} />
                  إدارة المحافظ
                </h1>
              </div>
              <p className="text-gray-400 mr-11">إدارة الأرصدة والمعاملات المالية</p>
            </div>
            <button
              onClick={fetchWallets}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">المستخدم</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الرصيد</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الإيداعات</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">السحوبات</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredWallets.length > 0 ? (
                  filteredWallets.map((wallet, index) => (
                    <motion.tr
                      key={wallet.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{wallet.userName}</p>
                          <p className="text-gray-400 text-sm">{wallet.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-bold text-lg">{wallet.balance} ر.س</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-semibold">{wallet.totalDeposits} ر.س</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-400 font-semibold">{wallet.totalWithdrawals} ر.س</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          wallet.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {wallet.status === 'active' ? 'نشط' : 'موقوف'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Wallet className="mx-auto text-gray-600 mb-4" size={48} />
                      <p className="text-gray-400 text-lg">لا توجد نتائج</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          عرض {filteredWallets.length} من {wallets.length} محفظة
        </div>
      </div>
    </div>
  );
}

