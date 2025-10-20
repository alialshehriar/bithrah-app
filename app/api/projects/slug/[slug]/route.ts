import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const result = await db.execute(sql`
      SELECT 
        p.id, p.title, p.slug, p.description, p.short_description,
        p.funding_goal, p.current_funding, p.backers_count,
        p.deadline, p.status, p.image, p.cover_image,
        p.creator_id, u.name as creator_name, u.avatar as creator_avatar
      FROM projects p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const project = result.rows[0] as any;

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description || project.short_description,
        fundingGoal: Number(project.funding_goal),
        currentFunding: Number(project.current_funding || 0),
        backersCount: project.backers_count || 0,
        deadline: project.deadline,
        status: project.status,
        image: project.image,
        coverImage: project.cover_image,
        creator: {
          id: project.creator_id,
          name: project.creator_name,
          avatar: project.creator_avatar,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

