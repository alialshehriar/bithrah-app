'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, Send, Download,
  TrendingUp, DollarSign, Calendar, Filter, Search, Eye,
  CreditCard, Building, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, ExternalLink, FileText, Award, Sparkles
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { demoConfig } from '@/lib/demo-config';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  description: string | null;
  createdAt: Date;
  relatedId: number | null;
}

interface WalletData {
  id: number;
  userId: number;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallet');
      const data = await response.json();

      if (data.success) {
        setWallet(data.wallet);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'deposit_refund':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
      case 'investment':
      case 'deposit_hold':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'commission':
      case 'reward':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'deposit_refund':
      case 'commission':
      case 'reward':
        return 'text-green-600';
      case 'withdrawal':
      case 'investment':
      case 'deposit_hold':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'deposit_refund':
      case 'commission':
      case 'reward':
        return '+';
      case 'withdrawal':
      case 'investment':
      case 'deposit_hold':
        return '-';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المعالجة';
      case 'failed':
        return 'فشل';
      default:
        return status;
    }
  };

  const getTransactionTypeText = (type: string) => {
    const types: Record<string, string> = {
      deposit: 'إيداع',
      withdrawal: 'سحب',
      investment: 'استثمار',
      commission: 'عمولة',
      reward: 'مكافأة',
      deposit_hold: 'حجز مبلغ',
      deposit_refund: 'استرداد',
    };
    return types[type] || type;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = !searchQuery || 
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => ['deposit', 'commission', 'reward', 'deposit_refund'].includes(t.type) && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
      .filter(t => ['withdrawal', 'investment', 'deposit_hold'].includes(t.type) && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return { totalIncome, totalExpense, pendingAmount };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">المحفظة</h1>
          <p className="text-gray-600">إدارة رصيدك ومعاملاتك المالية</p>
        </motion.div>

        {/* Demo Notice */}
        {demoConfig.isEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-purple-900 font-semibold mb-1">
                  ✨ {demoConfig.messages.demoNotice}
                </p>
                <p className="text-purple-700 text-sm mb-1">
                  الرصيد التجريبي يستخدم لتجربة جميع ميزات المنصة
                </p>
                <p className="text-purple-600 text-xs">
                  {demoConfig.messages.refundNotice}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-teal-600 via-teal-500 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">الرصيد المتاح</p>
                  <p className="text-3xl font-bold">{parseFloat(wallet?.balance || '0').toLocaleString()} ر.س</p>
                </div>
              </div>
              <button
                onClick={fetchWalletData}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all flex flex-col items-center gap-2">
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">إيداع</span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all flex flex-col items-center gap-2">
                <Send className="w-6 h-6" />
                <span className="text-sm font-medium">تحويل</span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span className="text-sm font-medium">سحب</span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">كشف حساب</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">إجمالي الإيرادات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalIncome.toLocaleString()} ر.س</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />
            </div>
            <p className="text-gray-600 text-sm mb-1">إجمالي المصروفات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalExpense.toLocaleString()} ر.س</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">قيد المعالجة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingAmount.toLocaleString()} ر.س</p>
          </motion.div>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">المعاملات</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 pl-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value="deposit">إيداع</option>
                <option value="withdrawal">سحب</option>
                <option value="investment">استثمار</option>
                <option value="commission">عمولة</option>
                <option value="reward">مكافأة</option>
              </select>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد معاملات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-teal-200 hover:bg-teal-50/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{getTransactionTypeText(transaction.type)}</p>
                      <p className="text-sm text-gray-600">{transaction.description || 'لا يوجد وصف'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(transaction.status)}
                        <span className="text-xs text-gray-500">{getStatusText(transaction.status)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                      {getTransactionSign(transaction.type)}{parseFloat(transaction.amount).toLocaleString()} ر.س
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

