import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get skills
    const skillsResult = await query(
      'SELECT * FROM skills WHERE user_id = $1 ORDER BY level DESC',
      [id]
    );

    // Get achievements
    const achievementsResult = await query(`
      SELECT 
        a.*,
        ua.progress,
        ua.unlocked_at
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      ORDER BY ua.unlocked_at DESC NULLS LAST
    `, [id]);

    // Get portfolio
    const portfolioResult = await query(
      'SELECT * FROM portfolio WHERE user_id = $1 ORDER BY date DESC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        skills: skillsResult.rows || [],
        achievements: achievementsResult.rows || [],
        portfolio: portfolioResult.rows || [],
      },
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

