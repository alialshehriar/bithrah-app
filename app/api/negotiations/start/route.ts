import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users, negotiations, negotiationMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateInitialGreeting } from '@/lib/ai/negotiationAgent';

export async function POST(request: NextRequest) {
  try {
    const { projectId, investorId } = await request.json();

    if (!projectId || !investorId) {
      return NextResponse.json(
        { error: 'معلومات غير كاملة' },
        { status: 400 }
      );
    }

    // Get project details
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        creator: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Check if negotiation already exists
    const existingNegotiation = await db.query.negotiations.findFirst({
      where: (negotiations, { and, eq }) => and(
        eq(negotiations.projectId, projectId),
        eq(negotiations.investorId, investorId),
        eq(negotiations.status, 'active')
      )
    });

    if (existingNegotiation) {
      return NextResponse.json({
        negotiationId: existingNegotiation.id,
        message: 'التفاوض موجود بالفعل'
      });
    }

    // Create new negotiation
    const [negotiation] = await db.insert(negotiations).values({
      projectId,
      investorId,
      ownerId: project.creatorId,
      status: 'active',
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    } as any)
    .returning();

    // Generate initial greeting
    const context = {
      projectId: project.id,
      projectTitle: project.title,
      projectDescription: project.description,
      category: project.category,
      fundingGoal: Number(project.fundingGoal),
      currentFunding: Number(project.currentFunding),
      ownerName: project.creator?.name || 'صاحب المشروع',
    };

    const greeting = generateInitialGreeting(context);

    // Save initial message
    await db.insert(negotiationMessages).values({
      negotiationId: negotiation.id,
      senderId: project.creatorId,
      message: greeting,
      isAiGenerated: true
    } as any);

    return NextResponse.json({
      negotiationId: negotiation.id,
      greeting,
      expiresAt: negotiation.expiresAt
    });

  } catch (error) {
    console.error('Start negotiation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء بدء التفاوض' },
      { status: 500 }
    );
  }
}
