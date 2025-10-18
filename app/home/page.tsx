'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/layout/Footer';
import DemoBanner from '@/components/DemoBanner';
import { 
  Rocket, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight,
  Target,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  backersCount: number;
  daysLeft: number;
  creator: {
    name: string;
    avatar: string;
  };
  status: string;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFunding: 0,
    totalBackers: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=active&limit=6');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <DemoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              حوّل <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600">أفكارك</span> إلى واقع
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              منصة التمويل الجماعي الرائدة في السعودية. نربط بين أصحاب الأفكار والمستثمرين لتحويل الأحلام إلى مشاريع ناجحة
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/projects/create"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                ابدأ مشروعك الآن
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:shadow-xl transition-all border-2 border-gray-200"
              >
                استكشف المشاريع
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {[
              { label: 'مشروع نشط', value: stats.totalProjects, icon: Rocket },
              { label: 'إجمالي التمويل', value: `${stats.totalFunding.toLocaleString()} ر.س`, icon: TrendingUp },
              { label: 'داعم', value: stats.totalBackers, icon: Users },
              { label: 'نسبة النجاح', value: `${stats.successRate}%`, icon: Target },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-teal-500" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                المشاريع المميزة
              </h2>
              <p className="text-gray-600">اكتشف أحدث المشاريع الإبداعية</p>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all"
            >
              عرض الكل
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">لا توجد مشاريع متاحة حالياً</p>
              <Link
                href="/projects/create"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                كن أول من يبدأ مشروعاً
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const progress = calculateProgress(project.currentFunding, project.fundingGoal);
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Project Image */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-500 to-purple-600">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Rocket className="w-16 h-16 text-white/50" />
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-sm font-bold text-gray-900">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {project.status === 'active' && (
                          <div className="absolute top-4 left-4">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-bold">نشط</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        {/* Creator */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                            {project.creator.avatar ? (
                              <img
                                src={project.creator.avatar}
                                alt={project.creator.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">بواسطة</p>
                            <p className="text-sm font-bold text-gray-900">
                              {project.creator.name}
                            </p>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">
                              {project.currentFunding.toLocaleString()} ر.س
                            </span>
                            <span className="text-sm text-gray-600">
                              من {project.fundingGoal.toLocaleString()} ر.س
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{project.backersCount} داعم</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{project.daysLeft} يوم متبقي</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{Math.round(progress)}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-teal-500 to-purple-600 rounded-3xl p-12 text-center text-white">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">
              هل لديك فكرة مشروع رائعة؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى آلاف رواد الأعمال الذين حولوا أفكارهم إلى واقع
            </p>
            <Link
              href="/projects/create"
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:shadow-2xl transition-all"
            >
              ابدأ مشروعك الآن
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

