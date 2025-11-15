'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../brand/Logo';
import { Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'عن بذرة', href: '/about' },
      { name: 'كيف تعمل', href: '/how-it-works' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
      { name: 'المدونة', href: '/blog' },
    ],
    projects: [
      { name: 'استكشف المشاريع', href: '/projects' },
      { name: 'أنشئ مشروعك', href: '/projects/create' },
      { name: 'قصص النجاح', href: '/success-stories' },
      { name: 'الإحصائيات', href: '/stats' },
    ],
    community: [
      { name: 'المجتمعات', href: '/communities' },
      { name: 'الفعاليات', href: '/events' },
      { name: 'لوحة الصدارة', href: '/leaderboard' },
      { name: 'الإنجازات', href: '/achievements' },
    ],
    legal: [
      { name: 'الشروط والأحكام', href: '/terms' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'سياسة الاسترجاع', href: '/refund-policy' },
      { name: 'اتفاقية المستخدم', href: '/user-agreement' },
    ],
  };

  const socialLinks = [
    { name: 'Email', icon: Mail, href: 'mailto:info@bithrahapp.com' },
    { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/966592725341' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/ali-saeed-alshehri-ar?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo variant="white" size="lg" />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              منصة التمويل الجماعي الرائدة في السعودية. نربط بين أصحاب الأفكار والمستثمرين لتحويل الأحلام إلى واقع.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-teal-400" />
                <a href="mailto:info@bithrahapp.com" className="hover:text-white transition-colors">
                  info@bithrahapp.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-teal-400" />
                <a href="tel:+966592725341" className="hover:text-white transition-colors" dir="ltr">
                  +966 59 272 5341
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-teal-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">المنصة</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">المشاريع</h3>
            <ul className="space-y-2">
              {footerLinks.projects.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">المجتمع</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">قانوني</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} بذرة. جميع الحقوق محفوظة.
            </p>
            <p className="text-sm text-gray-500">
              Developed by <span className="font-bold text-teal-400">CandlesTech</span> - <span className="font-semibold">A.S</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

