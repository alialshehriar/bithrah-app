import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// GET - Get negotiation gate and negotiations for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    const client = await pool.connect();
    try {
      // Get negotiation gate
      const gateResult = await client.query(
        `SELECT 
          ng.*,
          p.title as project_title,
          p.funding_goal,
          p.current_funding
        FROM negotiation_gates ng
        JOIN projects p ON ng.project_id = p.id
        WHERE ng.project_id = $1`,
        [projectId]
      );

      if (gateResult.rows.length === 0) {
        return NextResponse.json({
          success: true,
          gate: null,
          negotiations: [],
        });
      }

      const gate = gateResult.rows[0];

      // Get negotiations for this project
      const negotiationsResult = await client.query(
        `SELECT 
          n.id,
          n.uuid,
          n.status,
          n.amount,
          n.deposit_amount,
          n.deposit_status,
          n.agreement_reached,
          n.agreed_amount,
          n.created_at,
          n.updated_at,
          u.username as investor_name,
          u.email as investor_email
        FROM negotiations n
        JOIN users u ON n.investor_id = u.id
        WHERE n.project_id = $1
        ORDER BY n.created_at DESC
        LIMIT 50`,
        [projectId]
      );

      return NextResponse.json({
        success: true,
        gate,
        negotiations: negotiationsResult.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get negotiations error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات التفاوض' },
      { status: 500 }
    );
  }
}

// POST - Create new negotiation request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const userId = payload.userId;
    const projectId = parseInt(params.id);

    const body = await request.json();
    const { amount, message } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'المبلغ غير صحيح' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if negotiation gate exists and is open
      const gateResult = await client.query(
        `SELECT * FROM negotiation_gates WHERE project_id = $1`,
        [projectId]
      );

      if (gateResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'بوابة التفاوض غير موجودة' },
          { status: 404 }
        );
      }

      const gate = gateResult.rows[0];

      if (!gate.is_open) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'بوابة التفاوض مغلقة حالياً' },
          { status: 400 }
        );
      }

      // Check if user already has an active negotiation
      const existingResult = await client.query(
        `SELECT id FROM negotiations 
         WHERE project_id = $1 AND investor_id = $2 AND status IN ('pending', 'active')`,
        [projectId, userId]
      );

      if (existingResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'لديك طلب تفاوض نشط بالفعل' },
          { status: 400 }
        );
      }

      // Check max negotiators limit
      if (gate.max_negotiators && gate.current_negotiators >= gate.max_negotiators) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'تم الوصول للحد الأقصى من المفاوضين' },
          { status: 400 }
        );
      }

      // Create negotiation
      const negotiationResult = await client.query(
        `INSERT INTO negotiations (
          project_id,
          investor_id,
          status,
          start_date,
          end_date,
          amount,
          deposit_amount,
          deposit_status,
          has_full_access,
          metadata
        ) VALUES ($1, $2, 'pending', NOW(), NOW() + INTERVAL '30 days', $3, $4, 'pending', false, $5)
        RETURNING *`,
        [
          projectId,
          userId,
          amount,
          gate.deposit_amount || 0,
          JSON.stringify({ initial_message: message }),
        ]
      );

      // Update current negotiators count
      await client.query(
        `UPDATE negotiation_gates 
         SET current_negotiators = current_negotiators + 1 
         WHERE project_id = $1`,
        [projectId]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        negotiation: negotiationResult.rows[0],
        message: 'تم إرسال طلب التفاوض بنجاح',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create negotiation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء طلب التفاوض' },
      { status: 500 }
    );
  }
}

