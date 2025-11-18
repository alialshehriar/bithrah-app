'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  userId: number;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  variant = 'primary',
  size = 'md',
  showIcon = true,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      setIsChecking(true);
      const response = await fetch(`/api/users/${userId}/follow`);
      const data = await response.json();
      
      if (data.success) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Failed to check follow status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      });

      const data = await response.json();

      if (data.success) {
        const newFollowStatus = !isFollowing;
        setIsFollowing(newFollowStatus);
        onFollowChange?.(newFollowStatus);
      } else {
        alert(data.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      alert('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${
          size === 'sm' ? 'px-3 py-1.5 text-sm' :
          size === 'md' ? 'px-4 py-2' :
          'px-6 py-3 text-lg'
        } bg-gray-100 text-gray-400 cursor-not-allowed`}
      >
        <Loader2 className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      </button>
    );
  }

  const baseClasses = `flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${
    size === 'sm' ? 'px-3 py-1.5 text-sm' :
    size === 'md' ? 'px-4 py-2' :
    'px-6 py-3 text-lg'
  }`;

  if (isFollowing) {
    // Already following - show unfollow button
    return (
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={`${baseClasses} ${
          variant === 'primary'
            ? 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
            : 'border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <Loader2 className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        ) : (
          showIcon && <UserMinus className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
        )}
        <span>إلغاء المتابعة</span>
      </button>
    );
  }

  // Not following - show follow button
  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`${baseClasses} ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white hover:shadow-xl'
          : 'border-2 border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <Loader2 className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      ) : (
        showIcon && <UserPlus className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      )}
      <span>متابعة</span>
    </button>
  );
}
