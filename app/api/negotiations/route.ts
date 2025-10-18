import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, projects, users } from '@/lib/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// GET /api/negotiations - Get user's negotiations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;

    // Get negotiations where user is the investor
    const userNegotiations = await db
      .select({
        id: negotiations.id,
        projectId: negotiations.projectId,
        investorId: negotiations.investorId,
        status: negotiations.status,
        amount: negotiations.amount,
        agreedAmount: negotiations.agreedAmount,
        agreementReached: negotiations.agreementReached,
        createdAt: negotiations.createdAt,
        updatedAt: negotiations.updatedAt,
        projectTitle: projects.title,
        projectImage: projects.image,
        projectCreatorId: projects.creatorId,
      })
      .from(negotiations)
      .leftJoin(projects, eq(negotiations.projectId, projects.id))
      .where(eq(negotiations.investorId, userId))
      .orderBy(desc(negotiations.updatedAt));

    return NextResponse.json({ success: true, negotiations: userNegotiations });
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch negotiations' }, { status: 500 });
  }
}

// POST /api/negotiations - Create new negotiation
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const { projectId, receiverId, initialOffer, message } = await request.json();

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Missing project ID' }, { status: 400 });
    }

    // Calculate negotiation period (3 days)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    // Default amount (can be updated during negotiation)
    const amount = initialOffer || 1000;

    // Insert only required fields
    const [negotiation] = await db
      .insert(negotiations)
      .values({
        projectId: parseInt(projectId),
        investorId: userId,
        startDate: startDate,
        endDate: endDate,
        amount: amount.toString(),
      })
      .returning();

    // Create initial message if provided
    if (message && negotiation) {
      try {
        await db.insert(negotiationMessages).values({
          negotiationId: negotiation.id,
          senderId: userId,
          content: message,
        });
      } catch (msgError) {
        console.error('Error creating message:', msgError);
      }
    }

    // Analytics tracking can be added later

    return NextResponse.json({ success: true, negotiation });
  } catch (error) {
    console.error('Error creating negotiation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create negotiation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

