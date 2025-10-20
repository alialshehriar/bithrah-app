import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Get project with raw SQL
    const projectResult = await db.execute(sql`
      SELECT 
        p.id, p.title, p.slug, p.funding_goal, p.current_funding, p.creator_id,
        u.name as owner_name, u.avatar as owner_avatar
      FROM projects p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.id = ${parseInt(id)}
      LIMIT 1
    `);

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Get negotiation for this project
    const negotiationResult = await db.execute(sql`
      SELECT 
        id, uuid, investor_id, status, start_date, end_date,
        amount, payment_status, has_full_access,
        agreed_amount, agreement_terms, agreement_reached,
        created_at
      FROM negotiations
      WHERE project_id = ${parseInt(id)}
      ORDER BY created_at DESC
      LIMIT 1
    `);

    let negotiation = null;
    let messages = [];

    if (negotiationResult.rows.length > 0) {
      negotiation = negotiationResult.rows[0];

      // Get messages for this negotiation
      const messagesResult = await db.execute(sql`
        SELECT 
          m.id, m.content, m.sender_id, m.created_at, m.status,
          u.name as sender_name, u.avatar as sender_avatar
        FROM negotiation_messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.negotiation_id = ${negotiation.id}
        ORDER BY m.created_at ASC
      `);

      messages = messagesResult.rows;
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.title,
        slug: project.slug,
        fundingGoal: project.funding_goal,
        currentAmount: project.current_funding,
        owner: {
          id: project.creator_id,
          name: project.owner_name,
          avatar: project.owner_avatar
        }
      },
      negotiation: negotiation ? {
        id: negotiation.id,
        uuid: negotiation.uuid,
        status: negotiation.status,
        startDate: negotiation.start_date,
        endDate: negotiation.end_date,
        depositAmount: negotiation.amount,
        depositStatus: negotiation.payment_status,
        hasFullAccess: negotiation.has_full_access,
        agreedAmount: negotiation.agreed_amount,
        agreementTerms: negotiation.agreement_terms,
        agreementReached: negotiation.agreement_reached
      } : null,
      messages: messages.map((m: any) => ({
        id: m.id,
        content: m.content,
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderAvatar: m.sender_avatar,
        createdAt: m.created_at,
        status: m.status
      }))
    });

  } catch (error) {
    console.error('Error fetching negotiation:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    );
  }
}

