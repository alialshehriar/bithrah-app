import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let sql = `
      SELECT c.*, u.name as creator_name, u.avatar as creator_avatar,
        (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as members_count,
        (SELECT COUNT(*) FROM community_posts WHERE community_id = c.id) as posts_count
      FROM communities c
      INNER JOIN users u ON c.creator_id = u.id
      WHERE (c.is_sandbox = false OR c.is_sandbox IS NULL)
    `;
    
    const params: any[] = [];
    
    if (category) {
      sql += ` AND c.category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (search) {
      sql += ` AND (c.name ILIKE $${params.length + 1} OR c.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    sql += ' ORDER BY c.created_at DESC';
    
    const communities = await query(sql, params);
    
    return NextResponse.json({ success: true, communities });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category, image, rules, is_private } = await request.json();

    const result = await query(
      'INSERT INTO communities (name, description, category, image, rules, is_private, creator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, description, category, image, rules, is_private || false, session.id]
    );

    const communityId = result[0].id;

    // Add creator as member and admin
    await query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3)',
      [communityId, session.id, 'admin']
    );

    // Track activity
    await query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [session.id, 'create_community', JSON.stringify({ community_id: communityId, name })]
    );

    return NextResponse.json({ success: true, communityId });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

