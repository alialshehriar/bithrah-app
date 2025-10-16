import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, desc, like, or, and, sql } from 'drizzle-orm';

// GET - Get all projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = db.select({
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

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.orderBy(desc(projects.currentFunding)) as any;
        break;
      case 'funded':
        query = query.orderBy(desc(projects.currentFunding)) as any;
        break;
      case 'ending':
        query = query.orderBy(desc(projects.createdAt)) as any;
        break;
      default: // recent
        query = query.orderBy(desc(projects.createdAt)) as any;
    }

    query = query.limit(limit) as any;

    const allProjects = await query;

    return NextResponse.json({
      success: true,
      projects: allProjects,
      total: allProjects.length,
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشاريع' },
      { status: 500 }
    );
  }
}



