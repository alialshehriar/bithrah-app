import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
// GET - Get all projects with filters
export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';

    // Build query
    let query = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.short_description,
        p.category,
        p.tags,
        p.image,
        p.cover_image,
        p.funding_goal,
        p.current_funding,
        p.currency,
        p.backers_count,
        p.deadline,
        p.status,
        p.featured,
        p.trending,
        
        p.created_at,
        p.published_at,
        u.id as creator_id,
        u.name as creator_name,
        u.username as creator_username,
        u.avatar as creator_avatar
      FROM projects p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.status = 'active'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Add search filter
    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add category filter
    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Add featured filter
    if (featured) {
      query += ` AND p.featured = true`;
    }

    // Add trending filter
    if (trending) {
      query += ` AND p.trending = true`;
    }

    // Add sorting
    if (sortBy === 'recent') {
      query += ` ORDER BY p.created_at DESC`;
    } else if (sortBy === 'popular') {
      query += ` ORDER BY p.backers_count DESC`;
    } else if (sortBy === 'funded') {
      query += ` ORDER BY p.current_funding DESC`;
    } else if (sortBy === 'ending') {
      query += ` ORDER BY p.deadline ASC`;
    }

    // Add limit
    query += ` LIMIT $${paramIndex}`;
    params.push(limit);

    // Execute query
    const results = await sql(query, params);

    // Transform results
    const projects = results.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.short_description || row.description,
      fullDescription: row.description,
      category: row.category,
      tags: row.tags,
      image: row.image,
      coverImage: row.cover_image,
      fundingGoal: row.funding_goal.toString(),
      currentFunding: row.current_funding.toString(),
      currency: row.currency,
      backersCount: row.backers_count,
      deadline: row.deadline,
      status: row.status,
      featured: row.featured,
      trending: row.trending,
      
      createdAt: row.created_at,
      publishedAt: row.published_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        username: row.creator_username,
        avatar: row.creator_avatar,
      },
      // Calculate progress percentage
      progress: Math.round((parseFloat(row.current_funding) / parseFloat(row.funding_goal)) * 100),
      // Calculate days left
      daysLeft: Math.max(0, Math.ceil((new Date(row.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    }));

    return NextResponse.json({
      success: true,
      projects,
      total: projects.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'فشل في جلب المشاريع',
        projects: [],
        total: 0
      },
      { status: 200 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    // Validate required fields
    const required = ['title', 'description', 'category', 'fundingGoal', 'deadline', 'creatorId'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `الحقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Insert project
    const result = await sql`
      INSERT INTO projects (
        creator_id, title, slug, description, short_description,
        category, tags, image, cover_image, video,
        funding_goal, current_funding, currency,
        backers_count, deadline, status, visibility,
        featured, verified, trending,
        created_at, updated_at
      ) VALUES (
        ${body.creatorId},
        ${body.title},
        ${slug},
        ${body.description},
        ${body.shortDescription || body.description.substring(0, 200)},
        ${body.category},
        ${JSON.stringify(body.tags || [])},
        ${body.image || null},
        ${body.coverImage || null},
        ${body.video || null},
        ${body.fundingGoal},
        0,
        ${body.currency || 'SAR'},
        0,
        ${body.deadline},
        'draft',
        'public',
        false,
        false,
        false,
        NOW(),
        NOW()
      )
      RETURNING id, slug
    `;

    return NextResponse.json({
      success: true,
      project: result[0],
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المشروع' },
      { status: 500 }
    );
  }
}

