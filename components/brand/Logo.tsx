'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className = '' 
}) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
    xl: { icon: 48, text: 'text-3xl' }
  };

  const colors = {
    default: {
      primary: '#14B8A6',
      secondary: '#8B5CF6',
      text: 'text-gray-900'
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#F0F0F0',
      text: 'text-white'
    },
    dark: {
      primary: '#14B8A6',
      secondary: '#8B5CF6',
      text: 'text-gray-900'
    }
  };

  const currentSize = sizes[size];
  const currentColors = colors[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Seed/Sprout Design */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Seed/Drop Shape */}
        <path
          d="M24 4C24 4 14 10 14 20C14 26.6274 19.3726 32 26 32C32.6274 32 38 26.6274 38 20C38 10 28 4 28 4C28 4 26 2 24 4Z"
          fill={`url(#gradient-${variant})`}
        />
        
        {/* Sprout Leaf */}
        <path
          d="M24 18C24 18 20 16 18 20C18 23 20 25 23 25C23 25 24 24 24 22V18Z"
          fill={currentColors.secondary}
          opacity="0.8"
        />
        
        {/* Stem */}
        <path
          d="M24 28V44"
          stroke={currentColors.primary}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Roots */}
        <path
          d="M24 44C24 44 20 46 18 44M24 44C24 44 28 46 30 44"
          stroke={currentColors.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id={`gradient-${variant}`}
            x1="14"
            y1="4"
            x2="38"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={currentColors.primary} />
            <stop offset="1" stopColor={currentColors.secondary} />
          </linearGradient>
        </defs>
      </svg>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${currentSize.text} ${currentColors.text} tracking-tight`}>
          بذرة
        </span>
      )}
    </div>
  );
};

export default Logo;

