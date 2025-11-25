import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, conversationParticipants, messages, users } from '@/lib/db/schema';
import { eq, or, and, desc, inArray } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get all conversations for this user via participants
    const userParticipations = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    if (userParticipations.length === 0) {
      return NextResponse.json({
        success: true,
        conversations: [],
      });
    }

    const conversationIds = userParticipations.map(p => p.conversationId);

    const userConversations = await db
      .select()
      .from(conversations)
      .where(inArray(conversations.id, conversationIds))
      .orderBy(desc(conversations.lastMessageAt));

    // Get details for each conversation
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        // Get other participants
        const allParticipants = await db
          .select()
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, conv.id));

        const otherParticipant = allParticipants.find(p => p.userId !== userId);
        
        let otherUser = null;
        if (otherParticipant) {
          [otherUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, otherParticipant.userId))
            .limit(1);
        }

        const [lastMessage] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conv.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Count unread messages
        const unreadMessages = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.id),
              eq(messages.recipientId, userId),
              eq(messages.read, false)
            )
          );

        return {
          ...conv,
          otherUser: otherUser ? {
            id: otherUser.id,
            name: otherUser.name,
            username: otherUser.username,
            avatar: otherUser.avatar,
          } : null,
          lastMessage: lastMessage || null,
          unreadCount: unreadMessages.length,
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
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'Other user ID is required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const otherUserIdInt = parseInt(otherUserId);

    // Check if conversation already exists between these users
    const user1Convs = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    const user2Convs = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, otherUserIdInt));

    const commonConvId = user1Convs.find(c1 => 
      user2Convs.some(c2 => c2.conversationId === c1.conversationId)
    )?.conversationId;

    if (commonConvId) {
      const [existingConv] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, commonConvId))
        .limit(1);

      return NextResponse.json({
        success: true,
        conversation: existingConv,
      });
    }

    // Create new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        type: 'direct',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    // Add both users as participants
    await db.insert(conversationParticipants).values([
      {
        conversationId: newConversation.id,
        userId: userId,
        role: 'member',
        joinedAt: new Date(),
      },
      {
        conversationId: newConversation.id,
        userId: otherUserIdInt,
        role: 'member',
        joinedAt: new Date(),
      },
    ] as any);

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
