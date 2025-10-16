import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserAccessLevel, filterProjectByAccessLevel, logProjectAccess } from '@/lib/access-control';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }
    
    // Get session (may be null for visitors)
    const session = await getSession();
    const userId = session?.user?.id || null;
    
    // Get project with creator info
    const project = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, projectId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }
    
    // Determine user's access level
    const accessLevel = await getUserAccessLevel(userId, projectId, db);
    
    // Filter project data based on access level
    const filteredProject = filterProjectByAccessLevel(project, accessLevel);
    
    // Log access
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || undefined;
    
    await logProjectAccess(db, {
      projectId,
      userId,
      accessLevel,
      accessType: 'view',
      ipAddress,
      userAgent,
      referrer,
    });
    
    return NextResponse.json({
      success: true,
      project: filteredProject,
      accessLevel,
      needsNDA: accessLevel === 'public' && userId !== null,
      canNegotiate: project.negotiationEnabled && accessLevel === 'registered',
    });
    
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشروع', details: error.message },
      { status: 500 }
    );
  }
}

