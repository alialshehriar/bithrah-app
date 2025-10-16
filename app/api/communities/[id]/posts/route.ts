import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: communityId } = await params;

    const posts = await query(`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
      FROM community_posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.community_id = $1
      ORDER BY p.created_at DESC
    `, [communityId]);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: communityId } = await params;
    const { title, content, image } = await request.json();

    // Check if user is member
    const membership = await query(
      'SELECT id FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, session.id]
    );

    if (membership.length === 0) {
      return NextResponse.json({ success: false, error: 'Must be a member to post' }, { status: 403 });
    }

    // Create post
    const result = await query(
      'INSERT INTO community_posts (community_id, user_id, title, content, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [communityId, session.id, title, content, image]
    );

    // Track activity
    await query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [session.id, 'create_post', JSON.stringify({ community_id: communityId, post_id: result[0].id })]
    );

    return NextResponse.json({ success: true, postId: result[0].id });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

