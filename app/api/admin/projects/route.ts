import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        category: projects.category,
        fundingGoal: projects.fundingGoal,
        currentFunding: projects.currentFunding,
        status: projects.status,
        image: projects.image,
        createdAt: projects.createdAt,
        creator: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(projects)
      .leftJoin(users, eq(projects.creatorId, users.id));

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(projects.title, `%${search}%`),
          like(projects.description, `%${search}%`)
        )
      );
    }

    if (category && category !== 'all') {
      conditions.push(eq(projects.category, category));
    }

    if (status && status !== 'all') {
      conditions.push(eq(projects.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(projects.createdAt)).limit(limit) as any;

    const allProjects = await query;

    return NextResponse.json({
      success: true,
      projects: allProjects,
      total: allProjects.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        projects: [],
      },
      { status: 500 }
    );
  }
}

