import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// POST /api/negotiations/[id]/messages - Send message in negotiation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { message, offerAmount, messageType } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Verify user is part of negotiation
    const negotiations = await query(
      `SELECT * FROM negotiations WHERE id = $1 AND (initiator_id = $2 OR receiver_id = $2)`,
      [id, session.id]
    );

    if (negotiations.length === 0) {
      return NextResponse.json({ success: false, error: 'Negotiation not found' }, { status: 404 });
    }

    // Create message
    const result = await query(
      `INSERT INTO negotiation_messages (negotiation_id, sender_id, message, offer_amount, message_type, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *`,
      [id, session.id, message, offerAmount || null, messageType || 'message']
    );

    // Update negotiation updated_at
    await query(
      `UPDATE negotiations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    // If this is a counter-offer, update current_offer
    if (offerAmount && messageType === 'counter_offer') {
      await query(
        `UPDATE negotiations SET current_offer = $1 WHERE id = $2`,
        [offerAmount, id]
      );
    }

    // Track activity
    await query(
      `INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
      VALUES ($1, 'negotiation_message_sent', $2, CURRENT_TIMESTAMP)`,
      [session.id, JSON.stringify({ negotiationId: id, messageType })]
    );

    return NextResponse.json({ success: true, message: result[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

