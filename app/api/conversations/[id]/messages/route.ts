import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations, conversationParticipants, notifications } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    // Verify user is part of this conversation
    const [participant] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all messages
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    // Mark messages as read
    await db
      .update(messages)
      .set({ isRead: true } as any)
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.receiverId, userId),
          eq(messages.isRead, false)
        )
      );

    return NextResponse.json({
      success: true,
      messages: conversationMessages,
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    const { content, type = 'text', imageUrl } = await request.json();

    if (!content && !imageUrl) {
      return NextResponse.json(
        { error: 'Content or image is required' },
        { status: 400 }
      );
    }

    // Verify user is part of this conversation
    const [participant] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get other participants (receiver)
    const otherParticipants = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );
    
    const receiverId = otherParticipants[0]?.userId || userId;

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: userId,
        receiverId,
        content: content || '',
        type,
        imageUrl: imageUrl || null,
        isRead: false,
        createdAt: new Date(),
      } as any)
      .returning();

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() } as any)
      .where(eq(conversations.id, conversationId));

    // Create notification for receiver
    await db
      .insert(notifications)
      .values({
        userId: receiverId,
        type: 'message',
        title: 'رسالة جديدة',
        message: `لديك رسالة جديدة من ${session.user.name || 'مستخدم'}`,
        link: `/messages?conversation=${conversationId}`,
        isRead: false,
        createdAt: new Date(),
      } as any);

    return NextResponse.json({
      success: true,
      message: newMessage,
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
