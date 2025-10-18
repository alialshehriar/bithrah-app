import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const adminId = payload.id as number;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const { id: projectId } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'يجب تقديم سبب الرفض' },
        { status: 400 }
      );
    }

    // Check if project exists
    const projects = await sql`
      SELECT id, title, owner_id, status
      FROM projects
      WHERE id = ${projectId}
    `;

    if (projects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const project = projects[0];

    // Update project status to rejected
    await sql`
      UPDATE projects
      SET 
        status = 'rejected',
        updated_at = NOW()
      WHERE id = ${projectId}
    `;

    // Create notification for project owner
    try {
      await sql`
        INSERT INTO notifications (
          user_id, type, title, message, link, created_at
        ) VALUES (
          ${project.owner_id},
          'project_rejected',
          'تم رفض مشروعك',
          ${`تم رفض مشروع "${project.title}". السبب: ${reason}`},
          ${`/projects/${projectId}`},
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Continue even if notification fails
    }

    // Log admin activity
    try {
      await sql`
        INSERT INTO user_activities (
          user_id, activity_type, metadata, created_at
        ) VALUES (
          ${adminId},
          'admin_reject_project',
          ${JSON.stringify({ projectId, projectTitle: project.title, reason })},
          NOW()
        )
      `;
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
      // Continue even if activity log fails
    }

    return NextResponse.json({
      success: true,
      message: 'تم رفض المشروع بنجاح',
      project: {
        id: project.id,
        status: 'rejected'
      }
    });
  } catch (error) {
    console.error('Error rejecting project:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

