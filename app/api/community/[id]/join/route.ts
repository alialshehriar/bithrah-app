import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const body = await request.json();
    const { action } = body; // 'join' or 'leave'

    const { db } = await import('@/lib/db');
    const { communityMembers, communities } = await import('@/lib/db/schema');
    const { eq, and, sql } = await import('drizzle-orm');

    if (action === 'join') {
      // Check if already a member
      const [existing] = await db
        .select()
        .from(communityMembers)
        .where(
          and(
            eq(communityMembers.communityId, parseInt(id)),
            eq(communityMembers.userId, userId)
          )
        )
        .limit(1);

      if (existing) {
        return NextResponse.json({
          success: false,
          error: 'Already a member',
        });
      }

      // Add member
      await db.insert(communityMembers).values({
        communityId: parseInt(id),
        userId,
        role: 'member',
      } as any);

      // Update community members count
      await db
        .update(communities)
        .set({
          memberCount: sql`${communities.memberCount} + 1`,
        } as any)
        .where(eq(communities.id, parseInt(id)));

      return NextResponse.json({
        success: true,
        message: 'Joined community successfully',
      });
    } else if (action === 'leave') {
      // Remove member
      await db
        .delete(communityMembers)
        .where(
          and(
            eq(communityMembers.communityId, parseInt(id)),
            eq(communityMembers.userId, userId)
          )
        );

      // Update community members count
      await db
        .update(communities)
        .set({
          memberCount: sql`GREATEST(${communities.memberCount} - 1, 0)`,
        } as any)
        .where(eq(communities.id, parseInt(id)));

      return NextResponse.json({
        success: true,
        message: 'Left community successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error joining/leaving community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

