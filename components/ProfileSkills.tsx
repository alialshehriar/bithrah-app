'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Megaphone, TrendingUp, Users, Zap } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  level: number; // 1-100
  category: string;
  endorsements: number;
}

interface ProfileSkillsProps {
  skills: Skill[];
}

const categoryIcons: Record<string, any> = {
  'تقني': Code,
  'تصميم': Palette,
  'تسويق': Megaphone,
  'أعمال': TrendingUp,
  'قيادة': Users,
  'أخرى': Zap,
};

const getLevelLabel = (level: number) => {
  if (level >= 90) return 'خبير';
  if (level >= 70) return 'متقدم';
  if (level >= 50) return 'متوسط';
  if (level >= 30) return 'مبتدئ';
  return 'أساسي';
};

const getLevelColor = (level: number) => {
  if (level >= 90) return 'from-purple-500 to-pink-500';
  if (level >= 70) return 'from-blue-500 to-cyan-500';
  if (level >= 50) return 'from-green-500 to-teal-500';
  if (level >= 30) return 'from-yellow-500 to-orange-500';
  return 'from-gray-400 to-gray-500';
};

export default function ProfileSkills({ skills }: ProfileSkillsProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">لم يتم إضافة مهارات بعد</p>
      </div>
    );
  }

  // Group by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
        const Icon = categoryIcons[category] || Zap;
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{category}</h3>
              <span className="text-sm text-gray-500">({categorySkills.length})</span>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Skill Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {getLevelLabel(skill.level)} • {skill.endorsements} توصية
                      </p>
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${getLevelColor(skill.level)} text-white text-xs font-bold rounded-full`}>
                      {skill.level}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: (categoryIndex * 0.1) + (index * 0.05) + 0.3 }}
                      className={`absolute inset-y-0 right-0 bg-gradient-to-l ${getLevelColor(skill.level)} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

