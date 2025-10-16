'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, Trash2, Plus, Bot, Users, Rocket, MessageSquare,
  Wallet, TrendingUp, Settings, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface SandboxStats {
  sandbox_users: number;
  sandbox_projects: number;
  sandbox_negotiations: number;
  sandbox_wallets: number;
}

interface NegotiationBot {
  id: number;
  name: string;
  type: string;
  personality: string;
  isActive: boolean;
  totalNegotiations: number;
  successRate: number;
}

export default function SandboxManagementPage() {
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  const [stats, setStats] = useState<SandboxStats | null>(null);
  const [bots, setBots] = useState<NegotiationBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBotForm, setShowBotForm] = useState(false);

  const [newBot, setNewBot] = useState({
    name: '',
    type: 'investor',
    personality: 'professional',
    responseDelay: 2000,
  });

  useEffect(() => {
    fetchSandboxStatus();
    fetchBots();
  }, []);

  const fetchSandboxStatus = async () => {
    try {
      const response = await fetch('/api/sandbox');
      const data = await response.json();
      
      if (data.success) {
        setSandboxEnabled(data.sandboxEnabled);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching sandbox status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/sandbox/bots');
      const data = await response.json();
      
      if (data.success) {
        setBots(data.bots);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
  };

  const toggleSandbox = async () => {
    try {
      const response = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', data: { enabled: !sandboxEnabled } }),
      });

      const data = await response.json();
      if (data.success) {
        setSandboxEnabled(data.sandboxEnabled);
      }
    } catch (error) {
      console.error('Error toggling sandbox:', error);
    }
  };

  const generateSandboxData = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_data',
          data: {
            users: 20,
            projects: 30,
            negotiations: 25,
            wallets: true,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSandboxStatus();
        alert(`تم إنشاء البيانات بنجاح:\n${data.generated.users} مستخدم\n${data.generated.projects} مشروع\n${data.generated.negotiations} تفاوض\n${data.generated.wallets} محفظة`);
      }
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSandboxData = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات التجريبية؟')) return;

    try {
      const response = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_data' }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSandboxStatus();
        alert('تم حذف البيانات التجريبية بنجاح');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const createBot = async () => {
    try {
      const response = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_bot', data: newBot }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchBots();
        setShowBotForm(false);
        setNewBot({ name: '', type: 'investor', personality: 'professional', responseDelay: 2000 });
      }
    } catch (error) {
      console.error('Error creating bot:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة Sandbox</h1>
          <p className="text-gray-600">إدارة البيانات التجريبية والبوتات الذكية</p>
        </div>

        {/* Sandbox Toggle */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                sandboxEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
              }`}>
                {sandboxEnabled ? <Play className="w-8 h-8 text-white" /> : <Pause className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  وضع Sandbox {sandboxEnabled ? 'مفعّل' : 'معطّل'}
                </h2>
                <p className="text-gray-600">
                  {sandboxEnabled ? 'البيانات التجريبية مرئية للمستخدمين' : 'البيانات التجريبية مخفية'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSandbox}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all ${
                sandboxEnabled
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
              }`}
            >
              {sandboxEnabled ? 'تعطيل' : 'تفعيل'}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.sandbox_users}</div>
                  <div className="text-sm text-gray-600">مستخدم تجريبي</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.sandbox_projects}</div>
                  <div className="text-sm text-gray-600">مشروع تجريبي</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.sandbox_negotiations}</div>
                  <div className="text-sm text-gray-600">تفاوض تجريبي</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.sandbox_wallets}</div>
                  <div className="text-sm text-gray-600">محفظة تجريبية</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={generateSandboxData}
              disabled={isGenerating}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الإنشاء...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>إنشاء بيانات تجريبية</span>
                </>
              )}
            </button>

            <button
              onClick={clearSandboxData}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>حذف جميع البيانات التجريبية</span>
            </button>
          </div>
        </div>

        {/* Bots Management */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">بوتات التفاوض</h2>
            <button
              onClick={() => setShowBotForm(!showBotForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>إنشاء بوت جديد</span>
            </button>
          </div>

          {/* Bot Creation Form */}
          {showBotForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">بوت جديد</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">اسم البوت</label>
                  <input
                    type="text"
                    value={newBot.name}
                    onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                    placeholder="مثال: بوت المستثمر الذكي"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">النوع</label>
                  <select
                    value={newBot.type}
                    onChange={(e) => setNewBot({ ...newBot, type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  >
                    <option value="investor">مستثمر</option>
                    <option value="project_owner">صاحب مشروع</option>
                    <option value="mediator">وسيط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الشخصية</label>
                  <select
                    value={newBot.personality}
                    onChange={(e) => setNewBot({ ...newBot, personality: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  >
                    <option value="professional">احترافي</option>
                    <option value="friendly">ودود</option>
                    <option value="aggressive">عدواني</option>
                    <option value="conservative">محافظ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تأخير الرد (ملي ثانية)</label>
                  <input
                    type="number"
                    value={newBot.responseDelay}
                    onChange={(e) => setNewBot({ ...newBot, responseDelay: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={createBot}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  إنشاء البوت
                </button>
                <button
                  onClick={() => setShowBotForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          )}

          {/* Bots List */}
          <div className="grid md:grid-cols-2 gap-4">
            {bots.map((bot) => (
              <div key={bot.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{bot.name}</h3>
                      <p className="text-sm text-gray-600">{bot.type} • {bot.personality}</p>
                    </div>
                  </div>
                  {bot.isActive ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">التفاوضات</div>
                    <div className="text-2xl font-bold text-gray-900">{bot.totalNegotiations}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">نسبة النجاح</div>
                    <div className="text-2xl font-bold text-green-600">{bot.successRate}%</div>
                  </div>
                </div>
              </div>
            ))}

            {bots.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد بوتات بعد. قم بإنشاء بوت جديد للبدء.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

