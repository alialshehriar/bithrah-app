import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages, users } from '@/lib/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';
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

    // Get all conversations for this user
    const userConversations = await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.user1Id, userId),
          eq(conversations.user2Id, userId)
        )
      )
      .orderBy(desc(conversations.updatedAt));

    // Get the other user's details and last message for each conversation
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.user1Id === userId ? conv.user2Id : conv.user1Id;
        
        const [otherUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, otherUserId))
          .limit(1);

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
              eq(messages.receiverId, userId),
              eq(messages.isRead, false)
            )
          );

        return {
          ...conv,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            username: otherUser.username,
            avatar: otherUser.avatar,
          },
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

    // Check if conversation already exists
    const existingConversation = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(
            eq(conversations.user1Id, userId),
            eq(conversations.user2Id, otherUserIdInt)
          ),
          and(
            eq(conversations.user1Id, otherUserIdInt),
            eq(conversations.user2Id, userId)
          )
        )
      )
      .limit(1);

    if (existingConversation.length > 0) {
      return NextResponse.json({
        success: true,
        conversation: existingConversation[0],
      });
    }

    // Create new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        user1Id: userId,
        user2Id: otherUserIdInt,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

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
