import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    
    const sql = neon(process.env.DATABASE_URL!);
    
    // Build WHERE clause
    let whereClause = '1=1';
    
    if (category && category !== '' && category !== 'all') {
      whereClause += ` AND c.category = '${category}'`;
    }
    
    if (search) {
      whereClause += ` AND c.name ILIKE '%${search}%'`;
    }
    
    // Build ORDER BY clause
    let orderByClause = 'c.member_count DESC';
    if (sort === 'recent') {
      orderByClause = 'c.created_at DESC';
    } else if (sort === 'members') {
      orderByClause = 'c.member_count DESC';
    }
    
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.category,
        CASE WHEN c.is_private THEN 'private' ELSE 'public' END as privacy,
        c.cover_image as "coverImage",
        c.member_count as "memberCount",
        c.posts_count as "postCount",
        c.created_at as "createdAt",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', COALESCE(u.username, 'user' || u.id),
          'avatar', u.avatar
        ) as creator
      FROM communities c
      LEFT JOIN users u ON c.creator_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT 50
    `;
    
    const result = await sql(query);
    
    return NextResponse.json({ communities: result });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'خطأ في جلب المجتمعات', communities: [] }, { status: 500 });
  }
}

