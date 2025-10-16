'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home, Rocket, Users, Sparkles, Gift, Bell,
  Wallet, User, Menu, X, TrendingUp, Trophy, MessageCircle,
  Calendar, Award, Settings, Shield, Crown
} from 'lucide-react';
import DemoBanner from './DemoBanner';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          // Check if admin (you can add admin role check here)
          setIsAdmin(true); // For now, all logged in users can access admin
          fetchNotifications();
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?unreadOnly=true');
      const data = await response.json();
      setNotifications(data.notifications?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = isLoggedIn ? [
    { href: '/home', label: 'الرئيسية', icon: Home },
    { href: '/dashboard', label: 'لوحة التحكم', icon: TrendingUp },
    { href: '/projects', label: 'المشاريع', icon: Rocket },
    { href: '/communities', label: 'المجتمعات', icon: Users },
    { href: '/events', label: 'الفعاليات', icon: Calendar },
    { href: '/leaderboard', label: 'لوحة الصدارة', icon: Trophy },
    { href: '/achievements', label: 'الإنجازات', icon: Award },
    { href: '/messages', label: 'المحادثات', icon: MessageCircle },
  ] : [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/projects', label: 'المشاريع', icon: Rocket },
    { href: '/communities', label: 'المجتمعات', icon: Users },
    { href: '/events', label: 'الفعاليات', icon: Calendar },
    { href: '/leaderboard', label: 'لوحة الصدارة', icon: Trophy },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <DemoBanner />
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href={isLoggedIn ? '/home' : '/'} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] p-3 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] bg-clip-text text-transparent">
                  بذرة
                </h1>
                <p className="text-xs text-gray-500 font-medium">منصة التمويل الجماعي</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Admin Button */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transition-all relative group"
                    >
                      <Crown className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all relative"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Link>

                  {/* Wallet */}
                  <Link
                    href="/wallet"
                    className="p-3 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] text-white hover:shadow-xl transition-all"
                  >
                    <Wallet className="w-5 h-5" />
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/settings"
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-6 py-2 text-gray-700 font-medium hover:text-[#14B8A6] transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      >
                        <Crown className="w-5 h-5" />
                        <span>لوحة الإدارة</span>
                      </Link>
                    )}

                    <Link
                      href="/notifications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Bell className="w-5 h-5" />
                      <span>الإشعارات</span>
                      {notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                          {notifications}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/wallet"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Wallet className="w-5 h-5" />
                      <span>المحفظة</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-5 h-5" />
                      <span>الإعدادات</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-center text-gray-700 font-medium hover:bg-gray-100 rounded-xl"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-center bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

