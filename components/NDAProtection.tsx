'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NDAProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    // Routes that don't require NDA
    const exemptRoutes = ['/nda-agreement', '/auth', '/api'];
    const isExempt = exemptRoutes.some(route => pathname.startsWith(route));

    if (isExempt) {
      setIsChecking(false);
      setHasAccepted(true);
      return;
    }

    // Check for NDA cookie
    const cookies = document.cookie.split(';');
    const ndaCookie = cookies.find(c => c.trim().startsWith('nda-accepted='));
    const hasNDA = ndaCookie?.includes('true');

    if (!hasNDA) {
      // Redirect to NDA page
      router.push('/nda-agreement');
    } else {
      setHasAccepted(true);
    }
    
    setIsChecking(false);
  }, [pathname, router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show content only if NDA accepted
  if (!hasAccepted) {
    return null;
  }

  return <>{children}</>;
}

