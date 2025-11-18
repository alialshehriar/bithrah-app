import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations, conversationParticipants, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Get messages in a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const conversationId = parseInt(params.conversationId);

    // Verify user is a participant
    const participant = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (participant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Not a participant' },
        { status: 403 }
      );
    }

    // Get messages with sender info
    const conversationMessages = await db
      .select({
        id: messages.id,
        uuid: messages.uuid,
        content: messages.content,
        type: messages.type,
        attachments: messages.attachments,
        isEdited: messages.isEdited,
        isDeleted: messages.isDeleted,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isDeleted, false)
        )
      )
      .orderBy(messages.createdAt);

    // Update last read timestamp
    await db
      .update(conversationParticipants)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );

    return NextResponse.json({
      success: true,
      messages: conversationMessages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

// Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const conversationId = parseInt(params.conversationId);
    const body = await request.json();
    const { content, type = 'text', attachments } = body;

    if (!content && !attachments) {
      return NextResponse.json(
        { success: false, error: 'Message content or attachments required' },
        { status: 400 }
      );
    }

    // Verify user is a participant
    const participant = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (participant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Not a participant' },
        { status: 403 }
      );
    }

    // Create message
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: userId,
        content,
        type,
        attachments,
      })
      .returning();

    // Update conversation last message timestamp
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // Get sender info
    const sender = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: {
        ...message,
        sender: sender[0],
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
