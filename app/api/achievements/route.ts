import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { userAchievements, achievements, userBadges, badges } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Achievement definitions
export const ACHIEVEMENTS = [
  // Project Achievements
  { id: 'first_project', name: 'أول مشروع', description: 'أنشئ مشروعك الأول', icon: '🚀', category: 'projects', requirement: 1, points: 10 },
  { id: 'project_master', name: 'خبير المشاريع', description: 'أنشئ 5 مشاريع', icon: '🏆', category: 'projects', requirement: 5, points: 50 },
  { id: 'project_legend', name: 'أسطورة المشاريع', description: 'أنشئ 10 مشاريع', icon: '👑', category: 'projects', requirement: 10, points: 100 },
  { id: 'funded_project', name: 'مشروع ممول', description: 'احصل على تمويل كامل لمشروع', icon: '💰', category: 'projects', requirement: 1, points: 25 },
  { id: 'multiple_funded', name: 'رائد أعمال', description: '3 مشاريع ممولة بالكامل', icon: '🌟', category: 'projects', requirement: 3, points: 75 },
  
  // Support Achievements
  { id: 'first_support', name: 'أول دعم', description: 'ادعم مشروعك الأول', icon: '❤️', category: 'support', requirement: 1, points: 10 },
  { id: 'supporter', name: 'داعم نشط', description: 'ادعم 5 مشاريع', icon: '🎁', category: 'support', requirement: 5, points: 30 },
  { id: 'mega_supporter', name: 'داعم خارق', description: 'ادعم 20 مشروع', icon: '⭐', category: 'support', requirement: 20, points: 100 },
  { id: 'generous_supporter', name: 'داعم كريم', description: 'تبرع بأكثر من 10,000 ريال', icon: '💎', category: 'support', requirement: 10000, points: 150 },
  
  // Community Achievements
  { id: 'first_community', name: 'عضو مجتمع', description: 'انضم لأول مجتمع', icon: '👥', category: 'community', requirement: 1, points: 10 },
  { id: 'community_creator', name: 'منشئ مجتمع', description: 'أنشئ مجتمعك الأول', icon: '🏘️', category: 'community', requirement: 1, points: 25 },
  { id: 'popular_community', name: 'مجتمع شعبي', description: 'مجتمعك به 100 عضو', icon: '🔥', category: 'community', requirement: 100, points: 75 },
  { id: 'community_leader', name: 'قائد مجتمعات', description: 'أنشئ 5 مجتمعات', icon: '👨‍💼', category: 'community', requirement: 5, points: 100 },
  
  // Engagement Achievements
  { id: 'first_post', name: 'أول منشور', description: 'انشر أول منشور', icon: '📝', category: 'engagement', requirement: 1, points: 5 },
  { id: 'active_poster', name: 'ناشر نشط', description: 'انشر 50 منشور', icon: '📢', category: 'engagement', requirement: 50, points: 50 },
  { id: 'first_comment', name: 'أول تعليق', description: 'اكتب أول تعليق', icon: '💬', category: 'engagement', requirement: 1, points: 5 },
  { id: 'commentator', name: 'معلق نشط', description: 'اكتب 100 تعليق', icon: '🗨️', category: 'engagement', requirement: 100, points: 50 },
  
  // Negotiation Achievements
  { id: 'first_negotiation', name: 'أول تفاوض', description: 'ابدأ أول تفاوض', icon: '🤝', category: 'negotiation', requirement: 1, points: 15 },
  { id: 'successful_deal', name: 'صفقة ناجحة', description: 'أتمم صفقة تفاوض', icon: '✅', category: 'negotiation', requirement: 1, points: 30 },
  { id: 'deal_maker', name: 'صانع صفقات', description: 'أتمم 10 صفقات', icon: '🎯', category: 'negotiation', requirement: 10, points: 150 },
  
  // Level Achievements
  { id: 'level_5', name: 'المستوى 5', description: 'وصلت للمستوى 5', icon: '🥉', category: 'level', requirement: 5, points: 25 },
  { id: 'level_10', name: 'المستوى 10', description: 'وصلت للمستوى 10', icon: '🥈', category: 'level', requirement: 10, points: 50 },
  { id: 'level_25', name: 'المستوى 25', description: 'وصلت للمستوى 25', icon: '🥇', category: 'level', requirement: 25, points: 100 },
  { id: 'level_50', name: 'المستوى 50', description: 'وصلت للمستوى 50', icon: '💫', category: 'level', requirement: 50, points: 250 },
  
  // Referral Achievements
  { id: 'first_referral', name: 'أول إحالة', description: 'أحل أول مستخدم', icon: '🔗', category: 'referral', requirement: 1, points: 20 },
  { id: 'referral_master', name: 'خبير الإحالات', description: 'أحل 10 مستخدمين', icon: '🌐', category: 'referral', requirement: 10, points: 100 },
  { id: 'referral_legend', name: 'أسطورة الإحالات', description: 'أحل 50 مستخدم', icon: '🚀', category: 'referral', requirement: 50, points: 500 },
  
  // Special Achievements
  { id: 'early_adopter', name: 'مستخدم مبكر', description: 'انضممت في الشهر الأول', icon: '🌅', category: 'special', requirement: 1, points: 50 },
  { id: 'verified_user', name: 'مستخدم موثق', description: 'وثق حسابك', icon: '✓', category: 'special', requirement: 1, points: 10 },
  { id: 'profile_complete', name: 'ملف كامل', description: 'أكمل ملفك الشخصي 100%', icon: '📋', category: 'special', requirement: 1, points: 15 },
  { id: 'social_butterfly', name: 'اجتماعي', description: 'تابع 50 مستخدم', icon: '🦋', category: 'special', requirement: 50, points: 30 },
];

// Badge definitions
export const BADGES = [
  // Tier Badges
  { id: 'bronze', name: 'برونزي', description: 'وصلت للمستوى 5', icon: '🥉', tier: 'bronze', requirement: 5 },
  { id: 'silver', name: 'فضي', description: 'وصلت للمستوى 10', icon: '🥈', tier: 'silver', requirement: 10 },
  { id: 'gold', name: 'ذهبي', description: 'وصلت للمستوى 25', icon: '🥇', tier: 'gold', requirement: 25 },
  { id: 'platinum', name: 'بلاتيني', description: 'وصلت للمستوى 50', icon: '💎', tier: 'platinum', requirement: 50 },
  { id: 'diamond', name: 'ماسي', description: 'وصلت للمستوى 100', icon: '💠', tier: 'diamond', requirement: 100 },
  
  // Role Badges
  { id: 'entrepreneur', name: 'رائد أعمال', description: '5 مشاريع ممولة', icon: '💼', tier: 'special', requirement: 5 },
  { id: 'investor', name: 'مستثمر', description: 'استثمر في 10 مشاريع', icon: '💰', tier: 'special', requirement: 10 },
  { id: 'community_leader', name: 'قائد مجتمع', description: 'مجتمع به 100+ عضو', icon: '👑', tier: 'special', requirement: 100 },
  { id: 'influencer', name: 'مؤثر', description: '1000+ متابع', icon: '⭐', tier: 'special', requirement: 1000 },
  
  // Achievement Badges
  { id: 'achiever', name: 'محقق', description: 'أكمل 10 إنجازات', icon: '🏆', tier: 'special', requirement: 10 },
  { id: 'completionist', name: 'مكمل', description: 'أكمل 25 إنجاز', icon: '🎯', tier: 'special', requirement: 25 },
  { id: 'perfectionist', name: 'مثالي', description: 'أكمل جميع الإنجازات', icon: '💫', tier: 'special', requirement: 30 },
  
  // Special Badges
  { id: 'vip', name: 'VIP', description: 'عضو VIP', icon: '👑', tier: 'vip', requirement: 1 },
  { id: 'verified', name: 'موثق', description: 'حساب موثق', icon: '✓', tier: 'verified', requirement: 1 },
  { id: 'supporter', name: 'داعم', description: 'دعم المنصة', icon: '❤️', tier: 'supporter', requirement: 1 },
];

// GET /api/achievements - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get user achievements
    const userAchievementsList = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    // Get user badges
    const userBadgesList = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    // Calculate progress for each achievement
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const userAchievement = userAchievementsList.find(
        ua => ua.achievementId === achievement.id
      );

      return {
        ...achievement,
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt || null,
        progress: userAchievement?.progress || 0,
        progressPercentage: Math.min(
          ((userAchievement?.progress || 0) / achievement.requirement) * 100,
          100
        ),
      };
    });

    // Add badge info
    const badgesWithStatus = BADGES.map(badge => {
      const userBadge = userBadgesList.find(ub => ub.badgeId === badge.id);

      return {
        ...badge,
        unlocked: !!userBadge,
        unlockedAt: userBadge?.unlockedAt || null,
      };
    });

    // Calculate stats
    const stats = {
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: achievementsWithProgress.filter(a => a.unlocked).length,
      totalBadges: BADGES.length,
      unlockedBadges: badgesWithStatus.filter(b => b.unlocked).length,
      totalPoints: achievementsWithProgress
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.points, 0),
    };

    return NextResponse.json({
      success: true,
      achievements: achievementsWithProgress,
      badges: badgesWithStatus,
      stats,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإنجازات' },
      { status: 500 }
    );
  }
}

// POST /api/achievements - Check and unlock achievements
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { achievementId, progress } = body;

    // Find achievement
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json(
        { error: 'الإنجاز غير موجود' },
        { status: 404 }
      );
    }

    // Check if already unlocked
    const existing = await db.query.userAchievements.findFirst({
      where: and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ),
    });

    if (existing && existing.unlocked) {
      return NextResponse.json({
        success: true,
        message: 'الإنجاز مفتوح بالفعل',
        achievement: existing,
      });
    }

    // Check if requirement is met
    const unlocked = progress >= achievement.requirement;

    if (existing) {
      // Update progress
      const [updated] = await db
        .update(userAchievements)
        .set({
          progress,
          unlocked,
          unlockedAt: unlocked ? new Date() : null,
        })
        .where(eq(userAchievements.id, existing.id))
        .returning();

      return NextResponse.json({
        success: true,
        achievement: updated,
        newlyUnlocked: unlocked && !existing.unlocked,
      });
    } else {
      // Create new
      const [newAchievement] = await db
        .insert(userAchievements)
        .values({
          userId,
          achievementId,
          progress,
          unlocked,
          unlockedAt: unlocked ? new Date() : null,
        })
        .returning();

      return NextResponse.json({
        success: true,
        achievement: newAchievement,
        newlyUnlocked: unlocked,
      });
    }
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الإنجاز' },
      { status: 500 }
    );
  }
}

