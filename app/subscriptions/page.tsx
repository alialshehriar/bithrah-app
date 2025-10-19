'use client';

import { useState } from 'react';
import { subscriptions } from '@/lib/subscriptions';
import { demoConfig, formatCurrency } from '@/lib/demo-config';
import type { Subscription } from '@/types/demo-wallet';

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubscribe = async (subscription: Subscription) => {
    setSelectedPlan(subscription.id);
    
    // Create transaction
    try {
      const response = await fetch('/api/demo-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user-1',
          type: 'subscription',
          amount: -subscription.price,
          description: `اشتراك ${subscription.name} - ${subscription.duration} يوم`,
          metadata: {
            subscriptionId: subscription.id,
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowConfirmation(true);
        
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => {
          setShowConfirmation(false);
          setSelectedPlan(null);
        }, 3000);
      } else {
        alert(data.error || 'فشل في إتمام الاشتراك');
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('حدث خطأ أثناء الاشتراك');
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            الاشتراكات المميزة
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            اختر الباقة المناسبة لك
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على مزايا حصرية وتحليلات متقدمة بالذكاء الاصطناعي
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-12 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-purple-900 font-semibold text-lg mb-2">
            ✨ {demoConfig.messages.demoNotice}
          </p>
          <p className="text-purple-700">
            {demoConfig.messages.subscriptionNotice}
          </p>
          <p className="text-purple-600 text-sm mt-2">
            {demoConfig.messages.refundNotice}
          </p>
        </div>

        {/* Subscription Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {subscriptions.map((subscription, index) => (
            <div
              key={subscription.id}
              className={`relative group ${subscription.popular ? 'md:-mt-4' : ''}`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Popular Badge */}
              {subscription.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    الأكثر شعبية ⭐
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ${
                  subscription.popular 
                    ? 'md:scale-105 ring-4 ring-yellow-400 ring-opacity-50' 
                    : 'hover:scale-105 hover:shadow-2xl'
                }`}
                style={{
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-br ${subscription.gradient} p-8 text-white`}>
                  <div className="text-6xl mb-4">{subscription.icon}</div>
                  <h3 className="text-3xl font-bold mb-2">{subscription.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{subscription.price}</span>
                    <span className="text-xl opacity-90">ريال</span>
                  </div>
                  <p className="text-sm opacity-90 mt-2">لمدة {subscription.duration} يوم</p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {subscription.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(subscription)}
                    disabled={selectedPlan === subscription.id}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      subscription.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
                  >
                    {selectedPlan === subscription.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        جاري الاشتراك...
                      </span>
                    ) : (
                      'اشترك الآن'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              style={{
                animation: 'scaleIn 0.3s ease-out',
              }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  تم الاشتراك بنجاح!
                </h3>
                <p className="text-gray-600 mb-6">
                  تم خصم المبلغ من رصيدك التجريبي وسيتم استرداده تلقائياً عند انتهاء التجربة
                </p>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-purple-800 text-sm">
                    يمكنك الآن الاستمتاع بجميع مزايا الباقة المختارة
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

