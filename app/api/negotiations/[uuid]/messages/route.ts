import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'الرسالة فارغة' },
        { status: 400 }
      );
    }

    // Get negotiation
    const [negotiation] = await db
      .select()
      .from(negotiations)
      .where(eq(negotiations.uuid, uuid))
      .limit(1);

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'جلسة التفاوض غير موجودة' },
        { status: 404 }
      );
    }

    if (negotiation.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'جلسة التفاوض غير نشطة' },
        { status: 400 }
      );
    }

    // TODO: Get current user ID from session
    const currentUserId = 1; // Temporary - should come from auth

    // Insert message
    const [newMessage] = await db
      .insert(negotiationMessages)
      .values({
        negotiationId: negotiation.id,
        senderId: currentUserId,
        content: content.trim(),
      })
      .returning();

    // Get sender info
    const [sender] = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, currentUserId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: sender?.name || 'مستخدم',
        senderAvatar: sender?.avatar || null,
        createdAt: newMessage.createdAt,
        status: newMessage.status,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال الرسالة' },
      { status: 500 }
    );
  }
}

