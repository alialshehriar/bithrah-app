import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

async function verifySession(request: NextRequest) {
  try {
    const token = request.cookies.get('bithrah-token')?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { id: payload.id as number };
  } catch (error) {
    return null;
  }
}

// GET /api/negotiations/[id] - Get negotiation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const negotiationId = parseInt(id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: 'خطأ في الإعدادات' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Get negotiation details
    const negotiations = await sql`
      SELECT n.*, 
        p.title as project_title,
        p.image_url as project_image,
        p.creator_id as project_creator_id,
        u1.name as initiator_name,
        u1.avatar as initiator_avatar,
        u2.name as receiver_name,
        u2.avatar as receiver_avatar
      FROM negotiations n
      JOIN projects p ON n.project_id = p.id
      JOIN users u1 ON n.initiator_id = u1.id
      JOIN users u2 ON n.receiver_id = u2.id
      WHERE n.id = ${negotiationId} 
        AND (n.initiator_id = ${session.id} OR n.receiver_id = ${session.id})
    `;

    if (negotiations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على التفاوض' 
      }, { status: 404 });
    }

    const negotiation = negotiations[0];

    // Calculate days left
    const endDate = new Date(negotiation.end_date);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Determine other party
    const isInitiator = negotiation.initiator_id === session.id;
    const otherParty = {
      id: isInitiator ? negotiation.receiver_id : negotiation.initiator_id,
      name: isInitiator ? negotiation.receiver_name : negotiation.initiator_name,
      avatar: isInitiator ? negotiation.receiver_avatar : negotiation.initiator_avatar,
    };

    const formattedNegotiation = {
      id: negotiation.id.toString(),
      projectId: negotiation.project_id.toString(),
      projectTitle: negotiation.project_title,
      projectImage: negotiation.project_image,
      otherParty,
      status: negotiation.status,
      startDate: negotiation.start_date,
      endDate: negotiation.end_date,
      daysLeft,
      seriousnessAmount: parseFloat(negotiation.seriousness_amount || 0),
      currentOffer: parseFloat(negotiation.current_offer || 0),
      messagesCount: 0,
    };

    return NextResponse.json({ 
      success: true, 
      negotiation: formattedNegotiation 
    });
  } catch (error: any) {
    console.error('[Negotiations API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم',
      details: error?.message 
    }, { status: 500 });
  }
}

// PUT /api/negotiations/[id] - Update negotiation status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const negotiationId = parseInt(id);
    const { status, currentOffer } = await request.json();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: 'خطأ في الإعدادات' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Verify user is part of negotiation
    const negotiations = await sql`
      SELECT * FROM negotiations 
      WHERE id = ${negotiationId} 
        AND (initiator_id = ${session.id} OR receiver_id = ${session.id})
    `;

    if (negotiations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على التفاوض' 
      }, { status: 404 });
    }

    // Update negotiation
    let result;
    if (status && currentOffer !== undefined) {
      result = await sql`
        UPDATE negotiations 
        SET status = ${status}, 
            current_offer = ${currentOffer},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${negotiationId}
        RETURNING *
      `;
    } else if (status) {
      result = await sql`
        UPDATE negotiations 
        SET status = ${status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${negotiationId}
        RETURNING *
      `;
    } else if (currentOffer !== undefined) {
      result = await sql`
        UPDATE negotiations 
        SET current_offer = ${currentOffer},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${negotiationId}
        RETURNING *
      `;
    }

    return NextResponse.json({ 
      success: true, 
      negotiation: result ? result[0] : negotiations[0] 
    });
  } catch (error: any) {
    console.error('[Negotiations API] Error updating:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم',
      details: error?.message 
    }, { status: 500 });
  }
}

