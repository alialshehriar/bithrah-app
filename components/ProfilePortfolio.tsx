'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Globe, Award, Calendar } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  url: string | null;
  githubUrl: string | null;
  tags: string[];
  achievements: string[];
  date: string;
}

interface ProfilePortfolioProps {
  items: PortfolioItem[];
}

export default function ProfilePortfolio({ items }: ProfilePortfolioProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">لا توجد أعمال في المحفظة بعد</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
        >
          {/* Image */}
          {item.image && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                {item.title}
              </h3>
              <div className="flex gap-2">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Github className="w-4 h-4 text-gray-600" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-teal-50 to-purple-50 text-teal-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Achievements */}
            {item.achievements && item.achievements.length > 0 && (
              <div className="space-y-2 mb-4">
                {item.achievements.slice(0, 2).map((achievement, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
              <Calendar className="w-4 h-4" />
              <span>{new Date(item.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

