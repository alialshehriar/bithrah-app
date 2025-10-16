import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { communities, communityMembers } from '@/lib/db/schema';
import { desc, sql, eq, and, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'popular'; // popular, recent, members
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        sql`${communities.name} ILIKE ${`%${search}%`} OR ${communities.description} ILIKE ${`%${search}%`}`
      );
    }

    if (category) {
      whereConditions.push(eq(communities.category, category));
    }

    // Build order by clause
    let orderBy;
    switch (sort) {
      case 'recent':
        orderBy = [desc(communities.createdAt)];
        break;
      case 'members':
        orderBy = [desc(communities.memberCount)];
        break;
      default: // popular
        orderBy = [desc(communities.memberCount), desc(communities.createdAt)];
    }

    // Fetch communities
    const communitiesList = await db.query.communities.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: orderBy,
      limit: limit,
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      communities: communitiesList,
      total: communitiesList.length,
    });
  } catch (error) {
    console.error('Communities fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المجتمعات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, category, privacy, coverImage, rules } = body;

    // Validate required fields
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Check if community name already exists
    const existingCommunity = await db.query.communities.findFirst({
      where: eq(communities.name, name),
    });

    if (existingCommunity) {
      return NextResponse.json(
        { error: 'اسم المجتمع مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Create community
    const [newCommunity] = await db
      .insert(communities)
      .values({
        name,
        description,
        category,
        privacy: privacy || 'public',
        coverImage: coverImage || null,
        rules: rules || null,
        creatorId: parseInt(session.user.id),
        memberCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add creator as first member (admin)
    await db.insert(communityMembers).values({
      communityId: newCommunity.id,
      userId: parseInt(session.user.id),
      role: 'admin',
      joinedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      community: newCommunity,
      message: 'تم إنشاء المجتمع بنجاح',
    });
  } catch (error) {
    console.error('Community creation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المجتمع' },
      { status: 500 }
    );
  }
}

