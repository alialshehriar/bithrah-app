import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get all conversations for the user
    const conversations = await query(`
      SELECT DISTINCT c.id, c.type, c.name, c.updated_at,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.sender_id != $1 
         AND m.read = false) as unread_count
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = $1
      ORDER BY c.updated_at DESC
    `, [session.id]);

    // Get last message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv: any) => {
        const lastMessage = await query(`
          SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
          FROM messages m
          INNER JOIN users u ON m.sender_id = u.id
          WHERE m.conversation_id = $1
          ORDER BY m.created_at DESC
          LIMIT 1
        `, [conv.id]);

        // Get other participants
        const participants = await query(`
          SELECT u.id, u.name, u.avatar
          FROM users u
          INNER JOIN conversation_participants cp ON u.id = cp.user_id
          WHERE cp.conversation_id = $1 AND u.id != $2
        `, [conv.id, session.id]);

        return {
          ...conv,
          lastMessage: lastMessage[0] || null,
          participants: participants
        };
      })
    );

    return NextResponse.json({ success: true, conversations: conversationsWithMessages });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { participantIds, type = 'direct', name } = await request.json();

    // Create conversation
    const result = await query(
      'INSERT INTO conversations (type, name) VALUES ($1, $2) RETURNING id',
      [type, name]
    );

    const conversationId = result[0].id;

    // Add current user as participant
    await query(
      'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
      [conversationId, session.id]
    );

    // Add other participants
    for (const participantId of participantIds) {
      await query(
        'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
        [conversationId, participantId]
      );
    }

    return NextResponse.json({ success: true, conversationId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

