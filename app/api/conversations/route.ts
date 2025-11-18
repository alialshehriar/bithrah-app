import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, conversationParticipants, messages, users } from '@/lib/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get all conversations where user is a participant
    const userConversations = await db
      .select({
        id: conversations.id,
        uuid: conversations.uuid,
        type: conversations.type,
        name: conversations.name,
        avatar: conversations.avatar,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .innerJoin(
        conversationParticipants,
        eq(conversations.id, conversationParticipants.conversationId)
      )
      .where(eq(conversationParticipants.userId, userId))
      .orderBy(desc(conversations.lastMessageAt));

    // For each conversation, get the other participant(s) and last message
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conversation) => {
        // Get participants
        const participants = await db
          .select({
            id: users.id,
            name: users.name,
            username: users.username,
            avatar: users.avatar,
          })
          .from(conversationParticipants)
          .innerJoin(users, eq(conversationParticipants.userId, users.id))
          .where(
            and(
              eq(conversationParticipants.conversationId, conversation.id),
              // Exclude current user
              eq(users.id, userId) === false
            )
          );

        // Get last message
        const lastMessage = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conversation.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Get unread count
        const participant = await db
          .select()
          .from(conversationParticipants)
          .where(
            and(
              eq(conversationParticipants.conversationId, conversation.id),
              eq(conversationParticipants.userId, userId)
            )
          )
          .limit(1);

        const unreadCount = participant[0]?.lastReadAt
          ? await db
              .select()
              .from(messages)
              .where(
                and(
                  eq(messages.conversationId, conversation.id),
                  // Messages after last read
                  // @ts-ignore
                  messages.createdAt > participant[0].lastReadAt
                )
              )
              .then((msgs) => msgs.length)
          : lastMessage.length;

        return {
          ...conversation,
          participants,
          lastMessage: lastMessage[0] || null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: conversationsWithDetails,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}

// Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { recipientId, type = 'direct' } = body;

    if (!recipientId) {
      return NextResponse.json(
        { success: false, error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these two users
    if (type === 'direct') {
      const existingConversations = await db
        .select({ conversationId: conversationParticipants.conversationId })
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, userId));

      for (const conv of existingConversations) {
        const participants = await db
          .select()
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, conv.conversationId));

        if (
          participants.length === 2 &&
          participants.some((p) => p.userId === recipientId)
        ) {
          // Conversation already exists
          return NextResponse.json({
            success: true,
            conversation: await db
              .select()
              .from(conversations)
              .where(eq(conversations.id, conv.conversationId))
              .limit(1)
              .then((c) => c[0]),
            existed: true,
          });
        }
      }
    }

    // Create new conversation
    const [conversation] = await db
      .insert(conversations)
      .values({
        type,
      })
      .returning();

    // Add participants
    await db.insert(conversationParticipants).values([
      {
        conversationId: conversation.id,
        userId: userId,
        role: 'admin',
      },
      {
        conversationId: conversation.id,
        userId: recipientId,
        role: 'member',
      },
    ]);

    return NextResponse.json({
      success: true,
      conversation,
      existed: false,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
