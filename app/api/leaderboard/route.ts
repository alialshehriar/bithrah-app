import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'points';
    const limit = parseInt(searchParams.get('limit') || '50');

    let orderBy = 'points DESC';
    
    if (type === 'projects') {
      // Get users by project count
      const leaderboard = await query(`
        SELECT u.id, u.name, u.avatar, u.bio, u.role,
          COUNT(p.id) as score,
          (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers
        FROM users u
        LEFT JOIN projects p ON u.id = p.user_id
        WHERE u.is_sandbox = false OR u.is_sandbox IS NULL
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT $1
      `, [limit]);

      return NextResponse.json({ success: true, leaderboard, type: 'projects' });
    } else if (type === 'followers') {
      // Get users by follower count
      const leaderboard = await query(`
        SELECT u.id, u.name, u.avatar, u.bio, u.role, u.points,
          COUNT(f.id) as score
        FROM users u
        LEFT JOIN follows f ON u.id = f.following_id
        WHERE u.is_sandbox = false OR u.is_sandbox IS NULL
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT $1
      `, [limit]);

      return NextResponse.json({ success: true, leaderboard, type: 'followers' });
    } else {
      // Get users by points (default)
      const leaderboard = await query(`
        SELECT u.id, u.name, u.avatar, u.bio, u.role, u.points as score,
          (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers,
          (SELECT COUNT(*) FROM projects WHERE user_id = u.id) as projects
        FROM users u
        WHERE u.is_sandbox = false OR u.is_sandbox IS NULL
        ORDER BY u.points DESC
        LIMIT $1
      `, [limit]);

      return NextResponse.json({ success: true, leaderboard, type: 'points' });
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

