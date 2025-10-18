import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Check if sandbox mode is enabled
 */
export async function isSandboxMode(): Promise<boolean> {
  try {
    const [sandboxSetting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'sandbox_mode'))
      .limit(1);

    if (!sandboxSetting) {
      return false;
    }

    const value = sandboxSetting.value as { enabled: boolean };
    return value.enabled || false;
  } catch (error) {
    console.error('Error checking sandbox mode:', error);
    return false;
  }
}

/**
 * Generate dummy data for projects
 */
export function generateDummyProjects(count: number = 6) {
  const categories = ['تقنية', 'صحة', 'تعليم', 'أعمال', 'فن', 'رياضة'];
  const statuses = ['active', 'funded', 'completed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1000,
    title: `مشروع تجريبي ${i + 1}`,
    description: 'هذا مشروع تجريبي للعرض فقط. البيانات الحقيقية ستظهر عند تعطيل وضع Sandbox.',
    image: `https://picsum.photos/seed/${i + 1}/800/600`,
    category: categories[i % categories.length],
    fundingGoal: (i + 1) * 50000,
    currentFunding: (i + 1) * 30000,
    backersCount: (i + 1) * 10,
    daysLeft: 30 - (i * 3),
    status: statuses[i % statuses.length],
    creator: {
      name: `مستخدم تجريبي ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    },
  }));
}

/**
 * Generate dummy data for communities
 */
export function generateDummyCommunities(count: number = 6) {
  const categories = ['technology', 'business', 'health', 'education', 'art', 'sports'];
  const privacyOptions = ['public', 'private'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 2000,
    name: `مجتمع تجريبي ${i + 1}`,
    description: 'هذا مجتمع تجريبي للعرض فقط. البيانات الحقيقية ستظهر عند تعطيل وضع Sandbox.',
    category: categories[i % categories.length],
    privacy: privacyOptions[i % privacyOptions.length],
    coverImage: `https://picsum.photos/seed/community${i + 1}/1200/400`,
    memberCount: (i + 1) * 50,
    postCount: (i + 1) * 20,
    creator: {
      id: i + 100,
      name: `مستخدم تجريبي ${i + 1}`,
      username: `user${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=community${i + 1}`,
    },
  }));
}

/**
 * Generate dummy stats
 */
export function generateDummyStats() {
  return {
    totalProjects: 156,
    totalFunding: 5420000,
    totalBackers: 3240,
    successRate: 87,
  };
}

/**
 * Generate dummy user data
 */
export function generateDummyUser() {
  return {
    id: 9999,
    name: 'مستخدم تجريبي',
    email: 'demo@bithrahapp.com',
    username: 'demo_user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    role: 'user',
    level: 5,
    points: 1250,
    experience: 4500,
    subscriptionTier: 'premium',
  };
}

/**
 * Merge real data with dummy data based on sandbox mode
 */
export async function getMergedData<T>(
  realData: T[],
  dummyDataGenerator: () => T[],
  minCount: number = 6
): Promise<T[]> {
  const sandboxEnabled = await isSandboxMode();
  
  if (sandboxEnabled) {
    // In sandbox mode, show dummy data
    return dummyDataGenerator();
  }
  
  // In production mode, show real data
  // If real data is less than minCount, we can optionally pad with dummy data
  // but for now, just return real data
  return realData;
}

