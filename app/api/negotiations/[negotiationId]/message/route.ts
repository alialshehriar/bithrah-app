import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateAIResponse } from '@/lib/ai/negotiationAgent';

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { negotiationId: string } }
) {
  try {
    const negotiationId = parseInt(params.negotiationId);

    if (isNaN(negotiationId)) {
      return NextResponse.json(
        { error: 'معرف التفاوض غير صحيح' },
        { status: 400 }
      );
    }

    // Get all messages for this negotiation
    const messages = await db
      .select()
      .from(negotiationMessages)
      .where(eq(negotiationMessages.negotiationId, negotiationId))
      .orderBy(negotiationMessages.createdAt);

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحميل الرسائل' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { negotiationId: string } }
) {
  try {
    const negotiationId = parseInt(params.negotiationId);
    const body = await request.json();
    const { message, userId } = body;

    if (isNaN(negotiationId) || !message || !userId) {
      return NextResponse.json(
        { error: 'بيانات غير كاملة' },
        { status: 400 }
      );
    }

    // Get negotiation details
    const negotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
      with: {
        project: {
          with: {
            owner: true
          }
        }
      }
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'التفاوض غير موجود' },
        { status: 404 }
      );
    }

    // Check if negotiation is still active
    if (negotiation.status !== 'active') {
      return NextResponse.json(
        { error: 'التفاوض غير نشط' },
        { status: 400 }
      );
    }

    // Check if negotiation has expired
    if (new Date() > new Date(negotiation.expiresAt)) {
      // Update status to expired
      await db
        .update(negotiations)
        .set({ status: 'expired' })
        .where(eq(negotiations.id, negotiationId));

      return NextResponse.json(
        { error: 'انتهت مدة التفاوض' },
        { status: 400 }
      );
    }

    // Save user message
    await db.insert(negotiationMessages).values({
      negotiationId,
      senderId: userId,
      message,
      isAiGenerated: false
    });

    // Get conversation history
    const conversationHistory = await db
      .select()
      .from(negotiationMessages)
      .where(eq(negotiationMessages.negotiationId, negotiationId))
      .orderBy(negotiationMessages.createdAt);

    // Prepare project context for AI
    const projectContext = {
      projectId: negotiation.project.id,
      projectTitle: negotiation.project.name,
      projectDescription: negotiation.project.description,
      category: negotiation.project.category,
      fundingGoal: negotiation.project.fundingGoal,
      currentFunding: negotiation.project.currentAmount,
      ownerName: negotiation.project.owner?.name || 'صاحب المشروع',
      timeline: negotiation.project.timeline || '12 شهر',
      teamSize: negotiation.project.teamSize,
      existingTraction: negotiation.project.traction
    };

    // Generate AI response
    const aiResponse = await generateAIResponse(
      message,
      conversationHistory.map(m => ({
        role: m.senderId === userId ? 'investor' : 'owner',
        content: m.message
      })),
      projectContext
    );

    // Save AI response
    await db.insert(negotiationMessages).values({
      negotiationId,
      senderId: negotiation.ownerId,
      message: aiResponse.message,
      isAiGenerated: true
    });

    // Check if agreement was reached
    if (aiResponse.agreementReached) {
      await db
        .update(negotiations)
        .set({
          status: 'completed',
          agreementReached: true,
          suggestedTerms: aiResponse.suggestedTerms || null,
          completedAt: new Date()
        })
        .where(eq(negotiations.id, negotiationId));
    }

    return NextResponse.json({
      success: true,
      aiMessage: aiResponse.message,
      agreementReached: aiResponse.agreementReached,
      suggestedTerms: aiResponse.suggestedTerms
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}
