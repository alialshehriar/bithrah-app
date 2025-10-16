import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/negotiations/[id] - Get negotiation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get negotiation details
    const negotiations = await query(
      `SELECT n.*, 
        p.title as project_title,
        p.image_url as project_image,
        p.owner_id as project_owner_id,
        u1.name as initiator_name,
        u1.avatar_url as initiator_avatar,
        u2.name as receiver_name,
        u2.avatar_url as receiver_avatar
      FROM negotiations n
      JOIN projects p ON n.project_id = p.id
      JOIN users u1 ON n.initiator_id = u1.id
      JOIN users u2 ON n.receiver_id = u2.id
      WHERE n.id = $1 AND (n.initiator_id = $2 OR n.receiver_id = $2)`,
      [id, session.id]
    );

    if (negotiations.length === 0) {
      return NextResponse.json({ success: false, error: 'Negotiation not found' }, { status: 404 });
    }

    const negotiation = negotiations[0];

    // Get messages
    const messages = await query(
      `SELECT nm.*, u.name as sender_name, u.avatar_url as sender_avatar
      FROM negotiation_messages nm
      JOIN users u ON nm.sender_id = u.id
      WHERE nm.negotiation_id = $1
      ORDER BY nm.created_at ASC`,
      [id]
    );

    return NextResponse.json({ success: true, negotiation, messages });
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch negotiation' }, { status: 500 });
  }
}

// PUT /api/negotiations/[id] - Update negotiation status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, currentOffer } = await request.json();

    // Verify user is part of negotiation
    const negotiations = await query(
      `SELECT * FROM negotiations WHERE id = $1 AND (initiator_id = $2 OR receiver_id = $2)`,
      [id, session.id]
    );

    if (negotiations.length === 0) {
      return NextResponse.json({ success: false, error: 'Negotiation not found' }, { status: 404 });
    }

    // Update negotiation
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;

    if (status) {
      updateFields.push(`status = $${valueIndex++}`);
      updateValues.push(status);
    }

    if (currentOffer !== undefined) {
      updateFields.push(`current_offer = $${valueIndex++}`);
      updateValues.push(currentOffer);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(id);

    const result = await query(
      `UPDATE negotiations SET ${updateFields.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
      updateValues
    );

    // Track activity
    await query(
      `INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
      VALUES ($1, 'negotiation_updated', $2, CURRENT_TIMESTAMP)`,
      [session.id, JSON.stringify({ negotiationId: id, status, currentOffer })]
    );

    return NextResponse.json({ success: true, negotiation: result[0] });
  } catch (error) {
    console.error('Error updating negotiation:', error);
    return NextResponse.json({ success: false, error: 'Failed to update negotiation' }, { status: 500 });
  }
}

