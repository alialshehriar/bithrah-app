import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Get leaderboard users with rank
    const leaderboard = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.avatar, 
        u.bio, 
        u.role, 
        u.points,
        u.level,
        (SELECT COUNT(*) FROM projects WHERE creator_id = u.id) as projects_created,
        (SELECT COUNT(*) FROM backings WHERE user_id = u.id) as projects_backed,
        ROW_NUMBER() OVER (ORDER BY u.points DESC, u.level DESC) as rank
      FROM users u
      WHERE u.points > 0
      ORDER BY u.points DESC, u.level DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Format response
    const formattedLeaderboard = leaderboard.map((user: any) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      points: user.points || 0,
      level: user.level || 1,
      rank: parseInt(user.rank),
      projectsCreated: parseInt(user.projects_created),
      projectsBacked: parseInt(user.projects_backed)
    }));

    return NextResponse.json({ 
      success: true, 
      leaderboard: formattedLeaderboard,
      type 
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

