import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/negotiations - Get user's negotiations
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const negotiations = await query(
      `SELECT n.*, 
        p.title as project_title,
        p.image_url as project_image,
        u1.name as initiator_name,
        u2.name as receiver_name
      FROM negotiations n
      JOIN projects p ON n.project_id = p.id
      JOIN users u1 ON n.initiator_id = u1.id
      JOIN users u2 ON n.receiver_id = u2.id
      WHERE n.initiator_id = $1 OR n.receiver_id = $1
      ORDER BY n.updated_at DESC`,
      [session.id]
    );

    return NextResponse.json({ success: true, negotiations });
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch negotiations' }, { status: 500 });
  }
}

// POST /api/negotiations - Create new negotiation
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, receiverId, initialOffer, message } = await request.json();

    if (!projectId || !receiverId || !initialOffer) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Create negotiation
    const result = await query(
      `INSERT INTO negotiations (project_id, initiator_id, receiver_id, current_offer, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [projectId, session.id, receiverId, initialOffer]
    );

    const negotiation = result[0];

    // Create initial message
    if (message) {
      await query(
        `INSERT INTO negotiation_messages (negotiation_id, sender_id, message, offer_amount, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [negotiation.id, session.id, message, initialOffer]
      );
    }

    // Track activity
    await query(
      `INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
      VALUES ($1, 'negotiation_created', $2, CURRENT_TIMESTAMP)`,
      [session.id, JSON.stringify({ negotiationId: negotiation.id, projectId })]
    );

    return NextResponse.json({ success: true, negotiation });
  } catch (error) {
    console.error('Error creating negotiation:', error);
    return NextResponse.json({ success: false, error: 'Failed to create negotiation' }, { status: 500 });
  }
}

