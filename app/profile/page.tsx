'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Trophy, Gift, Copy, Check,
  TrendingUp, Zap, Star, Target, Crown, Shield, Sparkles
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'activities'>('overview');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const sessionRes = await fetch('/api/user/profile');
      const sessionData = await sessionRes.json();
      
      if (!sessionData.success) {
        window.location.href = '/auth/signin?redirect=/profile';
        return;
      }

      const profileRes = await fetch(`/api/users/${sessionData.user.id}`);
      const data = await profileRes.json();
      
      setProfileData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (profileData?.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { user, level, referralCode, rewards: userRewards, activities } = profileData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">@{user?.username}</p>
              
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{level?.level || 1}</div>
                  <div className="text-sm text-gray-600">المستوى</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{level?.totalPoints || 0}</div>
                  <div className="text-sm text-gray-600">النقاط</div>
                </div>
              </div>
            </div>

            {referralCode && (
              <div className="bg-gradient-to-br from-purple-100 to-teal-100 rounded-2xl p-4">
                <div className="text-sm text-gray-600 mb-2">كود الإحالة</div>
                <div className="flex items-center gap-2">
                  <code className="text-xl font-bold text-purple-600">{referralCode}</code>
                  <button onClick={copyReferralCode} className="p-2 hover:bg-white/50 rounded-lg">
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-purple-600" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex gap-4 mb-6">
          {['overview', 'rewards', 'activities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600'
              }`}
            >
              {tab === 'overview' && 'نظرة عامة'}
              {tab === 'rewards' && `المكافآت (${userRewards?.length || 0})`}
              {tab === 'activities' && `النشاطات (${activities?.length || 0})`}
            </button>
          ))}
        </div>

        {activeTab === 'rewards' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6">المكافآت</h3>
            <div className="space-y-4">
              {userRewards?.map((reward: any) => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Gift className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-semibold">{reward.description}</div>
                      <div className="text-sm text-gray-600">{new Date(reward.createdAt).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">+{reward.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
