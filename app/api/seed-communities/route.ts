import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communityPosts, communities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Add posts for community 13 (مجتمع بذره التجريبي)
    const community13Posts = [
      {
        communityId: 13,
        userId: 32,
        content: 'مرحباً بالجميع في مجتمع بذرة! 🌱 نحن متحمسون لرؤية أفكاركم ومشاريعكم تنمو وتزدهر. شاركونا تجاربكم!',
        likesCount: 15,
        commentsCount: 3,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 13,
        userId: 32,
        content: 'نصيحة اليوم: التواصل مع المستثمرين يتطلب عرضاً واضحاً ومختصراً لفكرتك. ركز على المشكلة والحل والسوق المستهدف 💡',
        likesCount: 23,
        commentsCount: 5,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 13,
        userId: 32,
        content: 'هل تعلم؟ 70% من المشاريع الناجحة بدأت بفكرة بسيطة تم تطويرها تدريجياً. لا تنتظر الفكرة المثالية، ابدأ الآن! 🚀',
        likesCount: 18,
        commentsCount: 4,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        communityId: 13,
        userId: 32,
        content: 'سؤال للمجتمع: ما أكبر تحدي واجهتموه في رحلة ريادة الأعمال؟ شاركونا تجاربكم 🤔',
        likesCount: 31,
        commentsCount: 12,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        communityId: 13,
        userId: 32,
        content: 'تهانينا لجميع الأعضاء الذين أطلقوا مشاريعهم هذا الشهر! 🎉 نحن فخورون بكم ونتطلع لرؤية نجاحاتكم',
        likesCount: 42,
        commentsCount: 8,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ];

    // Add posts for community 14 (مجتمع التقنية والابتكار)
    const community14Posts = [
      {
        communityId: 14,
        userId: 32,
        content: 'مرحباً بكم في مجتمع التقنية والابتكار! 💻 هنا نناقش أحدث التقنيات وكيفية استخدامها في مشاريعكم',
        likesCount: 12,
        commentsCount: 2,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 14,
        userId: 32,
        content: 'الذكاء الاصطناعي يغير قواعد اللعبة في ريادة الأعمال. كيف تستخدمون AI في مشاريعكم؟ 🤖',
        likesCount: 28,
        commentsCount: 7,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 14,
        userId: 32,
        content: 'نصيحة تقنية: استخدموا أدوات no-code لبناء MVP سريع قبل الاستثمار في التطوير الكامل 🛠️',
        likesCount: 19,
        commentsCount: 4,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ];

    // Add posts for community 15 (مجتمع ريادة الأعمال)
    const community15Posts = [
      {
        communityId: 15,
        userId: 32,
        content: 'أهلاً بكم في مجتمع ريادة الأعمال! 🚀 هنا نتشارك الخبرات والدروس المستفادة من رحلتنا',
        likesCount: 16,
        commentsCount: 3,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 15,
        userId: 32,
        content: 'درس مهم: الفشل جزء من النجاح. كل رائد أعمال ناجح فشل عدة مرات قبل أن ينجح 💪',
        likesCount: 35,
        commentsCount: 9,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        communityId: 15,
        userId: 32,
        content: 'كيف تبني فريقاً قوياً؟ شاركونا تجاربكم في اختيار الشركاء والموظفين 👥',
        likesCount: 22,
        commentsCount: 6,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    ];

    // Insert all posts
    const allPosts = [...community13Posts, ...community14Posts, ...community15Posts];
    
    for (const post of allPosts) {
      await db.insert(communityPosts).values(post);
    }

    // Update community stats
    await db.update(communities).set({ memberCount: 15, postsCount: 6 }).where(eq(communities.id, 13));
    await db.update(communities).set({ memberCount: 12, postsCount: 4 }).where(eq(communities.id, 14));
    await db.update(communities).set({ memberCount: 10, postsCount: 4 }).where(eq(communities.id, 15));

    return NextResponse.json({
      success: true,
      message: 'Community data seeded successfully',
      postsAdded: allPosts.length,
    });
  } catch (error) {
    console.error('Error seeding communities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed communities' },
      { status: 500 }
    );
  }
}
