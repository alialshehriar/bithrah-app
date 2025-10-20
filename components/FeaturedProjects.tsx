'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Target, Sparkles } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  backersCount: number;
  daysLeft: number;
  imageUrl?: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch('/api/projects?featured=true&limit=5');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.projects) {
          setProjects(data.projects.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Auto-play carousel
  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(nextProject, 5000);
      return () => clearInterval(interval);
    }
  }, [projects.length, currentIndex]);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];
  const progress = (currentProject.currentAmount / currentProject.targetAmount) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 px-6 py-3 rounded-full mb-4"
          >
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
            <span className="font-bold text-gray-700">المشاريع المميزة</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            اكتشف أفضل المشاريع
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            مشاريع مختارة بعناية تستحق دعمك واهتمامك
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="relative"
              >
                <Link href={`/projects/${currentProject.id}`}>
                  <div className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-3xl p-8 md:p-12 hover:border-[#14B8A6] transition-all duration-300 group">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/5 to-[#8B5CF6]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative grid md:grid-cols-2 gap-8 items-center">
                      {/* Project Info */}
                      <div className="space-y-6">
                        <div>
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-full text-sm font-bold mb-4">
                            {currentProject.category}
                          </span>
                          
                          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 group-hover:text-[#14B8A6] transition-colors">
                            {currentProject.title}
                          </h3>
                          
                          <p className="text-lg text-gray-600 leading-relaxed line-clamp-3">
                            {currentProject.description}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-black text-gray-900">
                              {currentProject.currentAmount?.toLocaleString('ar-SA') || '0'} ر.س
                            </span>
                            <span className="text-sm text-gray-500">
                              من {currentProject.targetAmount?.toLocaleString('ar-SA') || '0'} ر.س
                            </span>
                          </div>
                          
                          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#14B8A6] to-[#8B5CF6] rounded-full"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-bold text-[#14B8A6]">{Math.round(progress)}%</span>
                            <span>مكتمل</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-2xl font-black text-gray-900">{currentProject.backersCount}</div>
                              <div className="text-xs text-gray-500">داعم</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                            <div className="p-2 bg-orange-50 rounded-lg">
                              <Target className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="text-2xl font-black text-gray-900">{currentProject.daysLeft}</div>
                              <div className="text-xs text-gray-500">يوم متبقي</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Image/Illustration */}
                      <div className="hidden md:flex items-center justify-center">
                        <div className="relative w-full h-80 bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 rounded-2xl flex items-center justify-center">
                          <TrendingUp className="w-32 h-32 text-[#14B8A6] opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
            aria-label="المشروع السابق"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
            aria-label="المشروع التالي"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`الذهاب إلى المشروع ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            <span>استكشف جميع المشاريع</span>
            <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

