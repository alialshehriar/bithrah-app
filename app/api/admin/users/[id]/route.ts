import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const { id: userId } = await params;

    // Get user details
    const users = await sql`
      SELECT 
        id, name, email, username, role, points, level,
        email_verified, created_at, updated_at, is_sandbox,
        bio, avatar, location, website
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get user's projects
    const projects = await sql`
      SELECT 
        id, title, description, goal_amount, current_amount,
        status, created_at, image_url
      FROM projects
      WHERE owner_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get user's investments
    const investments = await sql`
      SELECT 
        i.id, i.amount, i.created_at,
        p.id as project_id, p.title as project_title
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.user_id = ${userId}
      ORDER BY i.created_at DESC
      LIMIT 10
    `;

    // Get user's communities
    const communities = await sql`
      SELECT 
        c.id, c.name, c.description, c.image_url,
        cm.joined_at
      FROM community_members cm
      JOIN communities c ON cm.community_id = c.id
      WHERE cm.user_id = ${userId}
      ORDER BY cm.joined_at DESC
      LIMIT 10
    `;

    // Get user's activities
    const activities = await sql`
      SELECT 
        activity_type, metadata, created_at
      FROM user_activities
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    // Calculate statistics
    const stats = {
      totalProjects: projects.length,
      totalInvestments: investments.length,
      totalInvested: investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0),
      totalCommunities: communities.length,
      totalActivities: activities.length
    };

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        points: user.points || 0,
        level: user.level || 1,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        isSandbox: user.is_sandbox,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location,
        website: user.website
      },
      projects,
      investments,
      communities,
      activities,
      stats
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

