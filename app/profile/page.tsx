'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Rocket, Zap, Trophy, Target, Settings, Share2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface ProfileData {
  user: {
    id: number;
    name: string;
    email: string;
    username?: string;
    bio?: string;
    avatar?: string;
    role: string;
    createdAt: string;
  };
  level: {
    level: number;
    totalPoints: number;
    nextLevelPoints: number;
  };
  stats: {
    projects: number;
    backings: number;
    followers: number;
    following: number;
  };
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'activity' | 'achievements'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg animate-pulse"></div>
            <p className="text-text-muted">جاري التحميل...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profileData) {
    return null;
  }

  const { user, level, stats, achievements } = profileData;
  const levelProgress = (level.totalPoints / level.nextLevelPoints) * 100;

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', iconName: 'BarChart3' },
    { id: 'projects', label: 'المشاريع', iconName: 'Rocket' },
    { id: 'activity', label: 'النشاط', iconName: 'Zap' },
    { id: 'achievements', label: 'الإنجازات', iconName: 'Trophy' },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Cover Image */}
        <div className="relative h-64 rounded-3xl overflow-hidden glass-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 via-purple-500/30 to-pink-500/30"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>
          <div className="absolute top-4 left-4">
            <button className="px-4 py-2 rounded-xl glass hover:glass-strong transition-all duration-200 text-text-primary text-sm font-medium">
              تغيير الغلاف
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative -mt-20 px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl gradient-bg p-1 shadow-luxury">
                <div className="w-full h-full rounded-3xl bg-bg-card flex items-center justify-center text-white text-4xl font-bold">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-3xl object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Level Badge */}
              <div className="absolute -top-2 -left-2 w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
                <div className="text-center">
                  <div className="text-xs text-white/80">المستوى</div>
                  <div className="text-lg font-bold text-white">{level.level}</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-1">{user.name}</h1>
                  <p className="text-text-secondary">@{user.username || 'username'}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  {isEditing ? 'حفظ' : 'تعديل الملف'}
                </button>
              </div>

              {/* Bio */}
              <p className="text-text-secondary mb-4 max-w-2xl">
                {user.bio || 'لم يتم إضافة نبذة تعريفية بعد'}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">{stats.projects}</span>
                  <span className="text-text-muted">مشروع</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">{stats.backings}</span>
                  <span className="text-text-muted">دعم</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">{stats.followers || 0}</span>
                  <span className="text-text-muted">متابع</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">{stats.following || 0}</span>
                  <span className="text-text-muted">يتابع</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">التقدم إلى المستوى التالي</span>
              <span className="text-sm font-medium text-teal">{level.totalPoints} / {level.nextLevelPoints} نقطة</span>
            </div>
            <div className="w-full h-3 rounded-full bg-bg-secondary overflow-hidden">
              <div 
                className="h-full gradient-bg transition-all duration-500 ease-out"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-2 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'gradient-bg text-white shadow-glow'
                  : 'text-text-secondary hover:bg-bg-hover'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About */}
              <div className="card-luxury">
                <h3 className="text-xl font-bold text-text-primary mb-4">نبذة عني</h3>
                <p className="text-text-secondary">
                  {user.bio || 'لم يتم إضافة نبذة تعريفية بعد'}
                </p>
              </div>

              {/* Skills */}
              <div className="card-luxury">
                <h3 className="text-xl font-bold text-text-primary mb-4">المهارات</h3>
                <div className="flex flex-wrap gap-2">
                  {['تطوير الأعمال', 'التسويق', 'التصميم', 'البرمجة'].map((skill, i) => (
                    <span key={i} className="badge badge-teal">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-luxury md:col-span-2">
                <h3 className="text-xl font-bold text-text-primary mb-4">النشاط الأخير</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-hover transition-colors">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">قام بدعم مشروع "تطبيق مبتكر"</p>
                        <p className="text-sm text-text-muted">منذ ساعتين</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-luxury">
                  <div className="w-full h-40 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 mb-4 flex items-center justify-center">
                    <Rocket className="w-16 h-16 text-teal" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">مشروعي {i}</h3>
                  <p className="text-sm text-text-muted mb-3">وصف المشروع</p>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-success">نشط</span>
                    <Link href={`/projects/${i}`} className="text-teal text-sm font-medium">
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements?.map((achievement, i) => (
                <div
                  key={i}
                  className={`card-luxury ${!achievement.unlocked && 'opacity-50'}`}
                >
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${achievement.unlocked ? 'gradient-bg' : 'bg-bg-secondary'} flex items-center justify-center text-4xl mb-4`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-bold text-text-primary text-center mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-text-muted text-center">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-3 text-center">
                      <span className="badge badge-success">تم الإنجاز</span>
                    </div>
                  )}
                </div>
              )) || (
                <div className="col-span-3 text-center py-12">
                  <p className="text-text-muted">لا توجد إنجازات بعد</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

