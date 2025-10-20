'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign, 
  Calendar, Filter, Eye, CheckCircle, XCircle, AlertCircle,
  RefreshCw, Sparkles, Award, CreditCard, Clock
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  description: string | null;
  createdAt: Date;
}

interface WalletData {
  balance: string;
  demo_balance: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

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
        setTransactions(data.transactions || []);
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
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
      case 'withdrawal':
      case 'investment':
        return <ArrowUpRight className="w-5 h-5 text-rose-600" />;
      case 'commission':
      case 'reward':
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' || t.type === filterType
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Wallet className="w-10 h-10 text-teal-600" />
            محفظتي
          </h1>
          <p className="text-gray-600 mt-2">إدارة رصيدك ومعاملاتك المالية</p>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Demo Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-purple-600 to-pink-500 p-8 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-sm font-medium opacity-90">رصيد تجريبي</span>
                </div>
                <CreditCard className="w-6 h-6 opacity-75" />
              </div>
              <p className="text-5xl font-bold mb-2">
                {parseFloat(wallet?.demo_balance || '100000').toLocaleString('ar-SA')}
                <span className="text-2xl mr-2">ريال</span>
              </p>
              <p className="text-sm opacity-90">استمتع بتجربة كاملة لجميع الميزات</p>
            </div>
          </motion.div>

          {/* Real Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 p-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Wallet className="w-6 h-6" />
                <span className="text-sm font-medium">الرصيد الفعلي</span>
              </div>
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {parseFloat(wallet?.balance || '0').toLocaleString('ar-SA')}
              <span className="text-2xl mr-2 text-gray-600">ريال</span>
            </p>
            <p className="text-sm text-gray-500">متاح للسحب والاستثمار</p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-600">إجمالي الإيداعات</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">100,000 ريال</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-sm text-gray-600">إجمالي الاستثمارات</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)).toLocaleString('ar-SA')} ريال
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">العمولات المكتسبة</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0 ريال</p>
          </div>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">سجل المعاملات</h2>
              <button
                onClick={fetchWalletData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'deposit', 'investment', 'commission'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterType === type
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'الكل' : type === 'deposit' ? 'إيداع' : type === 'investment' ? 'استثمار' : 'عمولة'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>لا توجد معاملات بعد</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description || 'معاملة'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`text-xl font-bold ${parseFloat(transaction.amount) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {parseFloat(transaction.amount) >= 0 ? '+' : ''}{parseFloat(transaction.amount).toLocaleString('ar-SA')} ريال
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

