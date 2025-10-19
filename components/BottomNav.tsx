'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home, Rocket, Plus, Users, Trophy, Lightbulb
} from 'lucide-react';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [notificationCount] = useState(3); // Placeholder - replace with actual API call

  const navItems = [
    { name: 'الرئيسية', icon: Home, href: '/home', color: 'text-blue-600' },
    { name: 'المشاريع', icon: Rocket, href: '/projects', color: 'text-purple-600' },
    { name: 'إنشاء', icon: Plus, href: '#', color: 'text-white', isCenter: true },
    { name: 'المجتمعات', icon: Users, href: '/communities', color: 'text-teal-600' },
    { name: 'الصدارة', icon: Trophy, href: '/leaderboard', color: 'text-amber-600' },
  ];

  const createMenuItems = [
    { name: 'إنشاء مشروع', icon: Rocket, href: '/projects/create', color: 'from-purple-600 to-purple-700' },
    { name: 'تقييم فكرة', icon: Lightbulb, href: '/evaluate', color: 'from-amber-600 to-orange-600' },
  ];

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCreateMenu(!showCreateMenu);
  };

  return (
    <>
      {/* Create Menu Overlay */}
      {showCreateMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setShowCreateMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-[calc(100%-2rem)] max-w-sm"
          >
            <div className="space-y-2">
              {createMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowCreateMenu(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r hover:shadow-lg transition-all group"
                  style={{
                    background: `linear-gradient(to right, ${item.color.includes('purple') ? '#9333ea' : '#d97706'}, ${item.color.includes('purple') ? '#7e22ce' : '#ea580c'})`
                  }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon className="text-white" size={20} />
                  </div>
                  <span className="text-white font-bold text-base">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.isCenter) {
                return (
                  <button
                    key={item.name}
                    onClick={handleCreateClick}
                    className="relative -mt-8"
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center"
                    >
                      <Icon className="text-white" size={28} />
                    </motion.div>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-2 px-4 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`transition-colors ${
                      isActive ? item.color : 'text-gray-400'
                    }`}
                  >
                    <Icon size={24} />
                  </motion.div>
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isActive ? item.color : 'text-gray-400'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Nav Spacer */}
      <div className="h-20"></div>
    </>
  );
}

