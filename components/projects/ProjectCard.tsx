'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, Clock, TrendingUp, Eye, Heart, Star, Sparkles
} from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    goal: number;
    raised: number;
    backers: number;
    daysLeft: number;
    image?: string;
    featured?: boolean;
    trending?: boolean;
    is_demo?: boolean;
    owner?: {
      name: string;
      avatar?: string;
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = (project.raised / project.goal) * 100;
  const isNearlyFunded = progress >= 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <Link href={`/projects/${project.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="text-purple-400" size={64} />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {project.is_demo && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                  تجريبي
                </span>
              )}
              {project.featured && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                  <Star size={12} />
                  مميز
                </span>
              )}
              {project.trending && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-green-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                  <TrendingUp size={12} />
                  رائج
                </span>
              )}
            </div>

            {/* Category */}
            <div className="absolute bottom-4 right-4">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold rounded-xl shadow-md">
                {project.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Owner */}
            {project.owner && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {project.owner.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-600">{project.owner.name}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {progress.toFixed(0)}% مكتمل
                </span>
                {isNearlyFunded && (
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <TrendingUp size={14} />
                    قريب من الهدف!
                  </span>
                )}
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    isNearlyFunded
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-600 to-teal-600'
                  }`}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <DollarSign size={16} />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {project.raised.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">من {project.goal.toLocaleString()}</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                  <Users size={16} />
                </div>
                <p className="text-sm font-bold text-gray-900">{project.backers}</p>
                <p className="text-xs text-gray-500">داعم</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                  <Clock size={16} />
                </div>
                <p className="text-sm font-bold text-gray-900">{project.daysLeft}</p>
                <p className="text-xs text-gray-500">يوم متبقي</p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              استكشف المشروع
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

