import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // Get project with raw SQL to avoid schema mismatches
    const projectResult = await db.execute(sql`
      SELECT 
        p.id, p.title, p.slug, p.funding_goal, p.current_funding, p.creator_id,
        u.name as owner_name, u.avatar as owner_avatar
      FROM projects p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `);

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0] as any;

    // Get any active negotiation for this project
    const negotiationResult = await db.execute(sql`
      SELECT *
      FROM negotiations
      WHERE project_id = ${project.id}
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (negotiationResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لا توجد جلسة تفاوض نشطة' },
        { status: 404 }
      );
    }

    const negotiation = negotiationResult.rows[0] as any;

    // Get messages
    const messagesResult = await db.execute(sql`
      SELECT 
        nm.id, nm.content, nm.sender_id, nm.created_at,
        u.name as sender_name, u.avatar as sender_avatar
      FROM negotiation_messages nm
      LEFT JOIN users u ON nm.sender_id = u.id
      WHERE nm.negotiation_id = ${negotiation.id}
      ORDER BY nm.created_at ASC
    `);

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.title,
        slug: project.slug,
        fundingGoal: Number(project.funding_goal),
        currentAmount: Number(project.current_funding || 0),
        owner: {
          id: project.creator_id,
          name: project.owner_name,
          avatar: project.owner_avatar,
        },
      },
      negotiation: {
        id: negotiation.id,
        uuid: negotiation.uuid,
        status: negotiation.status,
        startDate: negotiation.start_date,
        endDate: negotiation.end_date,
        depositAmount: Number(negotiation.amount || 0),
        depositStatus: negotiation.payment_status || 'pending',
        hasFullAccess: negotiation.has_full_access || false,
        agreedAmount: negotiation.agreed_amount ? Number(negotiation.agreed_amount) : null,
        agreementTerms: negotiation.agreement_terms,
        agreementReached: negotiation.agreement_reached || false,
      },
      messages: messagesResult.rows.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderAvatar: msg.sender_avatar,
        createdAt: msg.created_at,
        status: 'sent',
      })),
    });
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

