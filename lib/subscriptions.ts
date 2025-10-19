import type { Subscription } from '@/types/demo-wallet';

/**
 * Platform Subscriptions
 * Premium tiers for supporters and investors
 */
export const subscriptions: Subscription[] = [
  {
    id: 'silver',
    name: 'الفضي',
    nameEn: 'silver',
    price: 99,
    duration: 30, // days
    features: [
      'إشعارات مبكرة للمشاريع الجديدة',
      'تنبيهات للمشاريع القريبة من الاكتمال',
      'وصول لمجتمعات حصرية',
      'تحليلات أساسية بالذكاء الاصطناعي',
      'خصم 5% على رسوم التفاوض',
    ],
    icon: '🥈',
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    popular: false,
  },
  {
    id: 'gold',
    name: 'الذهبي',
    nameEn: 'gold',
    price: 199,
    duration: 30, // days
    features: [
      'جميع مزايا الباقة الفضية',
      'وصول للمجتمعات الذهبية الحصرية',
      'تحليلات متقدمة بالذكاء الاصطناعي',
      'توصيات مشاريع مخصصة',
      'أولوية في التواصل مع أصحاب المشاريع',
      'خصم 10% على رسوم التفاوض',
      'تقارير شهرية مفصلة',
    ],
    icon: '🥇',
    color: 'yellow',
    gradient: 'from-yellow-400 to-yellow-600',
    popular: true,
  },
  {
    id: 'platinum',
    name: 'البلاتيني',
    nameEn: 'platinum',
    price: 399,
    duration: 30, // days
    features: [
      'جميع مزايا الباقة الذهبية',
      'وصول مبكر حصري للمشاريع',
      'مستشار استثماري شخصي',
      'تحليلات AI متقدمة وتنبؤات',
      'أولوية قصوى في جميع الميزات',
      'خصم 20% على رسوم التفاوض',
      'دعوات لفعاليات VIP',
      'تقارير أسبوعية مخصصة',
      'وصول لمجتمع المستثمرين النخبة',
    ],
    icon: '💎',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-600',
    popular: false,
  },
];

/**
 * Get subscription by ID
 */
export function getSubscriptionById(id: string): Subscription | undefined {
  return subscriptions.find(sub => sub.id === id);
}

/**
 * Get subscription by name
 */
export function getSubscriptionByName(nameEn: string): Subscription | undefined {
  return subscriptions.find(sub => sub.nameEn === nameEn);
}

/**
 * Calculate discount for negotiation fee based on subscription
 */
export function getNegotiationDiscount(subscriptionId: string): number {
  switch (subscriptionId) {
    case 'silver':
      return 0.05; // 5%
    case 'gold':
      return 0.10; // 10%
    case 'platinum':
      return 0.20; // 20%
    default:
      return 0;
  }
}

