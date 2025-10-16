import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await verifySession(request);

    // Get community details
    const communities = await query(`
      SELECT c.*, u.name as creator_name, u.avatar as creator_avatar,
        (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as members_count,
        (SELECT COUNT(*) FROM community_posts WHERE community_id = c.id) as posts_count
      FROM communities c
      INNER JOIN users u ON c.creator_id = u.id
      WHERE c.id = $1
    `, [id]);

    if (communities.length === 0) {
      return NextResponse.json({ success: false, error: 'Community not found' }, { status: 404 });
    }

    const community = communities[0];

    // Check if user is member
    let isMember = false;
    let memberRole = null;

    if (session) {
      const membership = await query(
        'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2',
        [id, session.id]
      );
      isMember = membership.length > 0;
      memberRole = membership.length > 0 ? membership[0].role : null;
    }

    // Get recent posts
    const posts = await query(`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
      FROM community_posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.community_id = $1
      ORDER BY p.created_at DESC
      LIMIT 10
    `, [id]);

    // Get top members
    const members = await query(`
      SELECT u.id, u.name, u.avatar, u.bio, cm.role, cm.joined_at
      FROM community_members cm
      INNER JOIN users u ON cm.user_id = u.id
      WHERE cm.community_id = $1
      ORDER BY cm.joined_at ASC
      LIMIT 10
    `, [id]);

    return NextResponse.json({
      success: true,
      community,
      isMember,
      memberRole,
      posts,
      members
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

