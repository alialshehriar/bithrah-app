import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { messages, conversations, conversationParticipants } from '@/lib/db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';

// GET /api/messages - Get all conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get all conversations where user is a participant
    const userConversations = await db
      .select({
        conversation: conversations,
        participant: conversationParticipants,
        lastMessage: messages,
      })
      .from(conversationParticipants)
      .innerJoin(
        conversations,
        eq(conversationParticipants.conversationId, conversations.id)
      )
      .leftJoin(
        messages,
        and(
          eq(messages.conversationId, conversations.id),
          eq(messages.id, sql`(
            SELECT id FROM ${messages}
            WHERE conversation_id = ${conversations.id}
            ORDER BY created_at DESC
            LIMIT 1
          )`)
        )
      )
      .where(eq(conversationParticipants.userId, userId))
      .orderBy(desc(conversations.updatedAt));

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      userConversations.map(async (conv) => {
        const unreadCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.conversation.id),
              eq(messages.read, false),
              sql`${messages.senderId} != ${userId}`
            )
          );

        return {
          ...conv.conversation,
          lastMessage: conv.lastMessage,
          unreadCount: unreadCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: conversationsWithUnread,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المحادثات' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { participantIds, type = 'direct', name, projectId, negotiationId } = body;

    // Validation
    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'يجب تحديد مشاركين في المحادثة' },
        { status: 400 }
      );
    }

    // Check if conversation already exists for direct messages
    if (type === 'direct' && participantIds.length === 1) {
      const otherUserId = participantIds[0];
      
      const existingConversation = await db
        .select({ id: conversations.id })
        .from(conversations)
        .innerJoin(
          conversationParticipants,
          eq(conversationParticipants.conversationId, conversations.id)
        )
        .where(
          and(
            eq(conversations.type, 'direct'),
            or(
              and(
                eq(conversationParticipants.userId, userId),
                sql`EXISTS (
                  SELECT 1 FROM ${conversationParticipants} cp2
                  WHERE cp2.conversation_id = ${conversations.id}
                  AND cp2.user_id = ${otherUserId}
                )`
              )
            )
          )
        )
        .limit(1);

      if (existingConversation.length > 0) {
        return NextResponse.json({
          success: true,
          conversation: { id: existingConversation[0].id },
          existing: true,
        });
      }
    }

    // Create new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        type,
        name: type === 'group' ? name : null,
        projectId: projectId || null,
        negotiationId: negotiationId || null,
      })
      .returning();

    // Add participants
    const allParticipantIds = [userId, ...participantIds];
    const participantsData = allParticipantIds.map((id) => ({
      conversationId: newConversation.id,
      userId: id,
      role: id === userId ? ('admin' as const) : ('member' as const),
    }));

    await db.insert(conversationParticipants).values(participantsData);

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المحادثة' },
      { status: 500 }
    );
  }
}

