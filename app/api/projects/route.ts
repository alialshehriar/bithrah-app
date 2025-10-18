import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, like, desc, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'trending';

    let query = db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        category: projects.category,
        goalAmount: projects.goal_amount,
        raisedAmount: projects.raised_amount,
        backersCount: projects.backers_count,
        daysLeft: sql<number>`GREATEST(0, DATEDIFF(${projects.end_date}, NOW()))`,
        image: projects.cover_image,
        status: projects.status,
        creator: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        },
      })
      .from(projects)
      .leftJoin(users, eq(projects.creator_id, users.id));

    // Apply filters
    if (search) {
      query = query.where(like(projects.title, `%${search}%`));
    }

    if (category) {
      query = query.where(eq(projects.category, category));
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.orderBy(desc(projects.created_at));
        break;
      case 'goal':
        query = query.orderBy(desc(sql`${projects.raised_amount} / ${projects.goal_amount}`));
        break;
      case 'trending':
      default:
        query = query.orderBy(desc(projects.backers_count));
        break;
    }

    const projectsList = await query;

    return NextResponse.json({
      success: true,
      projects: projectsList,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
