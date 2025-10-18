import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, like, desc, sql, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'trending';

    // Build conditions array
    const conditions = [];
    
    if (search) {
      conditions.push(like(projects.title, `%${search}%`));
    }

    if (category) {
      conditions.push(eq(projects.category, category));
    }

    // Determine sort order
    let orderByClause;
    switch (sort) {
      case 'newest':
        orderByClause = desc(projects.createdAt);
        break;
      case 'goal':
        orderByClause = desc(sql`${projects.currentFunding} / ${projects.fundingGoal}`);
        break;
      case 'backers':
        orderByClause = desc(projects.backersCount);
        break;
      default: // trending
        orderByClause = desc(projects.viewsCount);
    }

    // Build and execute query
    const result = conditions.length > 0
      ? await db
          .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            category: projects.category,
            goalAmount: projects.fundingGoal,
            raisedAmount: projects.currentFunding,
            backersCount: projects.backersCount,
            daysLeft: sql<number>`GREATEST(0, EXTRACT(DAY FROM (${projects.deadline} - NOW())))`,
            image: projects.coverImage,
            status: projects.status,
            creator: {
              id: users.id,
              name: users.name,
              username: users.username,
              avatar: users.avatar,
            },
          })
          .from(projects)
          .leftJoin(users, eq(projects.creatorId, users.id))
          .where(and(...conditions))
          .orderBy(orderByClause)
          .limit(50)
      : await db
          .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            category: projects.category,
            goalAmount: projects.fundingGoal,
            raisedAmount: projects.currentFunding,
            backersCount: projects.backersCount,
            daysLeft: sql<number>`GREATEST(0, EXTRACT(DAY FROM (${projects.deadline} - NOW())))`,
            image: projects.coverImage,
            status: projects.status,
            creator: {
              id: users.id,
              name: users.name,
              username: users.username,
              avatar: users.avatar,
            },
          })
          .from(projects)
          .leftJoin(users, eq(projects.creatorId, users.id))
          .orderBy(orderByClause)
          .limit(50);

    return NextResponse.json({ projects: result });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'خطأ في جلب المشاريع' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      goalAmount,
      endDate,
      image,
      packages: rewardPackages,
      platformPackage = 'basic',
    } = body;

    // Validate required fields
    if (!title || !description || !goalAmount) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Calculate deadline (60 days from now if not provided)
    const deadline = endDate ? new Date(endDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // Calculate commission and partnership based on package
    const commission = platformPackage === 'bithrah_plus' ? 3.00 : 6.50;
    const partnership = platformPackage === 'bithrah_plus' ? 2.00 : 0.00;
    const referralEnabled = platformPackage === 'bithrah_plus';
    const featured = platformPackage === 'bithrah_plus';

    // Use raw SQL to insert (to avoid Drizzle TypeScript issues)
    const sqlClient = neon(process.env.DATABASE_URL!);
    
    const result = await sqlClient`
      INSERT INTO projects (
        creator_id, title, description, category, funding_goal, deadline,
        cover_image, platform_package, platform_commission, platform_partnership,
        referral_enabled, packages, status, visibility, featured,
        created_at, updated_at
      ) VALUES (
        ${session.id}, ${title}, ${description}, ${category || 'technology'},
        ${goalAmount.toString()}, ${deadline.toISOString()},
        ${image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'},
        ${platformPackage}, ${commission}, ${partnership},
        ${referralEnabled}, ${JSON.stringify(rewardPackages || [])},
        'active', 'public', ${featured},
        NOW(), NOW()
      )
      RETURNING *
    `;

    const newProject = result[0];

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'تم إنشاء المشروع بنجاح',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المشروع' },
      { status: 500 }
    );
  }
}

