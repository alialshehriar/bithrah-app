'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Rocket, Heart, TrendingUp, Users, Calendar, Bell, Activity, Target, Zap, Plus, ArrowUpRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface DashboardData {
  stats: {
    projectsCount: number;
    backingsCount: number;
    totalBacked: number;
    points: number;
  };
  recentProjects: Array<{
    id: number;
    title: string;
    backersCount: number;
    raisedAmount: number;
    goalAmount: number;
  }>;
  recentBackings: Array<{
    id: number;
    projectId: number;
    projectTitle: string;
    amount: number;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'مشاريعي', 
      value: data?.stats.projectsCount || 0, 
      Icon: Rocket, 
      gradient: 'from-teal-500 to-cyan-500',
      link: '/profile'
    },
    { 
      label: 'دعمي', 
      value: data?.stats.backingsCount || 0, 
      Icon: Heart, 
      gradient: 'from-purple-500 to-pink-500',
      link: '/profile'
    },
    { 
      label: 'إجمالي الدعم', 
      value: `${(data?.stats.totalBacked || 0).toLocaleString()} ريال`, 
      Icon: TrendingUp, 
      gradient: 'from-teal-500 to-purple-500',
      link: '/wallet'
    },
    { 
      label: 'النقاط', 
      value: data?.stats.points || 0, 
      Icon: Zap, 
      gradient: 'from-yellow-500 to-orange-500',
      link: '/profile'
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">لوحة التحكم</h1>
            <p className="text-lg text-text-muted">نظرة عامة على حسابك ونشاطاتك</p>
          </div>
          <Link
            href="/projects/create"
            className="px-6 py-3 gradient-bg text-white rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>مشروع جديد</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.Icon;
            return (
              <Link
                key={index}
                href={stat.link}
                className="card-luxury group hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-teal transition-colors" />
                </div>
                <p className="text-3xl font-bold text-text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted font-medium">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="card-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                مشاريعي الأخيرة
              </h2>
              <Link href="/profile" className="text-teal hover:text-teal/80 text-sm font-bold transition-colors">
                عرض الكل
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-bg-secondary rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : data?.recentProjects && data.recentProjects.length > 0 ? (
              <div className="space-y-4">
                {data.recentProjects.map((project) => {
                  const progress = Math.round((project.raisedAmount / project.goalAmount) * 100);
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block p-4 bg-bg-card border border-border rounded-xl hover:bg-bg-hover hover:border-teal/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-text-primary group-hover:text-teal transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-teal font-bold text-lg">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full gradient-bg transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.backersCount} داعم
                        </span>
                        <span className="text-text-secondary font-medium">
                          {project.raisedAmount.toLocaleString()} / {project.goalAmount.toLocaleString()} ريال
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Rocket className="w-20 h-20 text-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-text-muted mb-4 text-lg">لا توجد مشاريع بعد</p>
                <Link
                  href="/projects/create"
                  className="inline-block px-6 py-3 gradient-bg text-white rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-all"
                >
                  أنشئ مشروعك الأول
                </Link>
              </div>
            )}
          </div>

          {/* Recent Backings */}
          <div className="card-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                دعمي الأخير
              </h2>
              <Link href="/profile" className="text-teal hover:text-teal/80 text-sm font-bold transition-colors">
                عرض الكل
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-bg-secondary rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : data?.recentBackings && data.recentBackings.length > 0 ? (
              <div className="space-y-4">
                {data.recentBackings.map((backing) => (
                  <Link
                    key={backing.id}
                    href={`/projects/${backing.projectId}`}
                    className="block p-4 bg-bg-card border border-border rounded-xl hover:bg-bg-hover hover:border-purple/50 transition-all duration-200 group"
                  >
                    <h3 className="font-bold text-text-primary mb-2 group-hover:text-purple transition-colors">
                      {backing.projectTitle}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple font-bold text-lg">
                        {backing.amount.toLocaleString()} ريال
                      </span>
                      <span className="text-text-muted">
                        {new Date(backing.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-20 h-20 text-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-text-muted mb-4 text-lg">لم تدعم أي مشروع بعد</p>
                <Link
                  href="/projects"
                  className="inline-block px-6 py-3 gradient-bg text-white rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-all"
                >
                  استكشف المشاريع
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-luxury">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/projects/create"
              className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal/30 rounded-xl hover:border-teal hover:shadow-glow transition-all duration-300 group"
            >
              <Rocket className="w-10 h-10 text-teal mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-text-primary mb-1">أنشئ مشروع</h3>
              <p className="text-sm text-text-muted">ابدأ مشروعك الجديد الآن</p>
            </Link>
            <Link
              href="/projects"
              className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple/30 rounded-xl hover:border-purple hover:shadow-glow transition-all duration-300 group"
            >
              <Target className="w-10 h-10 text-purple mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-text-primary mb-1">استكشف المشاريع</h3>
              <p className="text-sm text-text-muted">ادعم المشاريع المبتكرة</p>
            </Link>
            <Link
              href="/communities"
              className="p-6 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-teal/30 rounded-xl hover:border-teal hover:shadow-glow transition-all duration-300 group"
            >
              <Users className="w-10 h-10 text-teal mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-text-primary mb-1">انضم للمجتمعات</h3>
              <p className="text-sm text-text-muted">تواصل مع رواد الأعمال</p>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

