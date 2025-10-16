import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }

    const gates = await db.execute(`
      SELECT * FROM negotiation_gates 
      WHERE project_id = ${projectId} AND is_active = true
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      gates: gates.rows || [],
    });
  } catch (error) {
    console.error('Error fetching negotiation gates:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات باب التفاوض' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, depositAmount, maxNegotiators, title, description } = body;

    if (!projectId || !depositAmount) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      );
    }

    const result = await db.execute(`
      INSERT INTO negotiation_gates (
        project_id, deposit_amount, max_negotiators, 
        title, description, is_active
      ) VALUES (
        ${projectId}, ${depositAmount}, ${maxNegotiators || null},
        '${title || 'باب التفاوض'}', 
        '${description || 'ادفع وديعة قابلة للاسترداد وادخل في تفاوض مباشر'}',
        true
      ) RETURNING *
    `);

    return NextResponse.json({
      success: true,
      gate: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating negotiation gate:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء باب التفاوض' },
      { status: 500 }
    );
  }
}

