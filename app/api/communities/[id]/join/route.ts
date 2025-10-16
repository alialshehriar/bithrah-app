import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

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

    // Check if already member
    const existing = await query(
      'SELECT id FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, session.id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Already a member' }, { status: 400 });
    }

    // Join community
    await query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3)',
      [communityId, session.id, 'member']
    );

    // Track activity
    await query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [session.id, 'join_community', JSON.stringify({ community_id: communityId })]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining community:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: communityId } = await params;

    // Leave community
    await query(
      'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, session.id]
    );

    // Track activity
    await query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [session.id, 'leave_community', JSON.stringify({ community_id: communityId })]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

