import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, like, desc, sql, and } from 'drizzle-orm';

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
            fundingGoal: projects.fundingGoal,
            currentFunding: projects.currentFunding,
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
            fundingGoal: projects.fundingGoal,
            currentFunding: projects.currentFunding,
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

