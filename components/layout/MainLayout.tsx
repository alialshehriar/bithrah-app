'use client';

import TopNav from './TopNav';
import BottomNav from './BottomNav';
import BetaBanner from '../BetaBanner';

interface MainLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showTopNav?: boolean;
}

export default function MainLayout({ 
  children, 
  showBottomNav = true, 
  showTopNav = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BetaBanner />
      {showTopNav && <TopNav />}
      
      <main className={`${showTopNav ? 'pt-16' : ''} ${showBottomNav ? 'pb-16' : ''}`}>
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}

