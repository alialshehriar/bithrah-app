import type { SupportPackage } from '@/types/demo-wallet';

/**
 * Support Packages for Projects
 * These packages can be purchased by supporters to back projects
 */
export const supportPackages: SupportPackage[] = [
  {
    id: 'bronze',
    name: 'باقة البرونز',
    amount: 1000,
    benefits: [
      'شكر خاص في صفحة المشروع',
      'تحديثات دورية عن المشروع',
      'شارة داعم برونزي',
    ],
    icon: '🥉',
    color: 'from-amber-700 to-amber-900',
  },
  {
    id: 'silver',
    name: 'باقة الفضة',
    amount: 5000,
    benefits: [
      'جميع مزايا باقة البرونز',
      'ذكر اسمك في قائمة الداعمين المميزين',
      'دعوة لحضور فعاليات المشروع',
      'شارة داعم فضي',
    ],
    icon: '🥈',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'gold',
    name: 'باقة الذهب',
    amount: 10000,
    benefits: [
      'جميع مزايا باقة الفضة',
      'لقاء خاص مع صاحب المشروع',
      'تقرير شهري مفصل عن تقدم المشروع',
      'أولوية في الحصول على المنتج/الخدمة',
      'شارة داعم ذهبي',
    ],
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'platinum',
    name: 'باقة البلاتين',
    amount: 25000,
    benefits: [
      'جميع مزايا باقة الذهب',
      'مشاركة في اتخاذ قرارات المشروع',
      'نسبة من الأرباح (حسب الاتفاق)',
      'ذكر اسمك كشريك استراتيجي',
      'دعوة لحضور اجتماعات مجلس الإدارة',
      'شارة داعم بلاتيني',
    ],
    icon: '💎',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'custom',
    name: 'باقة مخصصة',
    amount: 0, // Custom amount
    benefits: [
      'مزايا مخصصة حسب المبلغ',
      'تفاوض مباشر مع صاحب المشروع',
      'شروط خاصة',
    ],
    icon: '⚡',
    color: 'from-indigo-400 to-indigo-600',
  },
];

/**
 * Get package by ID
 */
export function getPackageById(id: string): SupportPackage | undefined {
  return supportPackages.find(pkg => pkg.id === id);
}

/**
 * Get package by amount range
 */
export function getPackageByAmount(amount: number): SupportPackage | undefined {
  if (amount >= 25000) return supportPackages.find(p => p.id === 'platinum');
  if (amount >= 10000) return supportPackages.find(p => p.id === 'gold');
  if (amount >= 5000) return supportPackages.find(p => p.id === 'silver');
  if (amount >= 1000) return supportPackages.find(p => p.id === 'bronze');
  return undefined;
}

