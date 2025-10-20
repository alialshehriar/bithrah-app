'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings, Save, RefreshCw, DollarSign, MessageSquare,
  Sparkles, AlertCircle, CheckCircle, Info, Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Demo Settings
  const [demoSettings, setDemoSettings] = useState({
    isEnabled: true,
    walletCredit: 100000,
    negotiationBaseFee: 2000,
    negotiationRate: 0.02,
    negotiationMin: 1000,
    negotiationMax: 20000,
  });

  // Walkthrough Texts
  const [walkthroughTexts, setWalkthroughTexts] = useState({
    welcome: 'مرحباً بك في تجربة بذرة التفاعلية الكاملة!',
    projects: 'استكشف وادعم المشاريع',
    negotiation: 'نظام التفاوض الذكي',
    evaluate: 'تقييم الأفكار بالذكاء الاصطناعي',
    communities: 'المجتمعات التفاعلية',
    subscriptions: 'باقات الاشتراك الحصرية',
    wallet: 'محفظتك التجريبية',
    referrals: 'نظام الإحالات ولوحة الصدارة',
    protection: 'حماية الملكية الفكرية',
  });

  // Subscription Fees
  const [subscriptionFees, setSubscriptionFees] = useState({
    silver: { price: 99, discount: 0.05 },
    gold: { price: 199, discount: 0.10 },
    platinum: { price: 399, discount: 0.20 },
  });

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demoSettings,
          walkthroughTexts,
          subscriptionFees,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateNegotiationFee = (amount: number) => {
    const { negotiationBaseFee, negotiationRate, negotiationMin, negotiationMax } = demoSettings;
    let fee = negotiationBaseFee + (amount * negotiationRate);
    fee = Math.round(fee / 100) * 100;
    return Math.max(negotiationMin, Math.min(negotiationMax, fee));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </Link>
              <Settings className="w-8 h-8 text-[#14B8A6]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
                <p className="text-sm text-gray-600">إدارة إعدادات Demo والنصوص والرسوم</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#14B8A6] hover:bg-[#0F9A8A] text-white'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saveStatus === 'success' ? 'تم الحفظ' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">إعدادات Demo</h2>
                <p className="text-sm text-gray-600">التحكم في الوضع التجريبي</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Wallet className="w-4 h-4" />
                  الرصيد التجريبي (ريال)
                </label>
                <input
                  type="number"
                  value={demoSettings.walletCredit}
                  onChange={(e) =>
                    setDemoSettings({ ...demoSettings, walletCredit: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3">رسوم التفاوض</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الرسم الأساسي
                    </label>
                    <input
                      type="number"
                      value={demoSettings.negotiationBaseFee}
                      onChange={(e) =>
                        setDemoSettings({
                          ...demoSettings,
                          negotiationBaseFee: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      النسبة (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={demoSettings.negotiationRate * 100}
                      onChange={(e) =>
                        setDemoSettings({
                          ...demoSettings,
                          negotiationRate: Number(e.target.value) / 100,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الحد الأدنى
                    </label>
                    <input
                      type="number"
                      value={demoSettings.negotiationMin}
                      onChange={(e) =>
                        setDemoSettings({
                          ...demoSettings,
                          negotiationMin: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الحد الأقصى
                    </label>
                    <input
                      type="number"
                      value={demoSettings.negotiationMax}
                      onChange={(e) =>
                        setDemoSettings({
                          ...demoSettings,
                          negotiationMax: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Fee Calculator */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-700 mb-2">أمثلة الرسوم:</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>• 100,000 ريال → {calculateNegotiationFee(100000).toLocaleString('ar-SA')} ريال</p>
                    <p>• 200,000 ريال → {calculateNegotiationFee(200000).toLocaleString('ar-SA')} ريال</p>
                    <p>• 500,000 ريال → {calculateNegotiationFee(500000).toLocaleString('ar-SA')} ريال</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Fees */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">رسوم الاشتراكات</h2>
                <p className="text-sm text-gray-600">إدارة أسعار وخصومات الباقات</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Silver */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">الباقة الفضية</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      السعر (ريال)
                    </label>
                    <input
                      type="number"
                      value={subscriptionFees.silver.price}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          silver: { ...subscriptionFees.silver, price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الخصم (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={subscriptionFees.silver.discount * 100}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          silver: {
                            ...subscriptionFees.silver,
                            discount: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Gold */}
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">الباقة الذهبية</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      السعر (ريال)
                    </label>
                    <input
                      type="number"
                      value={subscriptionFees.gold.price}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          gold: { ...subscriptionFees.gold, price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الخصم (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={subscriptionFees.gold.discount * 100}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          gold: {
                            ...subscriptionFees.gold,
                            discount: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Platinum */}
              <div className="p-4 bg-purple-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">الباقة البلاتينية</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      السعر (ريال)
                    </label>
                    <input
                      type="number"
                      value={subscriptionFees.platinum.price}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          platinum: { ...subscriptionFees.platinum, price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      الخصم (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={subscriptionFees.platinum.discount * 100}
                      onChange={(e) =>
                        setSubscriptionFees({
                          ...subscriptionFees,
                          platinum: {
                            ...subscriptionFees.platinum,
                            discount: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">ملاحظة مهمة</p>
              <p>
                جميع التغييرات تُطبق فوراً على النظام. تأكد من صحة القيم قبل الحفظ.
                الرسوم المحسوبة تلقائياً تُطبق على جميع عمليات التفاوض الجديدة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

