import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const session = await verifySession(request);

    // Get user profile
    const users = await query(
      'SELECT id, name, email, bio, avatar, cover_image, location, website, linkedin, twitter, points, created_at, role FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Get profile stats
    const projectsCount = await query(
      'SELECT COUNT(*) as count FROM projects WHERE user_id = $1',
      [userId]
    );

    const followersCount = await query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = $1',
      [userId]
    );

    const followingCount = await query(
      'SELECT COUNT(*) as count FROM follows WHERE follower_id = $1',
      [userId]
    );

    const achievementsCount = await query(
      'SELECT COUNT(*) as count FROM user_achievements WHERE user_id = $1',
      [userId]
    );

    const stats = {
      projects: parseInt(projectsCount[0].count),
      followers: parseInt(followersCount[0].count),
      following: parseInt(followingCount[0].count),
      achievements: parseInt(achievementsCount[0].count)
    };

    // Check if current user is following this profile
    let isFollowing = false;
    let isOwnProfile = false;

    if (session) {
      const followCheck = await query(
        'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
        [session.id, userId]
      );
      isFollowing = followCheck.length > 0;
      isOwnProfile = session.id === parseInt(userId);
    }

    return NextResponse.json({
      success: true,
      user,
      stats,
      isFollowing,
      isOwnProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

