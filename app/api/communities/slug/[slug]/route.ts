import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, communityMembers, communityPosts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch community by slug
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug))
      .limit(1);

    if (!community) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    // Fetch creator
    const [creator] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, community.creatorId))
      .limit(1);

    // Fetch posts with authors
    let postsData = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        attachments: communityPosts.attachments,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        createdAt: communityPosts.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatar: users.avatar,
        authorLevel: users.level,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .where(eq(communityPosts.communityId, community.id))
      .orderBy(communityPosts.createdAt)
      .limit(20);

    // Add hardcoded demo posts if no posts exist
    if (postsData.length === 0) {
      const demoPosts: any[] = [];
      
      if (slug === 'bithrah-demo-community') {
        demoPosts.push(
          {
            id: 1,
            content: 'مرحباً بالجميع في مجتمع بذرة! 🌱 نحن متحمسون لرؤية أفكاركم ومشاريعكم تنمو وتزدهر. شاركونا تجاربكم!',
            attachments: null,
            likesCount: 15,
            commentsCount: 3,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 2,
            content: 'نصيحة اليوم: التواصل مع المستثمرين يتطلب عرضاً واضحاً ومختصراً لفكرتك. ركز على المشكلة والحل والسوق المستهدف 💡',
            attachments: null,
            likesCount: 23,
            commentsCount: 5,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 3,
            content: 'هل تعلم؟ 70% من المشاريع الناجحة بدأت بفكرة بسيطة تم تطويرها تدريجياً. لا تنتظر الفكرة المثالية، ابدأ الآن! 🚀',
            attachments: null,
            likesCount: 18,
            commentsCount: 4,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 4,
            content: 'سؤال للمجتمع: ما أكبر تحدي واجهتموه في رحلة ريادة الأعمال؟ شاركونا تجاربكم 🤔',
            attachments: null,
            likesCount: 31,
            commentsCount: 12,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 5,
            content: 'تهانينا لجميع الأعضاء الذين أطلقوا مشاريعهم هذا الشهر! 🎉 نحن فخورون بكم ونتطلع لرؤية نجاحاتكم',
            attachments: null,
            likesCount: 42,
            commentsCount: 8,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          }
        );
      } else if (slug === 'tech-innovation-community') {
        demoPosts.push(
          {
            id: 6,
            content: 'مرحباً بكم في مجتمع التقنية والابتكار! 💻 هنا نناقش أحدث التقنيات وكيفية استخدامها في مشاريعكم',
            attachments: null,
            likesCount: 12,
            commentsCount: 2,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 7,
            content: 'الذكاء الاصطناعي يغير قواعد اللعبة في ريادة الأعمال. كيف تستخدمون AI في مشاريعكم؟ 🤖',
            attachments: null,
            likesCount: 28,
            commentsCount: 7,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 8,
            content: 'نصيحة تقنية: استخدموا أدوات no-code لبناء MVP سريع قبل الاستثمار في التطوير الكامل 🛠️',
            attachments: null,
            likesCount: 19,
            commentsCount: 4,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          }
        );
      } else if (slug === 'entrepreneurship-community') {
        demoPosts.push(
          {
            id: 9,
            content: 'أهلاً بكم في مجتمع ريادة الأعمال! 🚀 هنا نتشارك الخبرات والدروس المستفادة من رحلتنا',
            attachments: null,
            likesCount: 16,
            commentsCount: 3,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 10,
            content: 'درس مهم: الفشل جزء من النجاح. كل رائد أعمال ناجح فشل عدة مرات قبل أن ينجح 💪',
            attachments: null,
            likesCount: 35,
            commentsCount: 9,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          },
          {
            id: 11,
            content: 'كيف تبني فريقاً قوياً؟ شاركونا تجاربكم في اختيار الشركاء والموظفين 👥',
            attachments: null,
            likesCount: 22,
            commentsCount: 6,
            createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
            authorId: 32,
            authorName: 'مدير بذرة',
            authorUsername: 'bithrah_admin',
            authorAvatar: null,
            authorLevel: 'expert',
          }
        );
      }
      
      postsData = demoPosts;
    }

    // Fetch members with user data
    const membersData = await db
      .select({
        id: communityMembers.id,
        role: communityMembers.role,
        points: communityMembers.points,
        joinedAt: communityMembers.joinedAt,
        userId: users.id,
        userName: users.name,
        userUsername: users.username,
        userAvatar: users.avatar,
        userLevel: users.level,
      })
      .from(communityMembers)
      .leftJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, community.id))
      .limit(50);

    return NextResponse.json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        category: community.category,
        privacy: community.tier,
        coverImage: community.coverImage,
        rules: community.rules,
        memberCount: community.memberCount,
        postCount: community.postsCount,
        createdAt: community.createdAt,
        creator: creator,
      },
      posts: postsData.map(post => ({
        id: post.id,
        content: post.content,
        attachments: post.attachments,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        author: {
          id: post.authorId,
          name: post.authorName,
          username: post.authorUsername,
          avatar: post.authorAvatar,
          level: post.authorLevel,
        },
      })),
      members: membersData.map(member => ({
        id: member.id,
        role: member.role,
        points: member.points,
        joinedAt: member.joinedAt,
        user: {
          id: member.userId,
          name: member.userName,
          username: member.userUsername,
          avatar: member.userAvatar,
          level: member.userLevel,
        },
      })),
      isMember: false,
      memberRole: null,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

