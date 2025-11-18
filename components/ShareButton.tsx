'use client';

import { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function ShareButton({ 
  url, 
  title, 
  description, 
  variant = 'primary',
  size = 'md'
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'twitter' | 'telegram' | 'native') => {
    const text = `${title}\n${description || ''}\n${url}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text: description,
              url,
            });
          } catch (err) {
            console.error('Error sharing:', err);
          }
        }
        break;
    }
    setShowMenu(false);
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-[#14B8A6] transition-all shadow-lg hover:shadow-xl"
        >
          <Share2 className={iconSizes[size]} />
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px]"
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-green-600">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-bold text-gray-900">نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-bold text-gray-900">واتساب</span>
                  </button>

                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-sm font-bold text-gray-900">تويتر (X)</span>
                  </button>

                  <button
                    onClick={() => handleShare('telegram')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                  >
                    <Send className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-gray-900">تيليجرام</span>
                  </button>

                  {navigator.share && (
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right border-t border-gray-100 mt-1 pt-3"
                    >
                      <Share2 className="w-5 h-5 text-[#14B8A6]" />
                      <span className="text-sm font-bold text-gray-900">مشاركة...</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          ${sizeClasses[size]}
          ${variant === 'primary' 
            ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white hover:shadow-2xl' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
          rounded-xl font-bold transition-all flex items-center gap-2
        `}
      >
        <Share2 className={iconSizes[size]} />
        مشاركة
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px]"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-bold text-green-600">تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-bold text-gray-900">نسخ الرابط</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-gray-900">واتساب</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm font-bold text-gray-900">تويتر (X)</span>
                </button>

                <button
                  onClick={() => handleShare('telegram')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <Send className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-gray-900">تيليجرام</span>
                </button>

                {navigator.share && (
                  <button
                    onClick={() => handleShare('native')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right border-t border-gray-100 mt-1 pt-3"
                  >
                    <Share2 className="w-5 h-5 text-[#14B8A6]" />
                    <span className="text-sm font-bold text-gray-900">مشاركة...</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
