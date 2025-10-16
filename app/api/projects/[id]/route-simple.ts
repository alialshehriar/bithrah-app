import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const projectId = parseInt(id);

    const result = await query(
      `SELECT 
        p.*,
        u.id as creator_id,
        u.name as creator_name,
        u.email as creator_email,
        u.avatar as creator_avatar
       FROM projects p
       LEFT JOIN users u ON p.creator_id = u.id
       WHERE p.id = $1`,
      [projectId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const project = {
      ...result[0],
      creator: {
        id: result[0].creator_id,
        name: result[0].creator_name,
        email: result[0].creator_email,
        avatar: result[0].creator_avatar,
      },
    };

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

