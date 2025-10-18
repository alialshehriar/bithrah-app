'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const navItems = [
    {
      name: 'الرئيسية',
      href: '/home',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-teal' : 'text-text-secondary'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'المشاريع',
      href: '/projects',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-teal' : 'text-text-secondary'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      name: 'إنشاء',
      href: '#',
      isCreate: true,
      icon: (active: boolean) => (
        <div className="w-14 h-14 -mt-8 rounded-2xl gradient-bg flex items-center justify-center shadow-glow hover:shadow-glow-purple transition-all duration-300 hover:scale-110 active:scale-95">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
    },
    {
      name: 'المجتمعات',
      href: '/communities',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-teal' : 'text-text-secondary'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: 'لوحة الصدارة',
      href: '/leaderboard',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-teal' : 'text-text-secondary'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const handleCreateClick = () => {
    setShowCreateMenu(!showCreateMenu);
  };

  return (
    <>
      {/* Create Menu Overlay */}
      {showCreateMenu && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setShowCreateMenu(false)}
        >
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 glass-strong rounded-2xl p-4 shadow-luxury animate-slide-up">
            <Link
              href="/projects/create"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-bg-hover transition-colors duration-200 group"
              onClick={() => setShowCreateMenu(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary">إنشاء مشروع</p>
                <p className="text-sm text-text-muted">شارك فكرتك واحصل على التمويل</p>
              </div>
            </Link>
            <Link
              href="/ai-evaluation"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-bg-hover transition-colors duration-200 group mt-2"
              onClick={() => setShowCreateMenu(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
                <svg className="w-5 h-5 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary">تقييم فكرة</p>
                <p className="text-sm text-text-muted">احصل على تقييم ذكي لفكرتك</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/5 safe-area-bottom">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              if (item.isCreate) {
                return (
                  <button
                    key={item.name}
                    onClick={handleCreateClick}
                    className="flex flex-col items-center justify-center flex-1 relative"
                  >
                    {item.icon(false)}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-all duration-200 ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {item.icon(isActive)}
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? 'text-teal' : 'text-text-muted'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-12 h-1 rounded-full gradient-bg animate-scale-in" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Safe area for bottom navigation */}
      <div className="h-16" />
    </>
  );
}

