import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { messages, conversations, conversationParticipants, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET /api/messages/[id] - Get messages in a conversation
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const conversationId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Check if user is participant
    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      ),
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول لهذه المحادثة' },
        { status: 403 }
      );
    }

    // Get conversation details
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    });

    // Get all participants with user details
    const participants = await db
      .select({
        id: conversationParticipants.id,
        userId: conversationParticipants.userId,
        role: conversationParticipants.role,
        joinedAt: conversationParticipants.joinedAt,
        user: users,
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(conversationParticipants.userId, users.id))
      .where(eq(conversationParticipants.conversationId, conversationId));

    // Get messages
    const conversationMessages = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        type: messages.type,
        attachments: messages.attachments,
        read: messages.read,
        createdAt: messages.createdAt,
        sender: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(100);

    // Mark messages as read
    await db
      .update(messages)
      .set({ read: true })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.read, false),
          eq(messages.senderId, userId)
        )
      );

    return NextResponse.json({
      success: true,
      conversation,
      participants,
      messages: conversationMessages.reverse(),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسائل' },
      { status: 500 }
    );
  }
}

// POST /api/messages/[id] - Send a message
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const conversationId = parseInt(id);
    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { content, type = 'text', attachments = [] } = body;

    // Validation
    if (!content && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: 'يجب إدخال محتوى الرسالة' },
        { status: 400 }
      );
    }

    // Check if user is participant
    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      ),
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'غير مصرح بالإرسال في هذه المحادثة' },
        { status: 403 }
      );
    }

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: userId,
        content,
        type,
        attachments: attachments.length > 0 ? attachments : null,
        read: false,
      })
      .returning();

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // Get sender details
    const sender = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return NextResponse.json({
      success: true,
      message: {
        ...newMessage,
        sender,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[id] - Delete a conversation
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const conversationId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Check if user is admin of conversation
    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId),
        eq(conversationParticipants.role, 'admin')
      ),
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'غير مصرح بحذف هذه المحادثة' },
        { status: 403 }
      );
    }

    // Delete all messages
    await db.delete(messages).where(eq(messages.conversationId, conversationId));

    // Delete all participants
    await db
      .delete(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));

    // Delete conversation
    await db.delete(conversations).where(eq(conversations.id, conversationId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المحادثة بنجاح',
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المحادثة' },
      { status: 500 }
    );
  }
}

