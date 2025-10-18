'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Trophy, Medal, Award, Star, TrendingUp, Crown, Zap,
  Target, Users, Rocket, Shield, Heart, DollarSign,
  Calendar, Filter, Search, ChevronDown, Lock, CheckCircle
} from 'lucide-react';

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  level: number;
  points: number;
  rank: number;
  projectsCreated: number;
  projectsBacked: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'creators' | 'backers'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setCurrentUser(data.currentUser || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-teal-500" />
            <h1 className="text-4xl font-bold gradient-text">لوحة الصدارة</h1>
          </div>
          <p className="text-gray-600 text-lg">تنافس مع رواد الأعمال والمستثمرين</p>
        </div>

        {currentUser && (
          <div className="card-luxury mb-8 bg-gradient-to-r from-teal-50 to-purple-50 border-2 border-teal-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar || '/default-avatar.png'}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  #{currentUser.rank}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-700">{currentUser.points} نقطة</span>
                  </div>
                  <div className="badge-teal">المستوى {currentUser.level}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card-luxury mb-6">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'الكل', icon: Users },
              { key: 'creators', label: 'المبدعون', icon: Rocket },
              { key: 'backers', label: 'الداعمون', icon: Heart },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-glow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-luxury">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((user, idx) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
                    idx < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-12 text-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-14 h-14 rounded-full border-2 border-white shadow"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{user.points} نقطة</span>
                      </div>
                      <div className="badge-teal text-xs">المستوى {user.level}</div>
                    </div>
                  </div>
                  <div className="text-left text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      <span>{user.projectsCreated} مشروع</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Heart className="w-4 h-4" />
                      <span>{user.projectsBacked} دعم</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p>لا توجد بيانات بعد</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
