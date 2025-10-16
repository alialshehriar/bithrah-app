import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, projects, communities, events, messages, negotiations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// GET /api/admin/sandbox - Get sandbox status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Check if user is admin (you can add admin check here)
    
    // Get sandbox stats
    const sandboxUsers = await db.query.users.findMany({
      where: eq(users.isSandbox, true),
    });

    const sandboxProjects = await db.query.projects.findMany({
      where: eq(projects.isSandbox, true),
    });

    const sandboxCommunities = await db.query.communities.findMany({
      where: eq(communities.isSandbox, true),
    });

    const sandboxEvents = await db.query.events.findMany({
      where: eq(events.isSandbox, true),
    });

    return NextResponse.json({
      success: true,
      stats: {
        users: sandboxUsers.length,
        projects: sandboxProjects.length,
        communities: sandboxCommunities.length,
        events: sandboxEvents.length,
      },
      isActive: sandboxUsers.length > 0,
    });
  } catch (error) {
    console.error('Error getting sandbox status:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب حالة Sandbox' },
      { status: 500 }
    );
  }
}

// POST /api/admin/sandbox - Generate sandbox data
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'generate') {
      // Generate fake users
      const fakeUsers = [];
      const arabicNames = [
        'محمد أحمد', 'فاطمة علي', 'عبدالله سعيد', 'نورة خالد', 'سارة محمد',
        'يوسف عبدالله', 'مريم حسن', 'عمر يوسف', 'ليلى أحمد', 'خالد عبدالرحمن',
        'هند محمد', 'سلمان علي', 'عائشة سعد', 'طارق عمر', 'رنا خالد',
        'ماجد فهد', 'دانة عبدالله', 'فيصل محمد', 'ريم سعيد', 'بدر أحمد',
      ];

      const hashedPassword = await bcrypt.hash('sandbox123', 10);

      for (let i = 0; i < 50; i++) {
        const name = arabicNames[i % arabicNames.length] + ` ${i + 1}`;
        const username = `sandbox_user_${i + 1}`;
        
        const [user] = await db
          .insert(users)
          .values({
            name,
            username,
            email: `sandbox${i + 1}@example.com`,
            password: hashedPassword,
            emailVerified: true,
            points: Math.floor(Math.random() * 10000),
            level: Math.floor(Math.random() * 50) + 1,
            experience: Math.floor(Math.random() * 5000),
            subscriptionTier: ['free', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)],
            isSandbox: true,
          })
          .returning();

        fakeUsers.push(user);
      }

      // Generate fake projects
      const projectTitles = [
        'منصة تعليمية ذكية',
        'تطبيق توصيل طعام',
        'نظام إدارة المشاريع',
        'متجر إلكتروني متكامل',
        'تطبيق صحي ذكي',
        'منصة تواصل اجتماعي',
        'نظام حجز مواعيد',
        'تطبيق تعلم لغات',
        'منصة استثمارية',
        'تطبيق رياضي',
      ];

      for (let i = 0; i < 30; i++) {
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        await db.insert(projects).values({
          ownerId: randomUser.id,
          title: projectTitles[i % projectTitles.length] + ` ${i + 1}`,
          description: 'مشروع وهمي للاختبار والتطوير. يحتوي على جميع الميزات المطلوبة.',
          category: ['tech', 'business', 'health', 'education', 'other'][Math.floor(Math.random() * 5)],
          fundingGoal: Math.floor(Math.random() * 100000) + 10000,
          currentFunding: Math.floor(Math.random() * 50000),
          status: ['active', 'funded', 'completed'][Math.floor(Math.random() * 3)],
          isSandbox: true,
        });
      }

      // Generate fake communities
      const communityNames = [
        'مجتمع المطورين',
        'رواد الأعمال',
        'المستثمرون',
        'المبدعون',
        'التقنية والابتكار',
      ];

      for (let i = 0; i < 15; i++) {
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        await db.insert(communities).values({
          creatorId: randomUser.id,
          name: communityNames[i % communityNames.length] + ` ${i + 1}`,
          description: 'مجتمع وهمي للاختبار والتطوير.',
          category: ['tech', 'business', 'health', 'education', 'other'][Math.floor(Math.random() * 5)],
          isPrivate: Math.random() > 0.5,
          isSandbox: true,
        });
      }

      // Generate fake events
      const eventTitles = [
        'ورشة عمل تطوير الويب',
        'مؤتمر ريادة الأعمال',
        'لقاء المستثمرين',
        'ندوة التقنية',
        'حفلة التواصل',
      ];

      for (let i = 0; i < 20; i++) {
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        await db.insert(events).values({
          organizerId: randomUser.id,
          title: eventTitles[i % eventTitles.length] + ` ${i + 1}`,
          description: 'فعالية وهمية للاختبار والتطوير.',
          type: ['workshop', 'webinar', 'conference', 'meetup', 'training'][Math.floor(Math.random() * 5)],
          startDate,
          endDate,
          isOnline: Math.random() > 0.5,
          maxAttendees: Math.floor(Math.random() * 100) + 10,
          price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 500),
          status: 'upcoming',
          isSandbox: true,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'تم توليد البيانات الوهمية بنجاح',
        stats: {
          users: fakeUsers.length,
          projects: 30,
          communities: 15,
          events: 20,
        },
      });
    } else if (action === 'clear') {
      // Delete all sandbox data
      await db.delete(users).where(eq(users.isSandbox, true));
      await db.delete(projects).where(eq(projects.isSandbox, true));
      await db.delete(communities).where(eq(communities.isSandbox, true));
      await db.delete(events).where(eq(events.isSandbox, true));

      return NextResponse.json({
        success: true,
        message: 'تم حذف جميع البيانات الوهمية بنجاح',
      });
    }

    return NextResponse.json(
      { error: 'إجراء غير صحيح' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing sandbox:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إدارة Sandbox' },
      { status: 500 }
    );
  }
}

