'use client';
import MainLayout from '@/components/layout/MainLayout';
import { Rocket } from 'lucide-react';

export default function Page() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card-luxury text-center py-20">
          <Rocket className="w-20 h-20 text-teal mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text mb-4">قيد التطوير</h1>
          <p className="text-text-muted">هذه الصفحة قيد التطوير وستكون جاهزة قريباً</p>
        </div>
      </div>
    </MainLayout>
  );
}
