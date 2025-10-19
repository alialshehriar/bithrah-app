'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Star, Sparkles, Check, Zap, TrendingUp,
  Users, Bell, BarChart3, MessageSquare, Award, Shield
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { subscriptions } from '@/lib/subscriptions';
import { demoConfig, formatCurrency } from '@/lib/demo-config';
import type { Subscription } from '@/types/demo-wallet';

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (subscription: Subscription) => {
    setSubscribing(true);
    setSelectedPlan(subscription.id);
    
    // Simulate subscription process
    setTimeout(() => {
      setShowConfirmation(true);
      setSubscribing(false);
      
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedPlan(null);
      }, 3000);
    }, 1500);
  };

  const getPlanIcon = (id: string) => {
    switch (id) {
      case 'silver':
        return <Award className="w-8 h-8" />;
      case 'gold':
        return <Crown className="w-8 h-8" />;
      case 'platinum':
        return <Sparkles className="w-8 h-8" />;
      default:
        return <Star className="w-8 h-8" />;
    }
  };

  const getPlanGradient = (id: string) => {
    switch (id) {
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-orange-500';
      case 'platinum':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-teal-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <Crown className="w-5 h-5 text-purple-600" />
            <span className="text-purple-900 font-semibold">الاشتراكات المميزة</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">اختر الباقة المناسبة لك</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            احصل على مزايا حصرية وتحليلات متقدمة بالذكاء الاصطناعي
          </p>
        </motion.div>

        {/* Demo Notice */}
        {demoConfig.isEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 max-w-3xl mx-auto"
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
                  {demoConfig.messages.subscriptionNotice}
                </p>
                <p className="text-purple-600 text-xs">
                  {demoConfig.messages.refundNotice}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscription Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {subscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${subscription.popular ? 'md:-mt-4' : ''}`}
            >
              {/* Popular Badge */}
              {subscription.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col ${
                subscription.popular ? 'ring-2 ring-yellow-400' : ''
              }`}>
                {/* Header */}
                <div className={`bg-gradient-to-br ${getPlanGradient(subscription.id)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {getPlanIcon(subscription.id)}
                    </div>
                    {subscription.badge && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {subscription.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{subscription.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{subscription.price}</span>
                    <span className="text-lg">ريال</span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">لمدة {subscription.duration} يوم</p>
                </div>

                {/* Features */}
                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {subscription.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSubscribe(subscription)}
                    disabled={subscribing && selectedPlan === subscription.id}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      subscription.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-teal-600 to-purple-600 text-white hover:shadow-lg'
                    } ${
                      subscribing && selectedPlan === subscription.id
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105'
                    }`}
                  >
                    {subscribing && selectedPlan === subscription.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الاشتراك...
                      </span>
                    ) : (
                      'اشترك الآن'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            مقارنة المزايا
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">إشعارات فورية</h3>
              <p className="text-gray-600 text-sm">
                احصل على تنبيهات فورية للمشاريع الجديدة والفرص الاستثمارية
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">تحليلات متقدمة</h3>
              <p className="text-gray-600 text-sm">
                تحليلات شاملة بالذكاء الاصطناعي لمساعدتك في اتخاذ قرارات استثمارية أفضل
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">أولوية الوصول</h3>
              <p className="text-gray-600 text-sm">
                وصول مبكر للمشاريع الجديدة وأولوية في التواصل مع أصحاب المشاريع
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Confirmation */}
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الاشتراك بنجاح!</h3>
            <p className="text-gray-600 mb-4">
              تم خصم المبلغ من رصيدك التجريبي وسيتم استرداده تلقائياً
            </p>
            <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                🎉 يمكنك الآن الاستمتاع بجميع مزايا الباقة!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

