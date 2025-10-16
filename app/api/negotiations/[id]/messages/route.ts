import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const negotiationId = parseInt(params.id);
    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { message, containsExternalContact } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'الرسالة فارغة' },
        { status: 400 }
      );
    }

    // Get negotiation
    const negotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'المفاوضة غير موجودة' },
        { status: 404 }
      );
    }

    // Check if user is part of this negotiation
    if (negotiation.investorId !== userId && negotiation.projectOwnerId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بإرسال رسائل في هذه المفاوضة' },
        { status: 403 }
      );
    }

    // Check if negotiation is active
    if (negotiation.status !== 'active' && negotiation.status !== 'pending') {
      return NextResponse.json(
        { error: 'هذه المفاوضة غير نشطة' },
        { status: 400 }
      );
    }

    // Check if negotiation has expired
    const now = new Date();
    const expiryDate = new Date(negotiation.expiryDate);
    if (now > expiryDate) {
      return NextResponse.json(
        { error: 'انتهت مدة التفاوض' },
        { status: 400 }
      );
    }

    // Determine receiver
    const receiverId = userId === negotiation.investorId 
      ? negotiation.projectOwnerId 
      : negotiation.investorId;

    // Check for external contact patterns (phone, email, social media, etc.)
    const externalContactPatterns = [
      /\b\d{10}\b/, // Phone numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone with separators
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b(whatsapp|واتساب|واتس|telegram|تليجرام|تلقرام)\b/i, // Messaging apps
      /\b(instagram|انستقرام|انستا|twitter|تويتر|snapchat|سناب)\b/i, // Social media
      /\b(اتصل|تواصل|راسلني|كلمني)\b/i, // Contact requests
    ];

    const hasExternalContact = externalContactPatterns.some(pattern => pattern.test(message));

    // Create message
    const [newMessage] = await db.insert(negotiationMessages).values({
      negotiationId,
      senderId: userId,
      receiverId,
      message: message.trim(),
      flaggedForReview: hasExternalContact || containsExternalContact,
    }).returning();

    // If message is flagged, update negotiation
    if (hasExternalContact || containsExternalContact) {
      await db
        .update(negotiations)
        .set({
          hasViolations: true,
          updatedAt: new Date(),
        })
        .where(eq(negotiations.id, negotiationId));
    }

    // Update negotiation status to active if it was pending
    if (negotiation.status === 'pending') {
      await db
        .update(negotiations)
        .set({
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(negotiations.id, negotiationId));
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
      warning: hasExternalContact ? 'تم الكشف عن محتوى قد يحتوي على معلومات تواصل خارجية. الرسالة قيد المراجعة.' : null,
    }, { status: 201 });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}

